import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Heart, Package, ShoppingCart, Star } from "lucide-react";

export const ProductCard = ({ id, name, price, originalPrice, rating, reviews, image, badge, badgeColor = "bg-blue-500", sold, discount, onAddToCart, onAddToWishlist }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatSold = (count) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K+ terjual`;
    }
    return `${count} terjual`;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart?.(id);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    onAddToWishlist?.(id);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square bg-linear-to-br from-muted to-muted/50 overflow-hidden">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-24 h-24 text-muted-foreground/20" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {badge && <Badge className={`${badgeColor} text-white border-0`}>{badge}</Badge>}
            {discount && <Badge className="bg-red-500 text-white border-0">-{discount}%</Badge>}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-lg" onClick={handleAddToWishlist}>
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button className="gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4" />
              Tambah ke Keranjang
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>

          {/* Rating & Sold */}
          <div className="flex items-center gap-3 mb-3 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviews})</span>
            </div>
            <span className="text-muted-foreground">• {formatSold(sold)}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">{formatPrice(price)}</p>
              {originalPrice && <p className="text-sm text-muted-foreground line-through">{formatPrice(originalPrice)}</p>}
            </div>
            <Button size="icon" className="h-10 w-10 rounded-full" onClick={handleAddToCart}>
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
