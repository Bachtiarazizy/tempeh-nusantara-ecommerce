"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, ShoppingCart, Sparkles, Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useWishlist } from "@/components/shared/wishlist-context";
import { useCart } from "@/components/shared/cart-context";
import { toast } from "sonner";

const WishlistSheet = ({ isOpen, onOpenChange }) => {
  const { items, totalItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const router = useRouter();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item) => {
    const product = {
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      image: item.image,
      variant: item.variant,
      weight: item.weight,
      quantity: 1,
    };

    const result = addToCart(product);

    if (result.success) {
      if (!isInCart(item.productId, item.variant, item.weight)) {
        toast.success("Ditambahkan ke keranjang! 🛒", {
          description: item.productName,
        });
      }
    }
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    items.forEach((item) => {
      const product = {
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        image: item.image,
        variant: item.variant,
        weight: item.weight,
        quantity: 1,
      };

      const result = addToCart(product);
      if (result.success) addedCount++;
    });

    if (addedCount > 0) {
      toast.success(`${addedCount} produk ditambahkan ke keranjang! 🛒`);
    }
  };

  const WishlistItem = ({ item }) => {
    const inCart = isInCart(item.productId, item.variant, item.weight);

    return (
      <div className="group relative bg-card hover:bg-accent/50 rounded-xl p-4 transition-all duration-200 border border-transparent hover:border-border">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative shrink-0 w-24 h-24 bg-muted rounded-lg overflow-hidden">
            {item.image ? (
              <Image src={item.image} alt={item.productName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pink-500/10 to-rose-500/5">
                <Package className="w-10 h-10 text-pink-500/40" />
              </div>
            )}

            {/* Quick Remove Button */}
            <button
              onClick={() => removeFromWishlist(item.wishlistItemId)}
              className="absolute top-1 right-1 w-6 h-6 bg-destructive/90 hover:bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5 text-destructive-foreground" />
            </button>

            {/* In Cart Badge */}
            {inCart && (
              <div className="absolute bottom-1 left-1">
                <Badge className="text-xs px-1.5 py-0 h-5 bg-primary">Di Keranjang</Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 leading-tight">{item.productName}</h4>

            {/* Variant & Weight Info */}
            {(item.variant || item.weight) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {item.variant && (
                  <Badge variant="outline" className="text-xs px-2 py-0 h-5 font-normal">
                    {item.variant}
                  </Badge>
                )}
                {item.weight && (
                  <Badge variant="outline" className="text-xs px-2 py-0 h-5 font-normal">
                    {item.weight}
                  </Badge>
                )}
              </div>
            )}

            {/* Price & Action */}
            <div className="flex items-end justify-between mt-auto">
              <p className="text-base font-bold text-primary">{formatPrice(item.price)}</p>

              {/* Add to Cart Button */}
              <Button size="sm" variant={inCart ? "outline" : "default"} className="h-8 px-3" onClick={() => handleAddToCart(item)}>
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                {inCart ? "Tambah Lagi" : "Keranjang"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold">Wishlist Saya</div>
              <div className="text-sm text-muted-foreground font-normal">{totalItems} produk favorit</div>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Wishlist Kosong</h3>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">Tandai produk favorit kamu dengan ikon hati untuk menyimpannya di sini!</p>
              <Button
                size="lg"
                onClick={() => {
                  onOpenChange(false);
                  router.push("/products");
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Jelajahi Produk
              </Button>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {items.map((item) => (
                  <WishlistItem key={item.wishlistItemId} item={item} />
                ))}
              </div>

              {/* Footer - Actions */}
              <div className="border-t bg-card px-6 py-4 space-y-3">
                {/* Summary Info */}
                <div className="bg-linear-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total {totalItems} Produk</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(items.reduce((sum, item) => sum + item.price, 0))}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Estimasi total jika semua produk dibeli</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button size="lg" className="w-full h-12 text-base bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600" onClick={handleAddAllToCart}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Tambahkan Semua ke Keranjang
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                    Lanjut Browsing
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      if (confirm("Yakin ingin menghapus semua wishlist?")) {
                        clearWishlist();
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Kosongkan Wishlist
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistSheet;
