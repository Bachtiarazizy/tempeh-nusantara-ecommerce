// app/buyer/wishlist/page.jsx (Server Component)
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { Heart, ShoppingCart, Trash2, Package, TrendingUp, Star, DollarSign } from "lucide-react";
import Image from "next/image";
import { EmptyWishlist } from "@/components/buyer/empty-wishlist";
import { WishlistActions } from "@/components/buyer/wishlist-actions";

// Fetch wishlist data from database
async function getWishlistData(userId) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                sku: true,
                name: true,
                slug: true,
                price: true,
                comparePrice: true,
                stock: true,
                status: true,
                images: true,
                rating: true,
                reviewCount: true,
                sales: true,
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!wishlist) {
      return {
        items: [],
        totalItems: 0,
        totalValue: 0,
        inStockCount: 0,
        outOfStockCount: 0,
      };
    }

    const items = wishlist.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      sku: item.product.sku,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
      stock: item.product.stock,
      status: item.product.status,
      image: item.product.images[0] || "/placeholder.png",
      rating: item.product.rating || 0,
      reviewCount: item.product.reviewCount,
      sales: item.product.sales,
      category: item.product.category,
      addedAt: item.createdAt,
    }));

    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    const inStockCount = items.filter((item) => item.stock > 0 && item.status === "ACTIVE").length;
    const outOfStockCount = items.filter((item) => item.stock === 0 || item.status !== "ACTIVE").length;

    return {
      items,
      totalItems: items.length,
      totalValue,
      inStockCount,
      outOfStockCount,
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return {
      items: [],
      totalItems: 0,
      totalValue: 0,
      inStockCount: 0,
      outOfStockCount: 0,
    };
  }
}

export default async function WishlistPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const data = await getWishlistData(session.user.id);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const calculateDiscount = (price, comparePrice) => {
    if (!comparePrice || comparePrice <= price) return null;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  const getStockStatus = (item) => {
    if (item.status !== "ACTIVE") {
      return { label: "Tidak Tersedia", color: "bg-red-500/10 text-red-700 border-red-500/20" };
    }
    if (item.stock === 0) {
      return { label: "Stok Habis", color: "bg-red-500/10 text-red-700 border-red-500/20" };
    }
    if (item.stock < 10) {
      return { label: `Stok: ${item.stock}`, color: "bg-amber-500/10 text-amber-700 border-amber-500/20" };
    }
    return { label: "Tersedia", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" };
  };

  // If wishlist is empty
  if (data.totalItems === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wishlist Saya</h1>
        <p className="text-sm text-muted-foreground mt-1">Simpan produk favorit untuk dibeli nanti</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 rounded-xl">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{data.totalItems}</p>
                <p className="text-xs text-muted-foreground">Total Produk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 rounded-xl">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(data.totalValue)}</p>
                <p className="text-xs text-muted-foreground">Total Nilai</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{data.inStockCount}</p>
                <p className="text-xs text-muted-foreground">Tersedia</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-muted rounded-xl">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{data.outOfStockCount}</p>
                <p className="text-xs text-muted-foreground">Habis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wishlist Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Daftar Produk</CardTitle>
              <CardDescription className="text-sm mt-1">{data.totalItems} produk di wishlist Anda</CardDescription>
            </div>
            <WishlistActions itemCount={data.totalItems} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {data.items.map((item) => {
              const discount = calculateDiscount(item.price, item.comparePrice);
              const stockStatus = getStockStatus(item);
              const isAvailable = item.stock > 0 && item.status === "ACTIVE";

              return (
                <div key={item.id} className="p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-muted">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      {discount && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-600 text-white text-xs px-2 py-0.5">-{discount}%</Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <a href={`/products/${item.slug}`} className="font-semibold text-sm text-foreground hover:text-primary line-clamp-2 mb-1">
                            {item.name}
                          </a>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {item.rating.toFixed(1)}
                            </span>
                            <span>•</span>
                            <span>{item.reviewCount} ulasan</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {item.sales} terjual
                            </span>
                          </div>
                          <Badge variant="outline" className={`${stockStatus.color} text-xs px-2 py-0.5 w-fit`}>
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-end justify-between gap-4 mt-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold text-foreground">{formatCurrency(item.price)}</p>
                            {item.comparePrice && <p className="text-sm text-muted-foreground line-through">{formatCurrency(item.comparePrice)}</p>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Ditambahkan{" "}
                            {new Date(item.addedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <WishlistActions itemId={item.id} productId={item.productId} productName={item.name} isAvailable={isAvailable} stock={item.stock} showButtons />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Produk Paling Populer</p>
                <p className="font-semibold text-sm text-foreground line-clamp-1">{data.items.sort((a, b) => b.sales - a.sales)[0]?.name || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Star className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Rating Tertinggi</p>
                <p className="font-semibold text-sm text-foreground line-clamp-1">{data.items.sort((a, b) => b.rating - a.rating)[0]?.name || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Harga Tertinggi</p>
                <p className="font-semibold text-sm text-foreground">{formatCurrency(Math.max(...data.items.map((i) => i.price)))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
