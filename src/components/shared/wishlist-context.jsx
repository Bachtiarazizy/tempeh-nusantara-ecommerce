"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist dari localStorage saat pertama kali
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedWishlist = localStorage.getItem("wishlist_items");
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist);
          setItems(parsedWishlist);
        }
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Simpan wishlist ke localStorage setiap kali ada perubahan
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        localStorage.setItem("wishlist_items", JSON.stringify(items));
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
      }
    }
  }, [items, isInitialized]);

  // Generate unique wishlist item ID
  const generateWishlistItemId = (productId, variant, weight) => {
    return `${productId}-${variant || "default"}-${weight || "default"}`;
  };

  // Add item to wishlist
  const addToWishlist = (product) => {
    try {
      const wishlistItemId = generateWishlistItemId(product.productId, product.variant, product.weight);

      setItems((prevItems) => {
        // Check if item already exists
        const existingItem = prevItems.find((item) => item.wishlistItemId === wishlistItemId);

        if (existingItem) {
          toast.info("Sudah ada di wishlist", {
            description: product.productName || product.name,
          });
          return prevItems;
        }

        // Add new item
        const newItem = {
          wishlistItemId,
          productId: product.productId,
          productName: product.productName || product.name,
          price: product.price,
          image: product.image,
          variant: product.variant,
          weight: product.weight,
          category: product.category,
          description: product.description,
          addedAt: new Date().toISOString(),
        };

        toast.success("Ditambahkan ke wishlist! ❤️", {
          description: product.productName || product.name,
        });

        return [...prevItems, newItem];
      });

      return { success: true };
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Gagal menambahkan ke wishlist");
      return { success: false, error };
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = (wishlistItemId) => {
    try {
      setItems((prevItems) => {
        const itemToRemove = prevItems.find((item) => item.wishlistItemId === wishlistItemId);

        if (itemToRemove) {
          toast.success("Dihapus dari wishlist", {
            description: itemToRemove.productName,
          });
        }

        return prevItems.filter((item) => item.wishlistItemId !== wishlistItemId);
      });

      return { success: true };
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Gagal menghapus item");
      return { success: false, error };
    }
  };

  // Toggle wishlist (add if not exists, remove if exists)
  const toggleWishlist = (product) => {
    const wishlistItemId = generateWishlistItemId(product.productId, product.variant, product.weight);
    const isInList = items.some((item) => item.wishlistItemId === wishlistItemId);

    if (isInList) {
      return removeFromWishlist(wishlistItemId);
    } else {
      return addToWishlist(product);
    }
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    try {
      setItems([]);
      toast.success("Wishlist dikosongkan");
      return { success: true };
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Gagal mengosongkan wishlist");
      return { success: false, error };
    }
  };

  // Get item from wishlist
  const getItem = (wishlistItemId) => {
    return items.find((item) => item.wishlistItemId === wishlistItemId);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId, variant, weight) => {
    const wishlistItemId = generateWishlistItemId(productId, variant, weight);
    return items.some((item) => item.wishlistItemId === wishlistItemId);
  };

  // Get wishlist summary
  const getWishlistSummary = () => ({
    items,
    totalItems: items.length,
    totalValue: items.reduce((sum, item) => sum + item.price, 0),
  });

  const value = {
    // State
    items,
    totalItems: items.length,
    isInitialized,

    // Methods
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    getItem,
    isInWishlist,
    getWishlistSummary,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Custom hook untuk menggunakan wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
};

// Export WishlistContext untuk keperluan testing atau advanced usage
export { WishlistContext };
