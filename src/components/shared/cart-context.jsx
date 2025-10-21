"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  SET_CART: "SET_CART",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  SET_LOADING: "SET_LOADING",
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        isLoading: false,
      };

    case CART_ACTIONS.ADD_TO_CART: {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.cartItemId === newItem.cartItemId);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) => (item.cartItemId === newItem.cartItemId ? { ...item, quantity: item.quantity + newItem.quantity } : item)),
        };
      }

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter((item) => item.cartItemId !== action.payload.cartItemId),
      };

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item)),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
      };

    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: true,
  });

  // Fetch cart from database when user logs in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchCart();
    } else if (status === "unauthenticated") {
      // Clear cart when logged out
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  }, [status, session]);

  const fetchCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await fetch("/api/cart");

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: { items: data.items },
        });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    if (!session?.user) {
      toast.error("Please login to add items to cart");
      return false;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          variant: product.variant || null,
          weight: product.weight || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: CART_ACTIONS.ADD_TO_CART,
          payload: data.item,
        });
        toast.success("Item added to cart");
        return true;
      } else {
        toast.error(data.error || "Failed to add to cart");
        return false;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
      return false;
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    if (!session?.user) {
      toast.error("Please login first");
      return false;
    }

    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({
          type: CART_ACTIONS.REMOVE_FROM_CART,
          payload: { cartItemId },
        });
        toast.success("Item removed from cart");
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to remove item");
        return false;
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
      return false;
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (!session?.user) {
      toast.error("Please login first");
      return false;
    }

    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: CART_ACTIONS.UPDATE_QUANTITY,
          payload: { cartItemId, quantity },
        });
        return true;
      } else {
        toast.error(data.error || "Failed to update quantity");
        return false;
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!session?.user) {
      toast.error("Please login first");
      return false;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
        toast.success("Cart cleared");
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to clear cart");
        return false;
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
      return false;
    }
  };

  // Cart calculations
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const uniqueProducts = state.items.length;

  // Get cart summary for checkout
  const getCartSummary = () => {
    const shipping = totalPrice > 50 ? 0 : 10;
    const tax = totalPrice * 0.1;

    return {
      items: state.items,
      totalItems,
      uniqueProducts,
      subtotal: totalPrice,
      shipping,
      tax,
      total: totalPrice + shipping + tax,
    };
  };

  const value = {
    items: state.items,
    totalItems,
    uniqueProducts,
    totalPrice,
    isLoading: state.isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartSummary,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
