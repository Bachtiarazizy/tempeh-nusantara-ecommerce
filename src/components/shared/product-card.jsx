"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Check, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "./cart-context";
import { useWishlist } from "./wishlist-context";

const ProductCard = ({ id, name, price, originalPrice, weight, image, category, rating = 0, reviewCount = 0, isNew = false, isOnSale = false, discount = 0, className = "", slug, variant = null }) => {
  const [mounted, setMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Check if product is in wishlist
  const isFavorited = isInWishlist(id);

  // Ensure component is hydrated before showing interactive elements
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate slug from product name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const productSlug = slug || generateSlug(name);

  const handleProductClick = () => {
    // Use Next.js router for navigation instead of window.location
    if (typeof window !== "undefined") {
      window.location.href = `/products/${productSlug}`;
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!mounted) return;

    setIsAdding(true);

    try {
      // Add to cart using context (with API call)
      const success = await addToCart({
        id,
        name,
        price,
        originalPrice,
        weight,
        image,
        category,
        variant,
      });

      if (success) {
        // Show success feedback
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!mounted) return;

    // Toggle wishlist using context (with API call)
    await toggleWishlist({
      id,
      name,
      price,
      originalPrice,
      weight,
      image,
      category,
      slug: productSlug,
    });
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-gray-100 cursor-pointer ${className}`} onClick={handleProductClick}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && (
          <Badge variant="secondary" className="bg-green-500 text-white hover:bg-green-600">
            New
          </Badge>
        )}
        {isOnSale && discount > 0 && (
          <Badge variant="destructive" className="bg-red-500 text-white hover:bg-red-600">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Favorite Button - Only show if mounted to prevent hydration issues */}
      {mounted && (
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 ${isFavorited ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
          onClick={handleToggleFavorite}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </Button>
      )}

      {/* Product Image */}
      <div className="p-0">
        <div className="aspect-square overflow-hidden bg-gray-50">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {category && <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{category}</div>}

        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">{name}</h3>

        {weight && <p className="text-sm text-gray-500 mb-2">{weight}</p>}

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          {originalPrice && originalPrice > price && <span className="text-sm text-gray-500 line-through">{formatPrice(originalPrice)}</span>}
        </div>
      </div>

      {/* Add to Cart Button - Only show if mounted */}
      <div className="p-4 pt-0">
        {mounted ? (
          <Button className="w-full" onClick={handleAddToCart} disabled={isAdding || justAdded}>
            {isAdding ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </div>
            ) : justAdded ? (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Added to Cart!
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </div>
            )}
          </Button>
        ) : (
          <Button className="w-full" disabled>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </div>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
