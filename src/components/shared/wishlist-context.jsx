"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Wishlist Context
const WishlistContext = createContext();

// Wishlist Actions
const WISHLIST_ACTIONS = {
  SET_WISHLIST: "SET_WISHLIST",
  ADD_TO_WISHLIST: "ADD_TO_WISHLIST",
  REMOVE_FROM_WISHLIST: "REMOVE_FROM_WISHLIST",
  CLEAR_WISHLIST: "CLEAR_WISHLIST",
  SET_LOADING: "SET_LOADING",
};

// Wishlist Reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.SET_WISHLIST:
      return {
        ...state,
        items: action.payload.items || [],
        isLoading: false,
      };

    case WISHLIST_ACTIONS.ADD_TO_WISHLIST: {
      const newItem = action.payload;
      const exists = state.items.some((item) => item.productId === newItem.productId);

      if (exists) {
        return state;
      }

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        items: state.items.filter((item) => item.wishlistItemId !== action.payload.wishlistItemId),
      };

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        items: [],
      };

    case WISHLIST_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Wishlist Provider Component
export const WishlistProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    isLoading: true,
  });

  // Fetch wishlist from database when user logs in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchWishlist();
    } else if (status === "unauthenticated") {
      dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: false });
    }
  }, [status, session]);

  const fetchWishlist = async () => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: true });
      const response = await fetch("/api/wishlist");

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: WISHLIST_ACTIONS.SET_WISHLIST,
          payload: { items: data.items },
        });
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Add to wishlist
  const addToWishlist = async (product) => {
    if (!session?.user) {
      toast.error("Please login to add items to wishlist");
      return false;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: WISHLIST_ACTIONS.ADD_TO_WISHLIST,
          payload: data.item,
        });
        toast.success("Added to wishlist");
        return true;
      } else {
        if (data.message === "Product already in wishlist") {
          toast.info("Product already in wishlist");
        } else {
          toast.error(data.error || "Failed to add to wishlist");
        }
        return false;
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
      return false;
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    if (!session?.user) {
      toast.error("Please login first");
      return false;
    }

    try {
      const response = await fetch(`/api/wishlist/${wishlistItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({
          type: WISHLIST_ACTIONS.REMOVE_FROM_WISHLIST,
          payload: { wishlistItemId },
        });
        toast.success("Removed from wishlist");
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to remove from wishlist");
        return false;
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
      return false;
    }
  };

  // Toggle wishlist (add if not exists, remove if exists)
  const toggleWishlist = async (product) => {
    const existingItem = state.items.find((item) => item.productId === product.id);

    if (existingItem) {
      return await removeFromWishlist(existingItem.wishlistItemId);
    } else {
      return await addToWishlist(product);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return state.items.some((item) => item.productId === productId);
  };

  // Clear wishlist
  const clearWishlist = async () => {
    if (!session?.user) {
      toast.error("Please login first");
      return false;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
        toast.success("Wishlist cleared");
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to clear wishlist");
        return false;
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
      return false;
    }
  };

  const value = {
    items: state.items,
    totalItems: state.items.length,
    isLoading: state.isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist: fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Custom hook to use wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export default WishlistContext;
