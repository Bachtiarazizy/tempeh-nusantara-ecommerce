"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, ShoppingBag, DollarSign, Clock, CheckCircle, Link, ArrowRight, Calendar, RefreshCw, Heart, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
          toast.success("Data berhasil dimuat!");
        }
      } else {
        throw new Error(result.error || "Failed to load data");
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      toast.error("Gagal memuat data");
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
      pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400",
      processing: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
      shipped: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
      cancelled: "bg-muted text-muted-foreground border-border",
    };
    return colors[status?.toLowerCase()] || "bg-muted text-muted-foreground border-border";
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
      toast.success("Link referral berhasil disalin!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const { stats, trends, recentOrders, orderStatusChart, spendingChart, favoriteProducts, isAffiliate, affiliateInfo } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Ringkasan aktivitas dan pesanan Anda</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Perbarui
        </Button>
      </div>

      {/* Affiliate Banner */}
      {isAffiliate && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Link className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">Program Affiliate Partner</h3>
                  <p className="text-xs text-muted-foreground">Dapatkan komisi dengan membagikan link referral</p>
                </div>
              </div>
              <Button onClick={copyReferralLink} size="sm">
                Salin Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              {trends.ordersChange !== 0 && (
                <div className="flex items-center gap-1 text-xs">
                  {trends.ordersChange >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingDown className="w-3.5 h-3.5 text-muted-foreground" />}
                  <span className={trends.ordersChange >= 0 ? "text-emerald-600 font-medium" : "text-muted-foreground font-medium"}>
                    {trends.ordersChange > 0 ? "+" : ""}
                    {trends.ordersChange}%
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-foreground">{stats.totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Pesanan</p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card>
          <CardContent className="p-5">
            <div className="p-2 bg-muted rounded-lg w-fit mb-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-foreground">{stats.pendingOrders}</p>
              <p className="text-xs text-muted-foreground">Sedang Diproses</p>
            </div>
          </CardContent>
        </Card>

        {/* Completed Orders */}
        <Card>
          <CardContent className="p-5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg w-fit mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-foreground">{stats.deliveredOrders}</p>
              <p className="text-xs text-muted-foreground">Pesanan Selesai</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Spending */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              {trends.spendingChange !== 0 && (
                <div className="flex items-center gap-1 text-xs">
                  {trends.spendingChange >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingDown className="w-3.5 h-3.5 text-muted-foreground" />}
                  <span className={trends.spendingChange >= 0 ? "text-emerald-600 font-medium" : "text-muted-foreground font-medium"}>
                    {trends.spendingChange > 0 ? "+" : ""}
                    {trends.spendingChange}%
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">{formatCurrency(stats.totalSpending)}</p>
              <p className="text-xs text-muted-foreground">Total Belanja</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Tren Belanja</CardTitle>
            <CardDescription className="text-xs">Grafik pengeluaran 6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={spendingChart}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="spending" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorSpending)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Status Pesanan</CardTitle>
            <CardDescription className="text-xs">Distribusi status</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={orderStatusChart} cx="50%" cy="50%" labelLine={false} label={({ percent }) => (percent > 0 ? `${(percent * 100).toFixed(0)}%` : "")} outerRadius={85} dataKey="value">
                  {orderStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Pesanan Terbaru</CardTitle>
                <CardDescription className="text-xs">Aktivitas pesanan terakhir</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Lihat Semua
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm text-foreground">#{order.orderNumber || order.id.toString().padStart(4, "0")}</p>
                            <Badge variant="outline" className={`${getStatusColor(order.status)} text-xs px-2 py-0 h-5`}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </span>
                            <span>{order.itemCount} item</span>
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-foreground shrink-0">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Belum ada pesanan</p>
                  <Button size="sm">Mulai Belanja</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Products */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Produk Favorit</CardTitle>
            <CardDescription className="text-xs">Paling sering dipesan</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {favoriteProducts && favoriteProducts.length > 0 ? (
                favoriteProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center font-semibold text-xs text-muted-foreground shrink-0">{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {product.totalOrdered} item • {product.orderCount}x
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Belum ada favorit</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
