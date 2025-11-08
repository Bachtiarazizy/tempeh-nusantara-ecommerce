"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart dari localStorage saat pertama kali
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart_items");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setItems(parsedCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Simpan cart ke localStorage setiap kali ada perubahan
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        localStorage.setItem("cart_items", JSON.stringify(items));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [items, isInitialized]);

  // Generate unique cart item ID
  const generateCartItemId = (productId, variant, weight) => {
    return `${productId}-${variant || "default"}-${weight || "default"}`;
  };

  // Add item to cart
  const addToCart = (product) => {
    try {
      const cartItemId = generateCartItemId(product.productId, product.variant, product.weight);

      setItems((prevItems) => {
        // Check if item already exists
        const existingItemIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

        if (existingItemIndex > -1) {
          // Update quantity if item exists
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + (product.quantity || 1),
          };

          toast.success("Kuantitas diperbarui!", {
            description: `${product.productName} (${updatedItems[existingItemIndex].quantity} item)`,
          });

          return updatedItems;
        } else {
          // Add new item
          const newItem = {
            cartItemId,
            productId: product.productId,
            productName: product.productName || product.name,
            price: product.price,
            image: product.image,
            variant: product.variant,
            weight: product.weight,
            quantity: product.quantity || 1,
            addedAt: new Date().toISOString(),
          };

          return [...prevItems, newItem];
        }
      });

      return { success: true };
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Gagal menambahkan ke keranjang");
      return { success: false, error };
    }
  };

  // Update quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        // If quantity is 0, remove item
        removeFromCart(cartItemId);
        return { success: true };
      }

      setItems((prevItems) => prevItems.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item)));

      return { success: true };
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Gagal memperbarui kuantitas");
      return { success: false, error };
    }
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    try {
      setItems((prevItems) => {
        const itemToRemove = prevItems.find((item) => item.cartItemId === cartItemId);

        if (itemToRemove) {
          toast.success("Dihapus dari keranjang", {
            description: itemToRemove.productName,
          });
        }

        return prevItems.filter((item) => item.cartItemId !== cartItemId);
      });

      return { success: true };
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Gagal menghapus item");
      return { success: false, error };
    }
  };

  // Clear entire cart
  const clearCart = () => {
    try {
      setItems([]);
      toast.success("Keranjang dikosongkan");
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Gagal mengosongkan keranjang");
      return { success: false, error };
    }
  };

  // Get item from cart
  const getItem = (cartItemId) => {
    return items.find((item) => item.cartItemId === cartItemId);
  };

  // Check if product is in cart
  const isInCart = (productId, variant, weight) => {
    const cartItemId = generateCartItemId(productId, variant, weight);
    return items.some((item) => item.cartItemId === cartItemId);
  };

  // Get quantity of specific product
  const getProductQuantity = (productId, variant, weight) => {
    const cartItemId = generateCartItemId(productId, variant, weight);
    const item = items.find((item) => item.cartItemId === cartItemId);
    return item ? item.quantity : 0;
  };

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const uniqueProducts = items.length;

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const subtotal = totalPrice;

  // Shipping calculation (gratis ongkir di atas 100k)
  const shippingThreshold = 100000;
  const shippingCost = totalPrice >= shippingThreshold ? 0 : 15000;
  const freeShipping = totalPrice >= shippingThreshold;

  // Final total
  const finalTotal = totalPrice + shippingCost;

  // Get cart summary
  const getCartSummary = () => ({
    items,
    totalItems,
    uniqueProducts,
    subtotal,
    shippingCost,
    freeShipping,
    totalPrice: finalTotal,
    needToSpendForFreeShipping: Math.max(0, shippingThreshold - totalPrice),
  });

  const value = {
    // State
    items,
    totalItems,
    uniqueProducts,
    totalPrice,
    subtotal,
    shippingCost,
    freeShipping,
    finalTotal,
    isInitialized,

    // Methods
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItem,
    isInCart,
    getProductQuantity,
    getCartSummary,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook untuk menggunakan cart context
export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

// Export CartContext untuk keperluan testing atau advanced usage
export { CartContext };
