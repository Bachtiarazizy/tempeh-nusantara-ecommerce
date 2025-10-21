import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { auth } from "@/lib/auth";

// GET - Get affiliate statistics
export async function GET(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // month, week, year, all

    // Get affiliate
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Not an affiliate" }, { status: 403 });
    }

    // Calculate date range
    let startDate;
    const now = new Date();

    switch (period) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "all":
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get stats for the period
    const orders = await prisma.order.findMany({
      where: {
        affiliateId: affiliate.id,
        createdAt: { gte: startDate },
      },
      include: {
        commission: true,
      },
    });

    const clicks = await prisma.affiliateClick.count({
      where: {
        affiliateId: affiliate.id,
        clickedAt: { gte: startDate },
      },
    });

    // Calculate stats
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalCommission = orders.reduce((sum, order) => sum + Number(order.affiliateCommission), 0);
    const paidCommission = orders.filter((order) => order.commissionPaid).reduce((sum, order) => sum + Number(order.affiliateCommission), 0);
    const pendingCommission = totalCommission - paidCommission;

    // Calculate conversion rate
    const conversionRate = clicks > 0 ? (totalOrders / clicks) * 100 : 0;

    // Get daily breakdown
    const dailyStats = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      if (!dailyStats[date]) {
        dailyStats[date] = {
          orders: 0,
          sales: 0,
          commission: 0,
        };
      }
      dailyStats[date].orders += 1;
      dailyStats[date].sales += Number(order.total);
      dailyStats[date].commission += Number(order.affiliateCommission);
    });

    return NextResponse.json({
      period,
      startDate,
      summary: {
        clicks,
        totalOrders,
        totalSales,
        totalCommission,
        paidCommission,
        pendingCommission,
        conversionRate: conversionRate.toFixed(2),
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      },
      dailyStats: Object.entries(dailyStats)
        .map(([date, stats]) => ({
          date,
          ...stats,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
