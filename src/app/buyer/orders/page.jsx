"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Search, Calendar, Truck, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Eye, MapPin, CreditCard, ShoppingBag } from "lucide-react";

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
        color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400",
        dotColor: "bg-amber-500",
      },
      PROCESSING: {
        label: "Diproses",
        icon: Package,
        color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
        dotColor: "bg-blue-500",
      },
      SHIPPED: {
        label: "Dikirim",
        icon: Truck,
        color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400",
        dotColor: "bg-purple-500",
      },
      DELIVERED: {
        label: "Selesai",
        icon: CheckCircle,
        color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
        dotColor: "bg-emerald-500",
      },
      CANCELLED: {
        label: "Dibatalkan",
        icon: XCircle,
        color: "bg-muted text-muted-foreground border-border",
        dotColor: "bg-muted-foreground",
      },
    };
    return configs[status] || configs.PENDING;
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      PENDING: "Belum Dibayar",
      PAID: "Sudah Dibayar",
      FAILED: "Gagal",
    };
    return badges[status] || badges.PENDING;
  };

  const statusFilters = [
    { key: "all", label: "Semua" },
    { key: "pending", label: "Menunggu" },
    { key: "processing", label: "Diproses" },
    { key: "shipped", label: "Dikirim" },
    { key: "delivered", label: "Selesai" },
    { key: "cancelled", label: "Dibatalkan" },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-sm text-muted-foreground">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Pesanan Saya</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola dan pantau status pesanan Anda</p>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Cari nomor pesanan..." value={filters.search} onChange={handleSearch} className="pl-10" />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {statusFilters.map((filter) => {
                const count = statusCounts[filter.key] || 0;
                const isActive = filters.status === filter.key;

                return (
                  <button
                    key={filter.key}
                    onClick={() => handleStatusFilter(filter.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                      ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border"}
                    `}
                  >
                    <span>{filter.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-primary-foreground/20" : "bg-muted"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Memuat pesanan...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-2">Tidak ada pesanan</h3>
            <p className="text-sm text-muted-foreground mb-6">{filters.search ? "Tidak ada pesanan yang cocok dengan pencarian" : "Anda belum memiliki pesanan"}</p>
            <Button>Mulai Belanja</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm text-foreground">#{order.orderNumber}</h3>
                          <Badge variant="outline" className={`${statusConfig.color} text-xs px-2 py-0 h-5`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} mr-1.5`}></span>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span>{getPaymentStatusBadge(order.paymentStatus)}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetail(order.id)} className="whitespace-nowrap h-9">
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </Button>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          {item.productImage ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold text-sm text-foreground">{formatCurrency(item.subtotal)}</p>
                      </div>
                    ))}
                    {order.itemCount > 2 && <p className="text-xs text-muted-foreground text-center pt-2">+{order.itemCount - 2} produk lainnya</p>}
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{order.itemCount} item</span>
                      </div>
                      {order.trackingNumber && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5" />
                            <span className="font-mono">{order.trackingNumber}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-0.5">Total</p>
                      <p className="text-base font-semibold text-foreground">{formatCurrency(order.total)}</p>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan {orders.length} dari {pagination.totalOrders} pesanan
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPreviousPage}>
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Sebelumnya</span>
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

                const isActive = pagination.currentPage === pageNum;

                return (
                  <Button key={pageNum} variant={isActive ? "default" : "outline"} size="sm" onClick={() => handlePageChange(pageNum)} className={`w-9 h-9 p-0 ${isActive ? "" : ""}`}>
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage}>
              <span className="hidden sm:inline mr-1">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-semibold">Detail Pesanan</DialogTitle>
            <DialogDescription className="text-sm">Pesanan #{selectedOrder?.orderNumber}</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-5 pt-2">
              {/* Status Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1.5">Status Pesanan</p>
                  <Badge variant="outline" className={`${getStatusConfig(selectedOrder.status).color} text-xs h-6`}>
                    {getStatusConfig(selectedOrder.status).label}
                  </Badge>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1.5">Status Pembayaran</p>
                  <Badge variant="outline" className="text-xs h-6">
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </Badge>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">Tanggal Pesanan</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedOrder.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">Metode Pembayaran</p>
                    <p className="font-medium text-foreground">{selectedOrder.paymentMethod || "Belum dipilih"}</p>
                  </div>
                </div>

                {selectedOrder.trackingNumber && (
                  <div className="flex items-start gap-3 text-sm">
                    <Truck className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">Nomor Resi</p>
                      <p className="font-medium text-foreground font-mono">{selectedOrder.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm text-foreground">Alamat Pengiriman</h3>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{selectedOrder.shippingAddress}</p>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="font-medium text-sm text-foreground mb-3">Produk Pesanan</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        {item.productImage ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{item.productName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-sm text-foreground">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Pengiriman</span>
                  <span className="text-foreground">{formatCurrency(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium text-sm text-foreground mb-2">Catatan</h3>
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Affiliate Info */}
              {selectedOrder.affiliate && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="font-medium text-sm text-foreground mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Informasi Affiliate
                  </h3>
                  <p className="text-sm text-foreground">
                    Pesanan melalui referral dari <span className="font-semibold">{selectedOrder.affiliate.name}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
