// src/app/(app)/layout.js

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { CartProvider } from "@/components/shared/cart-context";

export const metadata = {
  title: "Tempeh Nusantara",
  description: "Discover the authentic taste of Indonesia with our premium tempeh products, crafted for health-conscious consumers worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
