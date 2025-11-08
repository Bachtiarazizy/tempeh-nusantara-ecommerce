"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Menu, Search, Heart } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "../shared/cart-context";
import { useWishlist } from "../shared/wishlist-context";
import UserMenu from "./navbar/user-menu";
import MegaMenu, { MAIN_NAVIGATION } from "./navbar/mega-menu";
import CartSheet from "./navbar/cart-sheet";
import WishlistSheet from "./navbar/wishlist-sheet";

// Memoized Mobile Menu Item
const MobileMenuItem = memo(({ href, children }) => (
  <a href={href} className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors">
    {children}
  </a>
));

MobileMenuItem.displayName = "MobileMenuItem";

// Memoized Icon Button Component
const IconButton = memo(({ onClick, icon: Icon, badge, className = "" }) => (
  <Button variant="ghost" size="icon" className={`relative ${className}`} onClick={onClick}>
    <Icon className="w-5 h-5" />
    {badge > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">{badge > 99 ? "99+" : badge}</Badge>}
  </Button>
));

IconButton.displayName = "IconButton";

// Memoized Wishlist Button dengan badge merah
const WishlistButton = memo(({ onClick, count }) => (
  <Button variant="ghost" size="icon" className="relative" onClick={onClick}>
    <Heart className="w-5 h-5" />
    {count > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">{count}</Badge>}
  </Button>
));

WishlistButton.displayName = "WishlistButton";

const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Cart & Wishlist context
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  // Listen untuk event openCart dari ProductCard (optimized dengan cleanup)
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("openCart", handleOpenCart);
    return () => window.removeEventListener("openCart", handleOpenCart);
  }, []);

  // Search handler
  const handleSearch = (e) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      router.push(`/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`);
    }
  };

  return (
    <>
      <nav className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        {/* MAIN BAR */}
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
                  onKeyDown={handleSearch}
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Search Icon - Mobile */}
              <IconButton onClick={() => router.push("/search")} icon={Search} className="lg:hidden" badge={0} />

              {/* Wishlist Button */}
              <WishlistButton onClick={() => setIsWishlistOpen(true)} count={wishlistCount} />

              {/* Cart Button */}
              <IconButton onClick={() => setIsCartOpen(true)} icon={ShoppingCart} badge={cartCount} />

              {/* User Menu */}
              <UserMenu />

              {/* Mobile Menu */}
              <div className="lg:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <nav className="space-y-1">
                        <MobileMenuItem href="/">Home</MobileMenuItem>
                        {MAIN_NAVIGATION.map((item) => (
                          <MobileMenuItem key={item.name} href={item.href}>
                            {item.name}
                          </MobileMenuItem>
                        ))}
                      </nav>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR - Main Navigation with Mega Menu */}
        <MegaMenu />
      </nav>

      {/* Cart & Wishlist Sheets */}
      <CartSheet isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
      <WishlistSheet isOpen={isWishlistOpen} onOpenChange={setIsWishlistOpen} />
    </>
  );
};

export default memo(Navbar);
