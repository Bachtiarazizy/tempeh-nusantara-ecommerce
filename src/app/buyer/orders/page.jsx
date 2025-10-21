"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Search, Calendar, Truck, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Eye, MapPin, CreditCard, ShoppingBag, Filter, AlertCircle } from "lucide-react";

export default function MyOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
  });
  const [statusCounts, setStatusCounts] = useState({});
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: filters.page.toString(),
        status: filters.status,
        search: filters.search,
        limit: "10",
      });

      const response = await fetch(`/api/buyer/orders?${params}`);
      const result = await response.json();

      if (result.success) {
        setOrders(result.data.orders);
        setPagination(result.data.pagination);
        setStatusCounts(result.data.statusCounts);
      } else {
        toast.error("Gagal memuat pesanan");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Terjadi kesalahan saat memuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handleSearch = (e) => {
    const search = e.target.value;
    setFilters({ ...filters, search, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetail = async (orderId) => {
    try {
      const response = await fetch(`/api/buyer/orders/${orderId}`);
      const result = await response.json();

      if (result.success) {
        setSelectedOrder(result.data);
        setShowDetailModal(true);
      } else {
        toast.error("Gagal memuat detail pesanan");
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
      toast.error("Terjadi kesalahan");
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: "Menunggu",
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        iconColor: "text-yellow-600",
      },
      PROCESSING: {
        label: "Diproses",
        icon: Package,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        iconColor: "text-blue-600",
      },
      SHIPPED: {
        label: "Dikirim",
        icon: Truck,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        iconColor: "text-purple-600",
      },
      DELIVERED: {
        label: "Selesai",
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        iconColor: "text-green-600",
      },
      CANCELLED: {
        label: "Dibatalkan",
        icon: XCircle,
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        iconColor: "text-red-600",
      },
    };
    return configs[status] || configs.PENDING;
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      PENDING: (
        <Badge variant="outline" className="bg-yellow-50">
          Belum Dibayar
        </Badge>
      ),
      PAID: (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Sudah Dibayar
        </Badge>
      ),
      FAILED: (
        <Badge variant="outline" className="bg-red-50 text-red-700">
          Gagal
        </Badge>
      ),
    };
    return badges[status] || badges.PENDING;
  };

  const statusFilters = [
    { key: "all", label: "Semua", count: statusCounts.all || 0 },
    { key: "pending", label: "Menunggu", count: statusCounts.pending || 0 },
    { key: "processing", label: "Diproses", count: statusCounts.processing || 0 },
    { key: "shipped", label: "Dikirim", count: statusCounts.shipped || 0 },
    { key: "delivered", label: "Selesai", count: statusCounts.delivered || 0 },
    { key: "cancelled", label: "Dibatalkan", count: statusCounts.cancelled || 0 },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Pesanan Saya</h1>
          <p className="text-muted-foreground">Kelola dan pantau semua pesanan Anda</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Cari nomor pesanan atau nama produk..." value={filters.search} onChange={handleSearch} className="pl-10" />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                {statusFilters.map((filter) => (
                  <Button key={filter.key} variant={filters.status === filter.key ? "default" : "outline"} size="sm" onClick={() => handleStatusFilter(filter.key)} className="whitespace-nowrap">
                    {filter.label}
                    <Badge variant="secondary" className="ml-2">
                      {filter.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada pesanan</h3>
              <p className="text-muted-foreground mb-4">{filters.search ? "Tidak ada pesanan yang cocok dengan pencarian Anda" : "Anda belum memiliki pesanan"}</p>
              <Button>Mulai Belanja</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusConfig.color}`}>
                          <StatusIcon className={`w-6 h-6 ${statusConfig.iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg">#{order.orderNumber}</h3>
                            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetail(order.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </Button>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.productImage ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-muted-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x {formatCurrency(item.price)}
                            </p>
                          </div>
                          <p className="font-semibold text-primary">{formatCurrency(item.subtotal)}</p>
                        </div>
                      ))}
                      {order.itemCount > 2 && <p className="text-sm text-muted-foreground text-center">+{order.itemCount - 2} produk lainnya</p>}
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="w-4 h-4" />
                          <span>{order.itemCount} item</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            <span>{order.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Menampilkan {orders.length} dari {pagination.totalOrders} pesanan
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPreviousPage}>
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <Button key={pageNum} variant={pagination.currentPage === pageNum ? "default" : "outline"} size="sm" onClick={() => handlePageChange(pageNum)} className="w-10">
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage}>
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Detail Pesanan</DialogTitle>
              <DialogDescription>Informasi lengkap tentang pesanan #{selectedOrder?.orderNumber}</DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Status & Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Status Pesanan</p>
                    <Badge className={getStatusConfig(selectedOrder.status).color}>{getStatusConfig(selectedOrder.status).label}</Badge>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Status Pembayaran</p>
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tanggal:</span>
                    <span className="font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Metode Pembayaran:</span>
                    <span className="font-medium">{selectedOrder.paymentMethod || "Belum dipilih"}</span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Nomor Resi:</span>
                      <span className="font-medium">{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold">Alamat Pengiriman</h3>
                    </div>
                    <p className="text-sm whitespace-pre-line">{selectedOrder.shippingAddress}</p>
                  </div>
                )}

                {/* Items */}
                <div>
                  <h3 className="font-semibold mb-3">Produk yang Dipesan</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.productImage ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-muted-foreground" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Pengiriman</span>
                    <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Catatan</h3>
                    <p className="text-sm whitespace-pre-line">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Affiliate Info */}
                {selectedOrder.affiliate && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      Informasi Affiliate
                    </h3>
                    <p className="text-sm">
                      Pesanan ini dibuat melalui referral dari <span className="font-semibold">{selectedOrder.affiliate.name}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
