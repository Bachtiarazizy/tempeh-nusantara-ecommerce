// app/api/affiliate/dashboard/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get affiliate data
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate account not found" }, { status: 404 });
    }

    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get monthly stats
    const monthlyOrders = await prisma.order.count({
      where: {
        affiliateId: affiliate.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: {
          notIn: ["CANCELLED", "REFUNDED"],
        },
      },
    });

    const monthlyStats = await prisma.order.aggregate({
      where: {
        affiliateId: affiliate.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: {
          notIn: ["CANCELLED", "REFUNDED"],
        },
      },
      _sum: {
        total: true,
        affiliateCommission: true,
      },
    });

    // Get recent orders (last 10)
    const recentOrders = await prisma.order.findMany({
      where: {
        affiliateId: affiliate.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Get commission breakdown
    const commissionStats = await prisma.commission.aggregate({
      where: {
        affiliateId: affiliate.id,
      },
      _sum: {
        amount: true,
        paidAmount: true,
      },
    });

    const paidCommission = await prisma.commission.aggregate({
      where: {
        affiliateId: affiliate.id,
        status: "PAID",
      },
      _sum: {
        paidAmount: true,
      },
    });

    const pendingCommission = await prisma.commission.aggregate({
      where: {
        affiliateId: affiliate.id,
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Get leaderboard (top 10 affiliates this month)
    const leaderboard = await prisma.affiliate.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        orders: {
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
            status: {
              notIn: ["CANCELLED", "REFUNDED"],
            },
          },
        },
      },
      orderBy: {
        totalSales: "desc",
      },
      take: 10,
    });

    // Calculate current rank
    const currentRank = leaderboard.findIndex((a) => a.id === affiliate.id) + 1;

    // Calculate conversion rate
    const conversionRate = affiliate.totalClicks > 0 ? ((affiliate.totalOrders / affiliate.totalClicks) * 100).toFixed(2) : 0;

    // Get monthly clicks
    const monthlyClicks = await prisma.affiliateClick.count({
      where: {
        affiliateId: affiliate.id,
        clickedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Format response
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: affiliate.user.id,
          name: affiliate.user.name,
          email: affiliate.user.email,
          phone: affiliate.user.phone,
          referralCode: affiliate.referralCode,
          joinDate: affiliate.joinedAt,
          status: affiliate.status,
        },
        stats: {
          // All time stats
          totalClicks: affiliate.totalClicks || 0,
          totalOrders: affiliate.totalOrders || 0,
          totalSales: parseFloat(affiliate.totalSales || 0),
          totalCommission: parseFloat(affiliate.totalCommission || 0),

          // Monthly stats
          monthlyClicks: monthlyClicks || 0,
          monthlyOrders: monthlyOrders || 0,
          monthlySales: parseFloat(monthlyStats._sum.total || 0),
          monthlyCommission: parseFloat(monthlyStats._sum.affiliateCommission || 0),

          // Other stats
          currentRank: currentRank > 0 ? currentRank : null,
          monthlyGoal: affiliate.monthlyGoal || 0,
          conversionRate: parseFloat(conversionRate),
          commissionRate: parseFloat(affiliate.commissionRate || 5),

          // Commission breakdown
          paidCommission: parseFloat(paidCommission._sum.paidAmount || 0),
          pendingCommission: parseFloat(pendingCommission._sum.amount || 0),
        },
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.user?.name || order.shippingName,
          customerEmail: order.user?.email || null,
          total: parseFloat(order.total),
          commission: parseFloat(order.affiliateCommission),
          status: order.status,
          paymentStatus: order.paymentStatus,
          date: order.createdAt,
          paidAt: order.paidAt,
        })),
        leaderboard: leaderboard.map((aff, index) => {
          const monthlyOrders = aff.orders.length;
          const monthlyCommission = aff.orders.reduce((sum, order) => sum + parseFloat(order.affiliateCommission || 0), 0);

          return {
            rank: index + 1,
            name: aff.user?.name || "Unknown",
            orders: monthlyOrders,
            commission: monthlyCommission,
            isCurrentUser: aff.id === affiliate.id,
          };
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching affiliate dashboard:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data", details: error.message }, { status: 500 });
  }
}
