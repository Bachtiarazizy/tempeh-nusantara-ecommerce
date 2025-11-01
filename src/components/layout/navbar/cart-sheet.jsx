"use client";

import { useCartWishlist } from "@/components/shared/cart-wishlist-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, X, Package } from "lucide-react";
import { useRouter } from "next/navigation";

const CartSheet = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const { cart, updateCartItem, removeFromCart, loading } = useCartWishlist();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const items = cart?.items || [];

  // FIXED: Get price from product relation
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = Number(item.product?.price || 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  const shippingCost = totalPrice > 100000 ? 0 : 15000;

  const handleProceedToCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  const CartItem = ({ item }) => {
    // FIXED: Get data from product relation
    const product = item.product || {};
    const itemPrice = Number(product.price || 0);
    const itemImage = product.images?.[0] || null;
    const itemName = product.name || "Product";

    return (
      <div className="flex items-start gap-3 py-4 border-b last:border-0">
        <div className="shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {itemImage ? <img src={itemImage} alt={itemName} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground truncate">{itemName}</h4>
          {(item.variant || item.weight) && (
            <div className="mt-1 space-y-0.5">
              {item.variant && <p className="text-xs text-muted-foreground">Varian: {item.variant}</p>}
              {item.weight && <p className="text-xs text-muted-foreground">Ukuran: {item.weight}</p>}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{formatPrice(itemPrice)}</p>
            {item.quantity > 1 && <p className="text-xs text-muted-foreground">Total: {formatPrice(itemPrice * item.quantity)}</p>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-lg">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" onClick={() => updateCartItem(item.id, item.quantity - 1)} disabled={loading || item.quantity <= 1}>
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" onClick={() => updateCartItem(item.id, item.quantity + 1)} disabled={loading}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => removeFromCart(item.id)} disabled={loading}>
            <X className="w-3.5 h-3.5 mr-1" />
            <span className="text-xs">Hapus</span>
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
            <ShoppingCart className="w-5 h-5" />
            Keranjang Belanja
          </SheetTitle>
          <SheetDescription>
            {items.length} produk • {totalItems} total item
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium text-center">Keranjang kosong</p>
              <p className="text-sm text-muted-foreground text-center mt-1">Tambahkan produk untuk memulai</p>
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
            <>
              <div className="flex-1 overflow-y-auto -mx-6 px-6">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <div className="border-t pt-4 mt-4 bg-card">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} item):</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pengiriman:</span>
                    <span className={shippingCost === 0 ? "text-emerald-600 font-medium" : ""}>{shippingCost === 0 ? "GRATIS ✓" : formatPrice(shippingCost)}</span>
                  </div>
                  {totalPrice < 100000 && <p className="text-xs text-muted-foreground">Belanja {formatPrice(100000 - totalPrice)} lagi untuk gratis ongkir!</p>}
                </div>

                <div className="flex justify-between items-center mb-4 pt-3 border-t">
                  <span className="text-base font-semibold text-foreground">Total:</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(totalPrice + shippingCost)}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full h-11" size="lg" onClick={handleProceedToCheckout}>
                    Checkout Sekarang
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Lanjut Belanja
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

export default CartSheet;
