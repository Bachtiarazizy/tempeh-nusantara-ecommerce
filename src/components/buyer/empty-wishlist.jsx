// app/buyer/wishlist/components/empty-wishlist.jsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star, TrendingUp } from "lucide-react";

export function EmptyWishlist() {
  const benefits = [
    {
      icon: Heart,
      title: "Simpan Favorit",
      description: "Tandai produk yang Anda suka untuk dibeli nanti",
    },
    {
      icon: Star,
      title: "Lacak Harga",
      description: "Pantau perubahan harga produk favorit Anda",
    },
    {
      icon: TrendingUp,
      title: "Belanja Cerdas",
      description: "Beli saat harga terbaik dan stok tersedia",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wishlist Saya</h1>
        <p className="text-sm text-muted-foreground mt-1">Simpan produk favorit untuk dibeli nanti</p>
      </div>

      {/* Empty State Card */}
      <Card className="border-dashed">
        <div className="p-12 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-linear-to-br from-red-500/10 to-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-500" />
          </div>

          {/* Text */}
          <h2 className="text-xl font-semibold text-foreground mb-2">Wishlist Anda Masih Kosong</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">Mulai tambahkan produk favorit Anda ke wishlist untuk memudahkan belanja di kemudian hari</p>

          {/* Action Button */}
          <Button asChild size="lg" className="gap-2">
            <a href="/products">
              <ShoppingBag className="w-4 h-4" />
              Jelajahi Produk
            </a>
          </Button>
        </div>
      </Card>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500/10 to-blue-500/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-2">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Tips */}
      <Card className="bg-linear-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Tips Menggunakan Wishlist</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Klik ikon <Heart className="w-3 h-3 inline" /> pada produk untuk menambahkan ke wishlist
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Akses wishlist kapan saja untuk melihat produk favorit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Tambahkan langsung ke keranjang saat siap untuk membeli</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
