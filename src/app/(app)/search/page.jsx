// app/search/page.jsx
import SearchClient from "@/components/shared/search-client";
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
export default async function SearchPage({ searchParams }) {
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams;

  // Get search params
  const query = params.q || "";
  const sort = params.sort || "relevance";

  // Build where conditions
  const where = {
    status: "ACTIVE",
    ...(query && {
      OR: [{ name: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }, { sku: { contains: query, mode: "insensitive" } }],
    }),
  };

  // Determine sort order - use array format
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
      orderBy = [{ orderItems: { _count: "desc" } }];
      break;
    default:
      orderBy = query ? [{ name: "asc" }] : [{ featured: "desc" }, { createdAt: "desc" }];
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
  return <SearchClient initialProducts={transformedProducts} initialTotal={total} categoryCounts={categoryMap} initialQuery={query} initialSort={sort} />;
}

// Metadata for SEO
export async function generateMetadata({ searchParams }) {
  // Await searchParams in generateMetadata too
  const params = await searchParams;
  const query = params.q || "";

  return {
    title: query ? `Hasil Pencarian "${query}" | Tempe Premium Indonesia` : "Pencarian Produk | Tempe Premium Indonesia",
    description: query ? `Temukan produk tempe berkualitas untuk "${query}". Tempe premium, organik, dan tradisional dengan harga terbaik.` : "Cari dan temukan produk tempe berkualitas tinggi sesuai kebutuhan Anda.",
  };
}

// Enable dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds
