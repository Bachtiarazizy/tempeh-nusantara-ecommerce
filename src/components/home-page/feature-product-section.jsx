// app/components/home/featured-product-section.jsx (Server Component)
import React from "react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Package, Award, Heart, Gift, Sparkles } from "lucide-react";
import { FeaturedProductContent } from "./featured-product-content";

// Fetch products di server side
async function getFeaturedProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products/featured`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export const FeaturedProductSection = async () => {
  const products = await getFeaturedProducts();

  // Categories - hanya kirim data plain object tanpa React components
  const categories = [
    { id: "all", name: "Semua Produk", icon: "Package" },
    { id: "premium", name: "Premium", icon: "Sparkles" },
    { id: "organic", name: "Organik", icon: "Award" },
    { id: "traditional", name: "Tradisional", icon: "Heart" },
    { id: "bulk", name: "Bulk Order", icon: "Gift" },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">Produk Unggulan</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Tempe Premium Pilihan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Dipilih dengan standar kualitas tertinggi untuk kepuasan Anda</p>
        </div>

        {/* Client Component untuk interaktivitas */}
        <FeaturedProductContent initialProducts={products} categories={categories} />

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link href="/products">
            <Button size="lg" variant="outline" className="gap-2">
              Lihat Semua Produk
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
