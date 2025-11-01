// app/products/page.jsx
import ProductsClient from "@/components/shared/products-client";
import prisma from "@/lib/prisma";

// Helper function to get badge
function getBadge(product) {
  if (product.featured) return "Featured";
  if (product.category === "premium") return "Premium";
  if (product.category === "organic") return "Organic";
  if (product.comparePrice && product.comparePrice > product.price) return "Sale";
  return null;
}

// Server Component - Fetch data directly
export default async function ProductsPage({ searchParams }) {
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams;

  // Get search params
  const category = params.category || "all";
  const sort = params.sort || "relevance";
  const filter = params.filter || "";

  // Build where conditions
  const where = {
    status: "ACTIVE",
    ...(category !== "all" && {
      category: category,
    }),
  };

  // Determine sort order - use array for multiple fields
  let orderBy = [];
  switch (sort) {
    case "price-low":
      orderBy = [{ price: "asc" }];
      break;
    case "price-high":
      orderBy = [{ price: "desc" }];
      break;
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    case "popular":
    case "best-sellers":
      orderBy = [{ orderItems: { _count: "desc" } }];
      break;
    default:
      // Multiple sort fields must be in an array
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
  }

  // Fetch products from database
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      take: 50, // Initial load limit
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  // Transform products for client
  const transformedProducts = products.map((product) => {
    const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : null;

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      originalPrice: product.comparePrice ? Number(product.comparePrice) : null,
      discount,
      stock: product.stock,
      category: product.category,
      image: product.images?.[0] || null,
      images: product.images || [],
      featured: product.featured,
      badge: getBadge(product),
      rating: null,
      reviewCount: 0,
      orderCount: product._count.orderItems,
    };
  });

  // Get category counts
  const categoryCounts = await prisma.product.groupBy({
    by: ["category"],
    where: { status: "ACTIVE" },
    _count: true,
  });

  const categoryMap = Object.fromEntries(categoryCounts.map((c) => [c.category, c._count]));

  // Pass data to client component
  return <ProductsClient initialProducts={transformedProducts} initialTotal={total} categoryCounts={categoryMap} initialCategory={category} initialSort={sort} initialFilter={filter} />;
}

// Metadata for SEO
export const metadata = {
  title: "Produk Tempe Berkualitas | Tempe Premium Indonesia",
  description: "Jelajahi koleksi lengkap produk tempe berkualitas tinggi. Tempe premium, organik, tradisional, dan paket bulk order dengan harga terbaik.",
  keywords: "tempe, tempe premium, tempe organik, beli tempe online, tempe tradisional",
};

// Enable dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds
