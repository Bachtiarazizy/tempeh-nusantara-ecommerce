// app/api/admin/dashboard/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await auth();

    // Check authentication and admin role
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    // Get current date for calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. Total Products Stats
    const [totalProducts, activeProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: {
          status: "ACTIVE", // Menggunakan enum ProductStatus
        },
      }),
    ]);

    const productsLastMonth = await prisma.product.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const productsThisMonth = await prisma.product.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    const productsChange = productsLastMonth > 0 ? Math.round(((productsThisMonth - productsLastMonth) / productsLastMonth) * 100) : 0;

    // 2. Total Orders Stats
    const [totalOrders, pendingOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: "PENDING",
        },
      }),
    ]);

    const ordersLastMonth = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const ordersThisMonth = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    const ordersChange = ordersLastMonth > 0 ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100) : 0;

    // 3. Total Affiliates Stats
    const totalAffiliates = await prisma.affiliate.count({
      where: {
        status: "ACTIVE",
      },
    });

    const affiliatesLastMonth = await prisma.affiliate.count({
      where: {
        status: "ACTIVE",
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const affiliatesThisMonth = await prisma.affiliate.count({
      where: {
        status: "ACTIVE",
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    const affiliatesChange = affiliatesLastMonth > 0 ? Math.round(((affiliatesThisMonth - affiliatesLastMonth) / affiliatesLastMonth) * 100) : 0;

    // 4. Revenue Stats
    const totalRevenueData = await prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
      },
      _sum: {
        total: true,
      },
    });

    const totalRevenue = totalRevenueData._sum.total ? parseFloat(totalRevenueData._sum.total.toString()) : 0;

    const monthlyRevenueData = await prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        total: true,
      },
    });

    const monthlyRevenue = monthlyRevenueData._sum.total ? parseFloat(monthlyRevenueData._sum.total.toString()) : 0;

    const lastMonthRevenueData = await prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: {
        total: true,
      },
    });

    const lastMonthRevenue = lastMonthRevenueData._sum.total ? parseFloat(lastMonthRevenueData._sum.total.toString()) : 0;

    const revenueChange = lastMonthRevenue > 0 ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;

    // 5. Recent Orders (5 latest)
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user?.name || "Guest",
      status: order.status,
      total: parseFloat(order.total.toString()),
      createdAt: order.createdAt,
    }));

    // 6. Top Affiliates (based on total commission this month)
    const topAffiliatesRaw = await prisma.affiliate.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orders: {
          where: {
            createdAt: {
              gte: startOfMonth,
            },
            paymentStatus: "PAID", // Hanya hitung order yang sudah dibayar
          },
          select: {
            id: true,
            userId: true,
            affiliateCommission: true,
          },
        },
      },
    });

    const topAffiliates = topAffiliatesRaw
      .map((affiliate) => {
        const totalOrders = affiliate.orders.length;
        const uniqueCustomers = new Set(affiliate.orders.map((order) => order.userId));
        const totalCustomers = uniqueCustomers.size;
        const totalCommission = affiliate.orders.reduce((sum, order) => {
          const commission = order.affiliateCommission ? parseFloat(order.affiliateCommission.toString()) : 0;
          return sum + commission;
        }, 0);

        return {
          id: affiliate.id,
          name: affiliate.user?.name || "Unknown",
          totalOrders,
          totalCustomers,
          totalCommission,
        };
      })
      .sort((a, b) => b.totalCommission - a.totalCommission)
      .slice(0, 5);

    // 7. Sales Chart (Last 4 weeks)
    const salesChart = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - i * 7);

      const weekOrders = await prisma.order.count({
        where: {
          createdAt: {
            gte: weekStart,
            lt: weekEnd,
          },
        },
      });

      salesChart.push({
        week: `Minggu ${4 - i}`,
        orders: weekOrders,
      });
    }

    // 8. Order Status Distribution
    const orderStatusData = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const statusLabels = {
      PENDING: "Menunggu",
      PROCESSING: "Diproses",
      SHIPPED: "Dikirim",
      DELIVERED: "Selesai",
      CANCELLED: "Dibatalkan",
    };

    const orderStatusChart = orderStatusData.map((item) => ({
      name: statusLabels[item.status] || item.status,
      value: item._count.id,
    }));

    // 9. Revenue Chart (Last 6 months)
    const revenueChart = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthRevenueData = await prisma.order.aggregate({
        where: {
          paymentStatus: "PAID",
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          total: true,
        },
      });

      const revenue = monthRevenueData._sum.total ? parseFloat(monthRevenueData._sum.total.toString()) : 0;

      revenueChart.push({
        month: monthNames[monthStart.getMonth()],
        revenue,
      });
    }

    // 10. Top Products (based on order items)
    const topProductsData = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const topProducts = await Promise.all(
      topProductsData.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: {
            id: item.productId,
          },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        });

        if (!product) {
          return null;
        }

        const price = parseFloat(product.price.toString());
        const totalSold = item._sum.quantity || 0;
        const revenue = price * totalSold;

        return {
          id: product.id,
          name: product.name,
          totalSold,
          totalOrders: item._count.id || 0,
          revenue,
        };
      })
    );

    // Filter out null products
    const filteredTopProducts = topProducts.filter((p) => p !== null);

    // Prepare response
    const dashboardData = {
      stats: {
        totalProducts,
        totalOrders,
        totalAffiliates,
        totalRevenue,
        activeProducts,
        pendingOrders,
        monthlyRevenue,
        monthlyOrders: ordersThisMonth,
      },
      trends: {
        productsChange,
        ordersChange,
        affiliatesChange,
        revenueChange,
      },
      recentOrders: formattedRecentOrders,
      topAffiliates,
      salesChart,
      orderStatusChart,
      revenueChart,
      topProducts: filteredTopProducts,
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
