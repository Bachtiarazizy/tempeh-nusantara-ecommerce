// app/api/buyer/dashboard/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please login" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get current date for calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. Total Orders Stats
    const [totalOrders, pendingOrders, deliveredOrders] = await Promise.all([
      prisma.order.count({
        where: { userId },
      }),
      prisma.order.count({
        where: {
          userId,
          status: "PENDING",
        },
      }),
      prisma.order.count({
        where: {
          userId,
          status: "DELIVERED",
        },
      }),
    ]);

    // Orders this month
    const ordersThisMonth = await prisma.order.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    const ordersLastMonth = await prisma.order.count({
      where: {
        userId,
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const ordersChange = ordersLastMonth > 0 ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100) : 0;

    // 2. Total Spending
    const totalSpendingData = await prisma.order.aggregate({
      where: {
        userId,
        paymentStatus: "PAID",
      },
      _sum: {
        total: true,
      },
    });

    const totalSpending = totalSpendingData._sum.total ? parseFloat(totalSpendingData._sum.total.toString()) : 0;

    const monthlySpendingData = await prisma.order.aggregate({
      where: {
        userId,
        paymentStatus: "PAID",
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        total: true,
      },
    });

    const monthlySpending = monthlySpendingData._sum.total ? parseFloat(monthlySpendingData._sum.total.toString()) : 0;

    const lastMonthSpendingData = await prisma.order.aggregate({
      where: {
        userId,
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

    const lastMonthSpending = lastMonthSpendingData._sum.total ? parseFloat(lastMonthSpendingData._sum.total.toString()) : 0;

    const spendingChange = lastMonthSpending > 0 ? Math.round(((monthlySpending - lastMonthSpending) / lastMonthSpending) * 100) : 0;

    // 3. Recent Orders (5 latest)
    // FIXED: Changed orderItems to items
    const recentOrders = await prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });

    // FIXED: Changed order.orderItems to order.items
    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: parseFloat(order.total.toString()),
      createdAt: order.createdAt,
      itemCount: order.items.length,
      items: order.items.map((item) => ({
        productName: item.product?.name || "Unknown",
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
      })),
    }));

    // 4. Order Status Distribution
    const orderStatusData = await prisma.order.groupBy({
      where: { userId },
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

    // 5. Monthly Spending Chart (Last 6 months)
    const spendingChart = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthSpendingData = await prisma.order.aggregate({
        where: {
          userId,
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

      const spending = monthSpendingData._sum.total ? parseFloat(monthSpendingData._sum.total.toString()) : 0;

      spendingChart.push({
        month: monthNames[monthStart.getMonth()],
        spending,
      });
    }

    // 6. Favorite Products (most ordered)
    // First, get order IDs for this user
    const userOrders = await prisma.order.findMany({
      where: { userId },
      select: { id: true },
    });

    const orderIds = userOrders.map((order) => order.id);

    const favoriteProductsData = await prisma.orderItem.groupBy({
      where: {
        orderId: {
          in: orderIds,
        },
      },
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const favoriteProducts = await Promise.all(
      favoriteProductsData.map(async (item) => {
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

        return {
          id: product.id,
          name: product.name,
          totalOrdered: item._sum.quantity || 0,
          orderCount: item._count.productId || 0,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
        };
      })
    );

    const filteredFavoriteProducts = favoriteProducts.filter((p) => p !== null);

    // 7. Check if user is affiliate
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId },
      select: {
        id: true,
        status: true,
        referralCode: true,
      },
    });

    const isAffiliate = affiliate && affiliate.status === "ACTIVE";

    // Prepare response
    const dashboardData = {
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalSpending,
        monthlySpending,
        ordersThisMonth,
      },
      trends: {
        ordersChange,
        spendingChange,
      },
      recentOrders: formattedRecentOrders,
      orderStatusChart,
      spendingChart,
      favoriteProducts: filteredFavoriteProducts,
      isAffiliate,
      affiliateInfo: isAffiliate
        ? {
            referralCode: affiliate.referralCode,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching buyer dashboard data:", error);
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
