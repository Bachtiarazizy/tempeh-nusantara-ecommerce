"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, ShoppingBag, DollarSign, TrendingUp, TrendingDown, Eye, Calendar, Clock, Heart, AlertCircle, RefreshCw, CheckCircle, Link } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CHART_COLORS = ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F5DEB3", "#FFE4C4"];

export default function BuyerDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      totalSpending: 0,
      monthlySpending: 0,
      ordersThisMonth: 0,
    },
    trends: {
      ordersChange: 0,
      spendingChange: 0,
    },
    recentOrders: [],
    orderStatusChart: [],
    spendingChart: [],
    favoriteProducts: [],
    isAffiliate: false,
    affiliateInfo: null,
  });

  const fetchDashboardData = async (showToast = true) => {
    try {
      setLoading(true);
      const response = await fetch("/api/buyer/dashboard");

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
        if (showToast) {
          toast.success("Data berhasil dimuat!", {
            description: "Dashboard telah diperbarui dengan data terbaru",
          });
        }
      } else {
        throw new Error(result.error || "Failed to load data");
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      toast.error("Gagal memuat data", {
        description: err.message || "Terjadi kesalahan saat memuat dashboard",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(false);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Menunggu",
      processing: "Diproses",
      shipped: "Dikirim",
      delivered: "Selesai",
      cancelled: "Dibatalkan",
    };
    return labels[status?.toLowerCase()] || status;
  };

  const copyReferralLink = () => {
    if (dashboardData.affiliateInfo?.referralCode) {
      const link = `${window.location.origin}?ref=${dashboardData.affiliateInfo.referralCode}`;
      navigator.clipboard.writeText(link);
      toast.success("Link referral berhasil disalin!", {
        description: "Bagikan link ini untuk mendapatkan komisi",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const { stats, trends, recentOrders, orderStatusChart, spendingChart, favoriteProducts, isAffiliate, affiliateInfo } = dashboardData;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Dashboard Saya</h1>
            <p className="text-muted-foreground">Pantau pesanan dan riwayat belanja Anda</p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Affiliate Banner */}
        {isAffiliate && (
          <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Link className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Anda adalah Affiliate Partner! 🎉</h3>
                    <p className="text-sm text-muted-foreground">Bagikan link referral Anda untuk mendapatkan komisi</p>
                  </div>
                </div>
                <Button onClick={copyReferralLink} className="bg-primary hover:bg-primary/90">
                  <Link className="w-4 h-4 mr-2" />
                  Salin Link Referral
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          {/* Total Orders */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="outline" className="gap-1">
                  {trends.ordersChange >= 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">+{trends.ordersChange}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-red-600" />
                      <span className="text-red-600">{trends.ordersChange}%</span>
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Pesanan</p>
              <p className="text-xl font-bold text-foreground">{stats.totalOrders}</p>
              <p className="text-xs text-muted-foreground mt-2">{stats.ordersThisMonth} pesanan bulan ini</p>
            </CardContent>
          </Card>

          {/* Pending Orders */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Menunggu Proses</p>
              <p className="text-xl font-bold text-foreground">{stats.pendingOrders}</p>
              <p className="text-xs text-muted-foreground mt-2">Pesanan dalam antrian</p>
            </CardContent>
          </Card>

          {/* Completed Orders */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Pesanan Selesai</p>
              <p className="text-xl font-bold text-foreground">{stats.deliveredOrders}</p>
              <p className="text-xs text-muted-foreground mt-2">Berhasil diterima</p>
            </CardContent>
          </Card>

          {/* Total Spending */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <Badge variant="outline" className="gap-1">
                  {trends.spendingChange >= 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-green-600">+{trends.spendingChange}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-red-600" />
                      <span className="text-red-600">{trends.spendingChange}%</span>
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Belanja</p>
              <p className="text-2xl lg:text-xl font-bold text-primary">{formatCurrency(stats.totalSpending)}</p>
              <p className="text-xs text-muted-foreground mt-2">{formatCurrency(stats.monthlySpending)} bulan ini</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Spending Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Riwayat Belanja 6 Bulan Terakhir
                  </CardTitle>
                  <CardDescription>Grafik pengeluaran bulanan Anda</CardDescription>
                </div>
                <Badge className="bg-primary/10 text-primary border-0">{formatCurrency(stats.monthlySpending)} / bulan ini</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={spendingChart}>
                  <defs>
                    <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B4513" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B4513" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="spending" stroke="#8B4513" strokeWidth={2} fill="url(#colorSpending)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Status Pesanan
              </CardTitle>
              <CardDescription>Distribusi status pesanan Anda</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={orderStatusChart} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {orderStatusChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Favorite Products */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Produk Favorit
              </CardTitle>
              <CardDescription>Produk yang sering Anda pesan</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {favoriteProducts && favoriteProducts.length > 0 ? (
                  favoriteProducts.map((product, index) => (
                    <div key={product.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">#{index + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {product.totalOrdered} item dari {product.orderCount} pesanan
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Belum ada produk favorit</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Pesanan Terbaru
                </CardTitle>
                <CardDescription>5 pesanan terakhir Anda</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Lihat Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">#{order.orderNumber || order.id.toString().padStart(4, "0")}</p>
                          <p className="text-xs text-muted-foreground">{order.itemCount} item</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </p>
                      <p className="font-semibold text-primary">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Belum ada pesanan</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Mulai Belanja
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
