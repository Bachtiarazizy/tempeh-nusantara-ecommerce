"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShoppingCart, TrendingUp, DollarSign, Package, Truck, CheckCircle, XCircle, Clock, Search, Filter, X, User, MapPin, FileText, Edit, Eye, Download, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels = {
  PENDING: "Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const CHART_COLORS = ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F5DEB3", "#FFE4C4"];

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Mock chart data - replace with real data from API
  const revenueData = [
    { name: "Jan", revenue: 40000000 },
    { name: "Feb", revenue: 55000000 },
    { name: "Mar", revenue: 48000000 },
    { name: "Apr", revenue: 62000000 },
    { name: "May", revenue: 58000000 },
    { name: "Jun", revenue: 70000000 },
  ];

  const statusDistribution = [
    { name: "Pending", value: stats.pending },
    { name: "Paid", value: stats.paid },
    { name: "Processing", value: stats.processing },
    { name: "Shipped", value: stats.shipped },
    { name: "Delivered", value: stats.delivered },
    { name: "Cancelled", value: stats.cancelled },
  ].filter((item) => item.value > 0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/admin/orders?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
        setPagination(result.pagination);
        setStats(result.stats);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, filterStatus, searchQuery]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      await fetchOrders();
      setSelectedOrder(null);
      toast.success(`Status pesanan berhasil diubah ke ${statusLabels[newStatus]}!`);
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Gagal mengupdate status pesanan");
    }
  };

  const updateTrackingAndNotes = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber || undefined,
          notes: orderNotes || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      toast.success("Informasi pengiriman berhasil diupdate!");
      await fetchOrderDetail(orderId);
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Gagal mengupdate data pesanan");
    }
  };

  const fetchOrderDetail = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch order detail");
      }

      const result = await response.json();

      if (result.success) {
        setSelectedOrder(result.data);
        setTrackingNumber(result.data.trackingNumber || "");
        setOrderNotes(result.data.notes || "");
      }
    } catch (err) {
      console.error("Error fetching order detail:", err);
      toast.error("Gagal memuat detail pesanan");
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-destructive mb-4 font-medium">Error: {error}</p>
            <Button onClick={fetchOrders} className="w-full">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Manajemen Pesanan</h1>
        <p className="text-muted-foreground text-sm md:text-base">Kelola semua pesanan dan update status pengiriman secara real-time</p>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-xl md:text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Paid</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.paid}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Processing</p>
            <p className="text-xl md:text-2xl font-bold text-indigo-600">{stats.processing}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Truck className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Shipped</p>
            <p className="text-xl md:text-2xl font-bold text-purple-600">{stats.shipped}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Delivered</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{stats.delivered}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Cancelled</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-base md:text-lg font-bold text-primary">Rp {(stats.totalRevenue / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tren Revenue 6 Bulan Terakhir
            </CardTitle>
            <CardDescription>Perkembangan pendapatan per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip formatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`} contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }} />
                <Line type="monotone" dataKey="revenue" stroke="#8B4513" strokeWidth={3} dot={{ fill: "#8B4513", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Distribusi Status Pesanan
            </CardTitle>
            <CardDescription>Breakdown pesanan berdasarkan status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search - Responsive */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nomor order atau nama customer..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={filterStatus}
                onValueChange={(value) => {
                  setFilterStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(parseInt(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per halaman</SelectItem>
                  <SelectItem value="25">25 per halaman</SelectItem>
                  <SelectItem value="50">50 per halaman</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  window.open(`/api/admin/orders/export`, "_blank");
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table/Cards - Responsive */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
          <CardDescription>
            Menampilkan {orders.length} dari {pagination.total} pesanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Payment</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Affiliate</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tanggal</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="py-4 px-4">
                      <code className="px-2 py-1 bg-accent rounded text-sm">{order.orderNumber}</code>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.user?.name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{order.user?.phone || "N/A"}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">Rp {order.total.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>{order.paymentStatus}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      {order.affiliate ? (
                        <div>
                          <p className="text-sm">{order.affiliate.user?.name || "N/A"}</p>
                          <p className="text-xs text-green-600">+Rp {order.affiliateCommission?.toLocaleString() || 0}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline" onClick={() => fetchOrderDetail(order.id)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <code className="px-2 py-1 bg-accent rounded text-xs">{order.orderNumber}</code>
                      <p className="mt-2 font-medium">{order.user?.name || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{order.user?.phone || "N/A"}</p>
                    </div>
                    <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-medium">Rp {order.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment:</span>
                      <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"} className="text-xs">
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    {order.affiliate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Affiliate:</span>
                        <span className="text-xs text-green-600">+Rp {order.affiliateCommission?.toLocaleString() || 0}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tanggal:</span>
                      <span className="text-xs">{new Date(order.createdAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" onClick={() => fetchOrderDetail(order.id)} className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                ← Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}>
                Selanjutnya →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Modal - Responsive */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b sticky top-0 bg-card z-10">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-xl md:text-2xl">Detail Pesanan {selectedOrder.orderNumber}</CardTitle>
                  <CardDescription>
                    Dibuat:{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="flex-shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Informasi Customer
                </h3>
                <div className="bg-accent/50 p-4 rounded-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm text-muted-foreground">Nama:</span>
                    <span className="font-medium">{selectedOrder.user?.name || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedOrder.user?.email || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm text-muted-foreground">Telepon:</span>
                    <span className="font-medium">{selectedOrder.user?.phone || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Alamat Pengiriman:
                    </span>
                    <span className="font-medium">{selectedOrder.shippingAddress || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Daftar Produk
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-accent/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-semibold text-primary">Rp {(item.quantity * item.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking & Notes */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Informasi Pengiriman & Catatan
                </h3>
                <div className="bg-accent/50 p-4 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Nomor Resi Pengiriman
                    </label>
                    <Input placeholder="Masukkan nomor resi pengiriman..." value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Catatan Internal
                    </label>
                    <Input placeholder="Tambahkan catatan order..." value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />
                  </div>
                  <Button size="sm" onClick={() => updateTrackingAndNotes(selectedOrder.id)} className="w-full sm:w-auto">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Simpan Info Pengiriman
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Ringkasan Pembayaran
                </h3>
                <div className="bg-accent/50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">Rp {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Ongkos Kirim:</span>
                    <span className="font-medium">Rp {selectedOrder.shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg text-primary">Rp {selectedOrder.total.toLocaleString()}</span>
                  </div>
                  {selectedOrder.affiliate && (
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div>
                        <span className="text-sm text-green-700 dark:text-green-400">Komisi Affiliate</span>
                        <p className="text-xs text-muted-foreground">{selectedOrder.affiliate.user?.name}</p>
                      </div>
                      <span className="font-semibold text-green-600">Rp {selectedOrder.affiliateCommission?.toLocaleString() || 0}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Update Status Pesanan</h3>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant={selectedOrder.status === "PAID" ? "default" : "outline"} onClick={() => updateOrderStatus(selectedOrder.id, "PAID")} disabled={selectedOrder.status === "PAID"}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Set Paid
                  </Button>
                  <Button size="sm" variant={selectedOrder.status === "PROCESSING" ? "default" : "outline"} onClick={() => updateOrderStatus(selectedOrder.id, "PROCESSING")} disabled={selectedOrder.status === "PROCESSING"}>
                    <Package className="w-4 h-4 mr-2" />
                    Set Processing
                  </Button>
                  <Button size="sm" variant={selectedOrder.status === "SHIPPED" ? "default" : "outline"} onClick={() => updateOrderStatus(selectedOrder.id, "SHIPPED")} disabled={selectedOrder.status === "SHIPPED"}>
                    <Truck className="w-4 h-4 mr-2" />
                    Set Shipped
                  </Button>
                  <Button size="sm" variant={selectedOrder.status === "DELIVERED" ? "default" : "outline"} onClick={() => updateOrderStatus(selectedOrder.id, "DELIVERED")} disabled={selectedOrder.status === "DELIVERED"}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Set Delivered
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
                        updateOrderStatus(selectedOrder.id, "CANCELLED");
                      }
                    }}
                    disabled={selectedOrder.status === "CANCELLED"}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Print Label
                  </Button>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Lihat Customer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
