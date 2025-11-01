"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heart, ShoppingCart, X, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartWishlist } from "@/components/shared/cart-wishlist-context";

const WishlistSheet = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const { wishlist, removeFromWishlist, moveToCart, loading } = useCartWishlist();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const items = wishlist?.items || [];

  const handleMoveToCart = async (item) => {
    await moveToCart(item.productId, 1);
  };

  const WishlistItem = ({ item }) => {
    const product = item.product;
    const inStock = product?.stock > 0;

    return (
      <div className="flex items-start gap-3 py-4 border-b last:border-0">
        <div className="shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {item.image ? <img src={item.image} alt={item.productName} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground truncate">{item.productName}</h4>
          <p className="text-sm font-semibold text-foreground mt-2">{formatPrice(item.price)}</p>
          {inStock ? (
            <Badge variant="outline" className="mt-2 text-xs text-emerald-600 border-emerald-600">
              Tersedia
            </Badge>
          ) : (
            <Badge variant="outline" className="mt-2 text-xs text-red-600 border-red-600">
              Stok Habis
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" className="h-8 text-xs" disabled={!inStock || loading} onClick={() => handleMoveToCart(item)}>
            <ShoppingCart className="w-3.5 h-3.5 mr-1" />
            Beli
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:bg-destructive/10" onClick={() => removeFromWishlist(item.productId)} disabled={loading}>
            <X className="w-3.5 h-3.5 mr-1" />
            Hapus
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Wishlist Saya
          </SheetTitle>
          <SheetDescription>{items.length} produk tersimpan</SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium text-center">Wishlist kosong</p>
              <p className="text-sm text-muted-foreground text-center mt-1">Simpan produk favorit Anda di sini</p>
              <Button
                className="mt-4"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/products");
                }}
              >
                Mulai Belanja
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <WishlistItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistSheet;
