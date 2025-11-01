// components/home/product-section.jsx
import prisma from "@/lib/prisma";
import ProductCard from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Package, Leaf, Award, Box } from "lucide-react";
import Link from "next/link";

// Helper function to get badge
function getBadge(product) {
  if (product.featured) return { label: "Featured", color: "bg-yellow-500" };
  if (product.category === "premium") return { label: "Premium", color: "bg-purple-500" };
  if (product.category === "organic") return { label: "Organic", color: "bg-green-500" };
  if (product.category === "traditional") return { label: "Popular", color: "bg-blue-500" };
  if (product.category === "bulk") return { label: "Wholesale", color: "bg-indigo-500" };
  if (product.comparePrice && product.comparePrice > product.price) return { label: "Sale", color: "bg-red-500" };
  return null;
}

// Category icons mapping
const categoryIcons = {
  all: Sparkles,
  premium: Award,
  organic: Leaf,
  traditional: Package,
  bulk: Box,
};

// Server Component - fetch data directly
export default async function ProductSection() {
  // Fetch featured products from database
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      featured: true, // Only featured products for homepage
    },
    orderBy: [{ featured: "desc" }, { orderItems: { _count: "desc" } }, { createdAt: "desc" }],
    take: 6, // Show 6 featured products
    include: {
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
  });

  // If no featured products, get the latest ones
  const fallbackProducts =
    products.length === 0
      ? await prisma.product.findMany({
          where: { status: "ACTIVE" },
          orderBy: [{ createdAt: "desc" }],
          take: 6,
          include: {
            _count: {
              select: {
                orderItems: true,
              },
            },
          },
        })
      : [];

  const displayProducts = products.length > 0 ? products : fallbackProducts;

  // Transform products for display
  const transformedProducts = displayProducts.map((product) => {
    const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : null;

    const badge = getBadge(product);

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
      badge: badge?.label || null,
      badgeColor: badge?.color || "bg-primary",
      rating: 4.8, // Default rating, replace with actual if available
      reviews: product._count.orderItems * 2 || 0, // Estimate reviews from orders
      sold: `${Math.floor(product._count.orderItems / 100) || 1}K+ terjual`,
      orderCount: product._count.orderItems,
    };
  });

  // Get category counts for quick links
  const categoryCounts = await prisma.product.groupBy({
    by: ["category"],
    where: { status: "ACTIVE" },
    _count: true,
  });

  // Quick category links
  const categories = [
    { id: "all", name: "Semua Produk", icon: Sparkles },
    { id: "premium", name: "Premium", icon: Award },
    { id: "organic", name: "Organik", icon: Leaf },
    { id: "traditional", name: "Tradisional", icon: Package },
    { id: "bulk", name: "Bulk Order", icon: Box },
  ];

  return (
    <section className="py-20 bg-linear-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 text-sm px-4 py-1">
            <Sparkles className="w-3 h-3 mr-1 inline" />
            Produk Unggulan
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Tempe Premium Pilihan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Dipilih dengan standar kualitas tertinggi untuk kepuasan Anda</p>
        </div>

        {/* Quick Category Links */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const count = categoryCounts.find((c) => c.category === category.id)?._count || 0;

            return (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Button variant="outline" size="sm" className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all">
                  <Icon className="w-4 h-4" />
                  {category.name}
                  {category.id !== "all" && count > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {count}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Products Grid */}
        {transformedProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {transformedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">Belum ada produk tersedia</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link href="/products">
            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
              Lihat Semua Produk
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Force dynamic rendering to get fresh data
export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes
