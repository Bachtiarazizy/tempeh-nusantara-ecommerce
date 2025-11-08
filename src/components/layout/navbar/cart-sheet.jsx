"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, X, Trash2, ShoppingBag, Truck, Gift, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/shared/cart-context";

const CartSheet = ({ isOpen, onOpenChange }) => {
  const { items, totalItems, uniqueProducts, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const shippingThreshold = 100000;
  const shippingCost = 15000;
  const freeShipping = totalPrice >= shippingThreshold;
  const needToSpend = shippingThreshold - totalPrice;
  const finalTotal = totalPrice + (freeShipping ? 0 : shippingCost);

  const handleCheckout = () => {
    onOpenChange(false);
    router.push("/checkout");
  };

  const CartItem = ({ item }) => (
    <div className="group relative bg-card hover:bg-accent/50 rounded-xl p-4 transition-all duration-200 border border-transparent hover:border-border">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative shrink-0 w-24 h-24 bg-muted rounded-lg overflow-hidden">
          {item.image ? (
            <Image src={item.image} alt={item.productName || item.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
              <ShoppingBag className="w-10 h-10 text-primary/40" />
            </div>
          )}

          {/* Quick Remove Button */}
          <button
            onClick={() => removeFromCart(item.cartItemId)}
            className="absolute top-1 right-1 w-6 h-6 bg-destructive/90 hover:bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5 text-destructive-foreground" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 leading-tight">{item.productName || item.name}</h4>

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

          {/* Price & Quantity Controls */}
          <div className="flex items-end justify-between mt-auto">
            <div>
              <p className="text-base font-bold text-primary">{formatPrice(item.price)}</p>
              {item.quantity > 1 && <p className="text-xs text-muted-foreground mt-0.5">Total: {formatPrice(item.price * item.quantity)}</p>}
            </div>

            {/* Quantity Buttons */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-background" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold">Keranjang Belanja</div>
              <div className="text-sm text-muted-foreground font-normal">
                {uniqueProducts} produk • {totalItems} item
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
              <div className="w-20 h-20 bg-linear-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-primary/60" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Keranjang Kosong</h3>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">Yuk, mulai belanja dan temukan produk tempe premium favorit kamu!</p>
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
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {items.map((item) => (
                  <CartItem key={item.cartItemId} item={item} />
                ))}
              </div>

              {/* Footer - Summary & Actions */}
              <div className="border-t bg-card px-6 py-4 space-y-4">
                {/* Free Shipping Progress */}
                {!freeShipping && needToSpend > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-amber-900 dark:text-amber-100">Belanja {formatPrice(needToSpend)} lagi untuk gratis ongkir!</p>
                        <div className="mt-2 h-1.5 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${(totalPrice / shippingThreshold) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {freeShipping && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                      <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100">Yeay! Kamu dapat gratis ongkir ✨</p>
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} item)</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkir</span>
                    <span className={freeShipping ? "text-emerald-600 font-semibold" : "font-medium"}>{freeShipping ? "GRATIS" : formatPrice(shippingCost)}</span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold">Total Bayar</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button size="lg" className="w-full h-12 text-base" onClick={handleCheckout}>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Lanjut ke Checkout
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                    Lanjut Belanja
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      if (confirm("Yakin ingin mengosongkan keranjang?")) {
                        clearCart();
                      }
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Kosongkan Keranjang
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
