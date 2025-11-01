"use client";

import { useState } from "react";
import NavbarBottom from "./navbar-bottom";
import MobileMenu from "./mobile-menu";
import CartSheet from "./cart-sheet";
import WishlistSheet from "./wishlist-sheet";
import NavbarTop from "./navbar-top";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

  return (
    <>
      <nav className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm">
        {/* Top Bar - Logo, Search, Icons */}
        <NavbarTop setIsMobileMenuOpen={setIsMobileMenuOpen} setIsCartOpen={setIsCartOpen} setIsWishlistOpen={setIsWishlistOpen} />

        {/* Bottom Bar - Main Navigation with Mega Menu */}
        <NavbarBottom activeMegaMenu={activeMegaMenu} setActiveMegaMenu={setActiveMegaMenu} />
      </nav>

      {/* Mobile Menu Sheet */}
      <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Cart Sheet */}
      <CartSheet isOpen={isCartOpen} setIsOpen={setIsCartOpen} />

      {/* Wishlist Sheet */}
      <WishlistSheet isOpen={isWishlistOpen} setIsOpen={setIsWishlistOpen} />
    </>
  );
};

export default Navbar;
