"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const CartWishlistContext = createContext();

export function CartWishlistProvider({ children }) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart
  const fetchCart = async () => {
    if (!session) return;

    try {
      const response = await fetch("/api/cart");
      const result = await response.json();

      if (result.success) {
        setCart(result.data.cart);
        setCartCount(result.data.itemCount);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Fetch wishlist
  const fetchWishlist = async () => {
    if (!session) return;

    try {
      const response = await fetch("/api/wishlist");
      const result = await response.json();

      if (result.success) {
        setWishlist(result.data.wishlist);
        setWishlistCount(result.data.itemCount);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Load cart and wishlist on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
      fetchWishlist();
    } else if (status === "unauthenticated") {
      setCart(null);
      setWishlist(null);
      setCartCount(0);
      setWishlistCount(0);
    }
  }, [status, session]);

  // Add to cart
  const addToCart = async (productId, quantity = 1, variant = null, weight = null) => {
    if (!session) {
      toast.error("Silakan login terlebih dahulu");
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, variant, weight }),
      });

      const result = await response.json();

      if (result.success) {
        setCart(result.data.cart);
        setCartCount(result.data.itemCount);
        toast.success("Produk ditambahkan ke keranjang");
        return true;
      } else {
        toast.error(result.error || "Gagal menambahkan ke keranjang");
        return false;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Terjadi kesalahan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (!session) return false;

    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      const result = await response.json();

      if (result.success) {
        setCart(result.data.cart);
        setCartCount(result.data.itemCount);
        return true;
      } else {
        toast.error(result.error || "Gagal mengupdate keranjang");
        return false;
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Terjadi kesalahan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    if (!session) return false;

    setLoading(true);
    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setCart(result.data.cart);
        setCartCount(result.data.itemCount);
        toast.success("Produk dihapus dari keranjang");
        return true;
      } else {
        toast.error(result.error || "Gagal menghapus dari keranjang");
        return false;
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Terjadi kesalahan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!session) {
      toast.error("Silakan login terlebih dahulu");
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const result = await response.json();

      if (result.success) {
        setWishlist(result.data.wishlist);
        setWishlistCount(result.data.itemCount);
        toast.success("Produk ditambahkan ke wishlist");
        return true;
      } else {
        toast.error(result.error || "Gagal menambahkan ke wishlist");
        return false;
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Terjadi kesalahan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!session) return false;

    setLoading(true);
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setWishlist(result.data.wishlist);
        setWishlistCount(result.data.itemCount);
        toast.success("Produk dihapus dari wishlist");
        return true;
      } else {
        toast.error(result.error || "Gagal menghapus dari wishlist");
        return false;
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Terjadi kesalahan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    if (!wishlist) return false;
    return wishlist.items.some((item) => item.productId === productId);
  };

  // Move wishlist item to cart
  const moveToCart = async (productId, quantity = 1) => {
    const success = await addToCart(productId, quantity);
    if (success) {
      await removeFromWishlist(productId);
    }
    return success;
  };

  const value = {
    cart,
    wishlist,
    cartCount,
    wishlistCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,
    refreshCart: fetchCart,
    refreshWishlist: fetchWishlist,
  };

  return <CartWishlistContext.Provider value={value}>{children}</CartWishlistContext.Provider>;
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error("useCartWishlist must be used within CartWishlistProvider");
  }
  return context;
}
