"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Heart, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartWishlist } from "@/components/shared/cart-wishlist-context";
import UserMenu from "../user-menu";

const NavbarTop = ({ setIsMobileMenuOpen, setIsCartOpen, setIsWishlistOpen }) => {
  const router = useRouter();
  const { cartCount, wishlistCount } = useCartWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <div className="shrink-0">
          <a href="/" className="flex items-center">
            <Image src="/logo.png" width={120} height={40} alt="Tempe Nusantara" priority className="h-10 w-auto" />
          </a>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full bg-muted/50">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Cari produk tempe premium..."
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/search?q=${e.currentTarget.value}`);
                }
              }}
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1">
          {/* Search Icon - Mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => router.push("/search")}>
            <Search className="w-5 h-5" />
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsWishlistOpen(true)}>
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">{wishlistCount}</Badge>}
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">{cartCount > 99 ? "99+" : cartCount}</Badge>}
          </Button>

          {/* User Menu */}
          <UserMenu />

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarTop;
