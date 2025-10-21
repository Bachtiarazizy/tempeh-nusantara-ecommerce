"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/shared/cart-context";
import { WishlistProvider } from "@/components/shared/wishlist-context";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 3000,
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
