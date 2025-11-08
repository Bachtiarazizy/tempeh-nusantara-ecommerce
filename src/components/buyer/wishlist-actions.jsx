// app/buyer/wishlist/components/wishlist-actions.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export function WishlistActions({ itemId, productId, productName, isAvailable, stock, itemCount, showButtons = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleAddToCart = async () => {
    if (!isAvailable) {
      toast.error("Produk tidak tersedia");
      return;
    }

    if (stock === 0) {
      toast.error("Stok produk habis");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Ditambahkan ke keranjang! 🛒", {
          description: productName,
          action: {
            label: "Lihat Keranjang",
            onClick: () => {
              const cartButton = document.querySelector("[data-cart-trigger]");
              if (cartButton instanceof HTMLElement) {
                cartButton.click();
              }
            },
          },
        });
      } else {
        toast.error(data.error || "Gagal menambahkan ke keranjang");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Gagal menambahkan ke keranjang");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Produk dihapus dari wishlist");
        router.refresh();
      } else {
        toast.error(data.error || "Gagal menghapus produk");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Gagal menghapus produk");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/wishlist/clear", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Wishlist berhasil dikosongkan");
        router.refresh();
      } else {
        toast.error(data.error || "Gagal mengosongkan wishlist");
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Gagal mengosongkan wishlist");
    } finally {
      setLoading(false);
      setShowClearDialog(false);
    }
  };

  // Render action buttons for individual items
  if (showButtons) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button onClick={handleAddToCart} disabled={loading || !isAvailable || stock === 0} size="sm" className="gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Keranjang</span>
          </Button>
          <Button onClick={() => setShowDeleteDialog(true)} disabled={loading} size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus dari Wishlist?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus <strong>{productName}</strong> dari wishlist? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveItem} disabled={loading} className="bg-red-600 hover:bg-red-700">
                {loading ? "Menghapus..." : "Hapus"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Render clear all button in header
  return (
    <>
      <Button onClick={() => setShowClearDialog(true)} disabled={loading || !itemCount} size="sm" variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
        <Trash2 className="w-4 h-4" />
        Kosongkan Semua
      </Button>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kosongkan Wishlist?</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin menghapus semua {itemCount} produk dari wishlist? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? "Menghapus..." : "Kosongkan Semua"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
