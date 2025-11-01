"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { CartWishlistProvider } from "@/components/shared/cart-wishlist-context";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <CartWishlistProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 3000,
          }}
        />
      </CartWishlistProvider>
    </SessionProvider>
  );
}
