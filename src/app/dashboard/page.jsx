"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, TrendingDown, Eye, Calendar, Clock, Award, AlertCircle, RefreshCw } from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CHART_COLORS = ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F5DEB3", "#FFE4C4"];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      totalAffiliates: 0,
      totalRevenue: 0,
      activeProducts: 0,
      pendingOrders: 0,
      monthlyRevenue: 0,
      monthlyOrders: 0,
    },
    trends: {
      productsChange: 0,
      ordersChange: 0,
      affiliatesChange: 0,
      revenueChange: 0,
    },
    recentOrders: [],
    topAffiliates: [],
    salesChart: [],
    orderStatusChart: [],
    revenueChart: [],
    topProducts: [],
  });

  const fetchDashboardData = async (showToast = true) => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/dashboard");

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

  const { stats, trends, recentOrders, topAffiliates, salesChart, orderStatusChart, revenueChart, topProducts } = dashboardData;

  return (
    <>
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Dashboard Admin</h1>
              <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan bisnis Anda</p>
            </div>
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {/* Total Products */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="outline" className="gap-1">
                    {trends.productsChange >= 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">+{trends.productsChange}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 text-red-600" />
                        <span className="text-red-600">{trends.productsChange}%</span>
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Produk</p>
                <p className="text-xl font-bold text-foreground">{stats.totalProducts}</p>
                <p className="text-xs text-muted-foreground mt-2">{stats.activeProducts} produk aktif</p>
              </CardContent>
            </Card>

            {/* Total Orders */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                <p className="text-xs text-muted-foreground mt-2">{stats.pendingOrders} menunggu proses</p>
              </CardContent>
            </Card>

            {/* Total Affiliates */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge variant="outline" className="gap-1">
                    {trends.affiliatesChange >= 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">+{trends.affiliatesChange}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 text-red-600" />
                        <span className="text-red-600">{trends.affiliatesChange}%</span>
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Affiliate</p>
                <p className="text-xl font-bold text-foreground">{stats.totalAffiliates}</p>
                <p className="text-xs text-muted-foreground mt-2">Partner aktif</p>
              </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <Badge variant="outline" className="gap-1">
                    {trends.revenueChange >= 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">+{trends.revenueChange}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3 text-red-600" />
                        <span className="text-red-600">{trends.revenueChange}%</span>
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Pendapatan</p>
                <p className="text-2xl lg:text-xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-2">{formatCurrency(stats.monthlyRevenue)} bulan ini</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Pendapatan 6 Bulan Terakhir
                    </CardTitle>
                    <CardDescription>Grafik perkembangan pendapatan bulanan</CardDescription>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0">{formatCurrency(stats.monthlyRevenue)} / bulan ini</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueChart}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="revenue" stroke="#8B4513" strokeWidth={2} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Sales Chart */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Penjualan Mingguan
                </CardTitle>
                <CardDescription>Total pesanan per minggu</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="week" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="orders" fill="#8B4513" radius={[8, 8, 0, 0]} />
                  </BarChart>
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
                <CardDescription>Distribusi status pesanan saat ini</CardDescription>
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
          </div>

          {/* Recent Orders & Top Affiliates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Pesanan Terbaru
                    </CardTitle>
                    <CardDescription>5 pesanan terakhir yang masuk</CardDescription>
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
                              <p className="text-xs text-muted-foreground">{order.customerName}</p>
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
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Affiliates */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Top Affiliate
                    </CardTitle>
                    <CardDescription>Performa affiliate terbaik bulan ini</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Lihat Semua
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {topAffiliates && topAffiliates.length > 0 ? (
                    topAffiliates.map((affiliate, index) => (
                      <div key={affiliate.id} className="p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" : "bg-gradient-to-br from-amber-500 to-amber-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{affiliate.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-muted-foreground">
                                <ShoppingBag className="w-3 h-3 inline mr-1" />
                                {affiliate.totalOrders} pesanan
                              </p>
                              <p className="text-xs text-muted-foreground">
                                <Users className="w-3 h-3 inline mr-1" />
                                {affiliate.totalCustomers} pelanggan
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-sm">{formatCurrency(affiliate.totalCommission)}</p>
                            <p className="text-xs text-muted-foreground">Komisi</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Belum ada data affiliate</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
