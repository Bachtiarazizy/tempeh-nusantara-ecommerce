// app/buyer/page.jsx (Server Component)
import React from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Package, ShoppingBag, DollarSign, Clock, CheckCircle, Link as LinkIcon, ArrowRight, Calendar, Heart, TrendingUp, TrendingDown, Truck, Star, XCircle, AlertCircle } from "lucide-react";
import { DashboardCharts } from "@/components/buyer/dashboard-charts";
import { RefreshButton } from "@/components/shared/refresh-button";
import { auth } from "@/lib/auth"; // ✅ Import auth helper from your lib

// Fetch dashboard data directly from database
async function getDashboardData(userId) {
  try {
    // Get date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

    // Parallel queries for better performance
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      ordersThisMonth,
      ordersLastMonth,
      totalSpending,
      monthlySpending,
      lastMonthSpending,
      recentOrders,
      ordersByStatus,
      monthlySpendingData,
      favoriteProducts,
      affiliate,
    ] = await Promise.all([
      // Total orders
      prisma.order.count({
        where: { userId },
      }),

      // Pending orders
      prisma.order.count({
        where: { userId, status: "PENDING" },
      }),

      // Processing orders
      prisma.order.count({
        where: { userId, status: { in: ["PROCESSING", "PACKED"] } },
      }),

      // Shipped orders
      prisma.order.count({
        where: { userId, status: "SHIPPED" },
      }),

      // Delivered orders
      prisma.order.count({
        where: { userId, status: { in: ["DELIVERED", "COMPLETED"] } },
      }),

      // Cancelled orders
      prisma.order.count({
        where: { userId, status: { in: ["CANCELLED", "REFUNDED"] } },
      }),

      // Orders this month
      prisma.order.count({
        where: {
          userId,
          createdAt: { gte: startOfMonth },
        },
      }),

      // Orders last month
      prisma.order.count({
        where: {
          userId,
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),

      // Total spending (all time)
      prisma.order.aggregate({
        where: {
          userId,
          paymentStatus: "PAID",
        },
        _sum: { total: true },
      }),

      // Monthly spending
      prisma.order.aggregate({
        where: {
          userId,
          paymentStatus: "PAID",
          createdAt: { gte: startOfMonth },
        },
        _sum: { total: true },
      }),

      // Last month spending
      prisma.order.aggregate({
        where: {
          userId,
          paymentStatus: "PAID",
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { total: true },
      }),

      // Recent orders (last 5)
      prisma.order.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          total: true,
          createdAt: true,
          items: {
            select: {
              id: true,
            },
          },
        },
      }),

      // Orders by status for pie chart
      prisma.order.groupBy({
        by: ["status"],
        where: { userId },
        _count: { id: true },
      }),

      // Monthly spending for line chart (last 6 months)
      prisma.order.groupBy({
        by: ["createdAt"],
        where: {
          userId,
          paymentStatus: "PAID",
          createdAt: { gte: sixMonthsAgo },
        },
        _sum: { total: true },
        orderBy: { createdAt: "asc" },
      }),

      // Favorite products (most ordered)
      prisma.orderItem.groupBy({
        by: ["productId", "productName"],
        where: {
          order: {
            userId,
            paymentStatus: "PAID",
          },
        },
        _count: { id: true },
        _sum: { quantity: true },
        orderBy: {
          _count: { id: "desc" },
        },
        take: 5,
      }),

      // Check if user is affiliate
      prisma.affiliate.findUnique({
        where: { userId },
        select: {
          id: true,
          referralCode: true,
          status: true,
          totalCommission: true,
          pendingCommission: true,
        },
      }),
    ]);

    // Calculate trends
    const ordersChange = ordersLastMonth > 0 ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100) : 0;

    const spendingChange = lastMonthSpending._sum.total > 0 ? Math.round(((Number(monthlySpending._sum.total || 0) - Number(lastMonthSpending._sum.total)) / Number(lastMonthSpending._sum.total)) * 100) : 0;

    // Format spending chart data
    const spendingChart = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      const monthData = monthlySpendingData.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate.getMonth() === date.getMonth() && itemDate.getFullYear() === date.getFullYear();
      });

      const total = monthData.reduce((sum, item) => sum + Number(item._sum.total || 0), 0);

      spendingChart.push({
        month: monthStr,
        spending: total,
      });
    }

    // Format order status chart
    const statusLabels = {
      PENDING: "Menunggu",
      PROCESSING: "Diproses",
      PACKED: "Dikemas",
      SHIPPED: "Dikirim",
      DELIVERED: "Selesai",
      COMPLETED: "Selesai",
      CANCELLED: "Dibatalkan",
      REFUNDED: "Dikembalikan",
    };

    const orderStatusChart = ordersByStatus.map((item) => ({
      name: statusLabels[item.status] || item.status,
      value: item._count.id,
    }));

    return {
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalSpending: Number(totalSpending._sum.total || 0),
        monthlySpending: Number(monthlySpending._sum.total || 0),
        ordersThisMonth,
      },
      trends: {
        ordersChange,
        spendingChange,
      },
      recentOrders: recentOrders.map((order) => ({
        ...order,
        total: Number(order.total),
        itemCount: order.items.length,
      })),
      orderStatusChart,
      spendingChart,
      favoriteProducts: favoriteProducts.map((item) => ({
        id: item.productId,
        name: item.productName,
        orderCount: item._count.id,
        totalOrdered: item._sum.quantity,
      })),
      isAffiliate: !!affiliate && affiliate.status === "ACTIVE",
      affiliateInfo: affiliate
        ? {
            referralCode: affiliate.referralCode,
            totalCommission: Number(affiliate.totalCommission),
            pendingCommission: Number(affiliate.pendingCommission),
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export default async function BuyerDashboardPage() {
  // ✅ Use the auth helper instead of getServerSession
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // ✅ Add safety check for user ID
  if (!session.user.id) {
    console.error("User ID is missing from session:", session);
    redirect("/auth/signin");
  }

  const data = await getDashboardData(session.user.id);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      PROCESSING: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      PACKED: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
      SHIPPED: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
      DELIVERED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      COMPLETED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      REFUNDED: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    };
    return colors[status] || "bg-muted text-muted-foreground border-border";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: Clock,
      PROCESSING: Package,
      PACKED: Package,
      SHIPPED: Truck,
      DELIVERED: CheckCircle,
      COMPLETED: CheckCircle,
      CANCELLED: XCircle,
      REFUNDED: AlertCircle,
    };
    return icons[status] || Clock;
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Menunggu",
      PROCESSING: "Diproses",
      PACKED: "Dikemas",
      SHIPPED: "Dikirim",
      DELIVERED: "Selesai",
      COMPLETED: "Selesai",
      CANCELLED: "Dibatalkan",
      REFUNDED: "Dikembalikan",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Selamat datang kembali, {session.user.name}</p>
        </div>
        <RefreshButton />
      </div>

      {/* Affiliate Banner */}
      {data.isAffiliate && data.affiliateInfo && (
        <Card className="border-blue-500/20 bg-linear-to-br from-blue-500/5 to-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Program Affiliate Partner</h3>
                  <p className="text-sm text-muted-foreground mb-3">Dapatkan komisi dengan membagikan link referral Anda</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Komisi:</span>
                      <span className="font-semibold text-foreground ml-2">{formatCurrency(data.affiliateInfo.totalCommission)}</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div>
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-semibold text-amber-600 ml-2">{formatCurrency(data.affiliateInfo.pendingCommission)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button size="sm" className="shrink-0">
                <LinkIcon className="w-4 h-4 mr-2" />
                Salin Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid - Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-blue-500/10 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              {data.trends.ordersChange !== 0 && (
                <Badge variant="secondary" className="gap-1">
                  {data.trends.ordersChange >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-red-600" />}
                  <span className={data.trends.ordersChange >= 0 ? "text-emerald-600" : "text-red-600"}>
                    {data.trends.ordersChange > 0 ? "+" : ""}
                    {data.trends.ordersChange}%
                  </span>
                </Badge>
              )}
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-1">{data.stats.totalOrders}</p>
              <p className="text-sm text-muted-foreground">Total Pesanan</p>
            </div>
          </CardContent>
        </Card>

        {/* Processing Orders */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="p-2.5 bg-amber-500/10 rounded-xl w-fit mb-4">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-1">{data.stats.processingOrders}</p>
              <p className="text-sm text-muted-foreground">Sedang Diproses</p>
            </div>
          </CardContent>
        </Card>

        {/* Completed Orders */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl w-fit mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-1">{data.stats.deliveredOrders}</p>
              <p className="text-sm text-muted-foreground">Pesanan Selesai</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Spending */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-blue-500/10 rounded-xl">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              {data.trends.spendingChange !== 0 && (
                <Badge variant="secondary" className="gap-1">
                  {data.trends.spendingChange >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-red-600" />}
                  <span className={data.trends.spendingChange >= 0 ? "text-emerald-600" : "text-red-600"}>
                    {data.trends.spendingChange > 0 ? "+" : ""}
                    {data.trends.spendingChange}%
                  </span>
                </Badge>
              )}
            </div>
            <div>
              <p className="text-xl font-bold text-foreground mb-1">{formatCurrency(data.stats.totalSpending)}</p>
              <p className="text-sm text-muted-foreground">Total Belanja</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts spendingChart={data.spendingChart} orderStatusChart={data.orderStatusChart} />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Pesanan Terbaru</CardTitle>
                <CardDescription className="text-sm mt-1">Aktivitas pesanan terakhir</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href="/buyer/orders">
                  Lihat Semua
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {data.recentOrders.length > 0 ? (
                data.recentOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div key={order.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                            <StatusIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm text-foreground">#{order.orderNumber}</p>
                              <Badge variant="outline" className={`${getStatusColor(order.status)} text-xs px-2 py-0 h-5`}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                              <span>{order.itemCount} item</span>
                            </div>
                          </div>
                        </div>
                        <p className="font-bold text-sm text-foreground shrink-0">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Belum ada pesanan</p>
                  <p className="text-xs text-muted-foreground mb-4">Mulai belanja untuk melihat riwayat pesanan</p>
                  <Button size="sm" asChild>
                    <a href="/products">Mulai Belanja</a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Products */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Produk Favorit</CardTitle>
            <CardDescription className="text-sm mt-1">Paling sering dipesan</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {data.favoriteProducts.length > 0 ? (
                data.favoriteProducts.map((product, index) => (
                  <div key={product.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-sm text-white shrink-0">{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-foreground mb-1">{product.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{product.totalOrdered} item</span>
                          <span>•</span>
                          <span>{product.orderCount}x dipesan</span>
                        </div>
                      </div>
                      <Star className="w-4 h-4 text-amber-500 shrink-0" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Belum ada favorit</p>
                  <p className="text-xs text-muted-foreground">Produk yang sering Anda pesan akan muncul di sini</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
