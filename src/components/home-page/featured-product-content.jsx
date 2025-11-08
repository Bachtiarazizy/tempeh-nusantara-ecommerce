// app/components/home/featured-product-content.tsx (Client Component)
"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Package, Award, Heart, Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../shared/cart-context";
import { useWishlist } from "../shared/wishlist-context";
import { ProductCard } from "../shared/product-card";

export const FeaturedProductContent = ({ initialProducts, categories }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  // Map string icon names to actual components
  const iconMap = {
    Package,
    Sparkles,
    Award,
    Heart,
    Gift,
  };

  const filteredProducts = activeCategory === "all" ? initialProducts : initialProducts.filter((p) => p.category.toLowerCase() === activeCategory);

  const getBadgeInfo = (product) => {
    if (product.sales > 5000) {
      return { badge: "Best Seller", color: "bg-yellow-500" };
    }
    if (product.category.toLowerCase() === "organic") {
      return { badge: "Organic", color: "bg-green-500" };
    }
    if (product.sales > 3000) {
      return { badge: "Popular", color: "bg-blue-500" };
    }
    if (product.category.toLowerCase().includes("bulk")) {
      return { badge: "Wholesale", color: "bg-purple-500" };
    }
    return { badge: "Featured", color: "bg-primary" };
  };

  const calculateDiscount = (price, comparePrice) => {
    if (!comparePrice || comparePrice <= price) return undefined;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  const handleAddToCart = (productId) => {
    try {
      const product = initialProducts.find((p) => p.id === productId);

      if (!product) {
        toast.error("Produk tidak ditemukan");
        return;
      }

      if (product.stock <= 0) {
        toast.error("Stok produk habis", {
          description: product.name,
        });
        return;
      }

      const result = addToCart({
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: product.images[0],
        variant: null,
        weight: null,
        quantity: 1,
      });

      if (result.success) {
        toast.success("Ditambahkan ke keranjang! 🛒", {
          description: product.name,
          action: {
            label: "Lihat Keranjang",
            onClick: () => {
              const cartButton = document.querySelector("[data-cart-trigger]");
              if (cartButton instanceof HTMLElement) {
                cartButton.click();
              }
            },
          },
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Gagal menambahkan ke keranjang");
    }
  };

  const handleAddToWishlist = (productId) => {
    try {
      const product = initialProducts.find((p) => p.id === productId);

      if (!product) {
        toast.error("Produk tidak ditemukan");
        return;
      }

      toggleWishlist({
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: product.images[0],
        variant: null,
        weight: null,
        category: product.category,
        description: product.description,
      });
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Gagal memperbarui wishlist");
    }
  };

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon] || Package;

          return (
            <Button key={category.id} variant={activeCategory === category.id ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(category.id)} className="gap-2">
              <IconComponent className="w-4 h-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => {
            const badgeInfo = getBadgeInfo(product);
            const discount = calculateDiscount(product.price, product.comparePrice);

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.comparePrice || undefined}
                rating={product.rating || 0}
                reviews={product.reviewCount}
                image={product.images[0]}
                badge={badgeInfo.badge}
                badgeColor={badgeInfo.color}
                sold={product.sales}
                discount={discount}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Tidak ada produk untuk kategori ini</p>
        </div>
      )}
    </>
  );
};
