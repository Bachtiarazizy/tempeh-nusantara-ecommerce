"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Package, ShoppingCart, Heart } from "lucide-react";

export default function ProductCard({ product, viewMode = "grid", isInWishlist, onAddToCart, onWishlistToggle, actionLoading = false }) {
  const router = useRouter();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow group relative ${viewMode === "list" ? "flex" : ""}`}>
      {/* Wishlist Button */}
      <button
        onClick={(e) => onWishlistToggle(e, product)}
        disabled={actionLoading}
        className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border flex items-center justify-center hover:bg-background transition-colors"
      >
        <Heart className={`w-4 h-4 ${isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
      </button>

      {/* Image Container - Fixed Aspect Ratio */}
      <div className={`${viewMode === "list" ? "w-48 h-48 shrink-0" : "aspect-square"} relative cursor-pointer overflow-hidden bg-muted`} onClick={() => router.push(`/products/${product.slug}`)}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        {product.discount && (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="text-xs">
              -{product.discount}%
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="cursor-pointer flex-1" onClick={() => router.push(`/products/${product.slug}`)}>
          {/* Product Name & Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
            {product.badge && (
              <Badge variant="secondary" className="text-xs shrink-0">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
            </div>
          )}

          {/* Price & Stock */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
              {product.originalPrice && product.originalPrice > product.price && <p className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>}
            </div>

            {product.stock !== undefined && <span className={`text-xs ${product.stock > 0 ? "text-emerald-600" : "text-destructive"}`}>{product.stock > 0 ? `Stok: ${product.stock}` : "Habis"}</span>}
          </div>

          {/* Description (List View Only) */}
          {viewMode === "list" && product.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>}
        </div>

        {/* Add to Cart Button */}
        <Button onClick={(e) => onAddToCart(e, product)} disabled={actionLoading || product.stock === 0} className="w-full" size="sm">
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
        </Button>
      </CardContent>
    </Card>
  );
}
