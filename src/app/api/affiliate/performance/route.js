// app/api/affiliate/performance/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "thisMonth";

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate account not found" }, { status: 404 });
    }

    const now = new Date();

    // Calculate date ranges
    const getDateRange = (type) => {
      const ranges = {
        thisMonth: {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
        },
        lastMonth: {
          start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
        },
        last3Months: {
          start: new Date(now.getFullYear(), now.getMonth() - 3, 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
        },
        last6Months: {
          start: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
        },
      };
      return ranges[type] || ranges.thisMonth;
    };

    const currentRange = getDateRange(period);
    const previousRange = getDateRange(period === "thisMonth" ? "lastMonth" : "last3Months");

    // Get current period stats
    const [currentClicks, currentOrders] = await Promise.all([
      prisma.affiliateClick.count({
        where: {
          affiliateId: affiliate.id,
          clickedAt: {
            gte: currentRange.start,
            lte: currentRange.end,
          },
        },
      }),
      prisma.order.findMany({
        where: {
          affiliateId: affiliate.id,
          createdAt: {
            gte: currentRange.start,
            lte: currentRange.end,
          },
          status: {
            notIn: ["CANCELLED", "REFUNDED"],
          },
        },
        select: {
          total: true,
          affiliateCommission: true,
        },
      }),
    ]);

    // Get previous period stats
    const [previousClicks, previousOrders] = await Promise.all([
      prisma.affiliateClick.count({
        where: {
          affiliateId: affiliate.id,
          clickedAt: {
            gte: previousRange.start,
            lte: previousRange.end,
          },
        },
      }),
      prisma.order.findMany({
        where: {
          affiliateId: affiliate.id,
          createdAt: {
            gte: previousRange.start,
            lte: previousRange.end,
          },
          status: {
            notIn: ["CANCELLED", "REFUNDED"],
          },
        },
        select: {
          total: true,
          affiliateCommission: true,
        },
      }),
    ]);

    // Calculate current period totals
    const currentStats = {
      clicks: currentClicks,
      orders: currentOrders.length,
      sales: currentOrders.reduce((sum, o) => sum + parseFloat(o.total), 0),
      commission: currentOrders.reduce((sum, o) => sum + parseFloat(o.affiliateCommission || 0), 0),
      conversionRate: currentClicks > 0 ? ((currentOrders.length / currentClicks) * 100).toFixed(2) : "0.00",
    };

    // Calculate previous period totals
    const previousStats = {
      clicks: previousClicks,
      orders: previousOrders.length,
      sales: previousOrders.reduce((sum, o) => sum + parseFloat(o.total), 0),
      commission: previousOrders.reduce((sum, o) => sum + parseFloat(o.affiliateCommission || 0), 0),
      conversionRate: previousClicks > 0 ? ((previousOrders.length / previousClicks) * 100).toFixed(2) : "0.00",
    };

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    const growth = {
      clicks: parseFloat(calculateGrowth(currentStats.clicks, previousStats.clicks)),
      orders: parseFloat(calculateGrowth(currentStats.orders, previousStats.orders)),
      sales: parseFloat(calculateGrowth(currentStats.sales, previousStats.sales)),
      commission: parseFloat(calculateGrowth(currentStats.commission, previousStats.commission)),
      conversionRate: parseFloat(calculateGrowth(parseFloat(currentStats.conversionRate), parseFloat(previousStats.conversionRate))),
    };

    // Get monthly data for trend (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const [monthClicks, monthOrders] = await Promise.all([
        prisma.affiliateClick.count({
          where: {
            affiliateId: affiliate.id,
            clickedAt: { gte: monthStart, lte: monthEnd },
          },
        }),
        prisma.order.findMany({
          where: {
            affiliateId: affiliate.id,
            createdAt: { gte: monthStart, lte: monthEnd },
            status: { notIn: ["CANCELLED", "REFUNDED"] },
          },
          select: {
            total: true,
            affiliateCommission: true,
          },
        }),
      ]);

      const monthCommission = monthOrders.reduce((sum, o) => sum + parseFloat(o.affiliateCommission || 0), 0);
      const monthSales = monthOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);

      monthlyData.push({
        month: monthStart.toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        }),
        clicks: monthClicks,
        orders: monthOrders.length,
        commission: Math.round(monthCommission),
        sales: Math.round(monthSales),
      });
    }

    // ============================================================
    // GET TOP PRODUCTS - NO groupBy, PURE MANUAL GROUPING
    // ============================================================
    console.log("Fetching order items for top products...");

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          affiliateId: affiliate.id,
          createdAt: {
            gte: currentRange.start,
            lte: currentRange.end,
          },
          status: {
            notIn: ["CANCELLED", "REFUNDED"],
          },
        },
      },
      select: {
        productId: true,
        productName: true,
        quantity: true,
        subtotal: true,
        orderId: true,
      },
    });

    // Manual grouping using JavaScript Map
    const productMap = new Map();

    for (const item of orderItems) {
      const key = item.productId;

      if (!productMap.has(key)) {
        productMap.set(key, {
          productId: item.productId,
          productName: item.productName,
          totalQuantity: 0,
          totalSales: 0,
          orderIds: new Set(),
        });
      }

      const product = productMap.get(key);
      product.totalQuantity += item.quantity;
      product.totalSales += parseFloat(item.subtotal || 0);
      product.orderIds.add(item.orderId);
    }

    // Convert to array and calculate commission
    const commissionRate = parseFloat(affiliate.commissionRate || 5) / 100;
    const topProductsWithCommission = Array.from(productMap.values())
      .map((product) => ({
        name: product.productName,
        orders: product.orderIds.size,
        sales: Math.round(product.totalSales),
        commission: Math.round(product.totalSales * commissionRate),
        quantity: product.totalQuantity,
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 10);

    // ============================================================
    // GET TRAFFIC SOURCES
    // ============================================================
    const clicksWithReferer = await prisma.affiliateClick.findMany({
      where: {
        affiliateId: affiliate.id,
        clickedAt: {
          gte: currentRange.start,
          lte: currentRange.end,
        },
      },
      select: {
        referer: true,
        id: true,
      },
    });

    // Get total orders in period for accurate calculation
    const totalOrdersInPeriod = await prisma.order.count({
      where: {
        affiliateId: affiliate.id,
        createdAt: {
          gte: currentRange.start,
          lte: currentRange.end,
        },
        status: {
          notIn: ["CANCELLED", "REFUNDED"],
        },
      },
    });

    // Categorize traffic sources
    const trafficMap = {};
    const totalClicks = clicksWithReferer.length;

    clicksWithReferer.forEach((click) => {
      let source = "Direct Link";
      if (click.referer) {
        const referer = click.referer.toLowerCase();
        if (referer.includes("wa.me") || referer.includes("whatsapp") || referer.includes("api.whatsapp")) {
          source = "WhatsApp";
        } else if (referer.includes("instagram") || referer.includes("ig.me")) {
          source = "Instagram";
        } else if (referer.includes("facebook") || referer.includes("fb.me")) {
          source = "Facebook";
        } else if (referer.includes("twitter") || referer.includes("x.com") || referer.includes("t.co")) {
          source = "Twitter/X";
        } else if (referer.includes("tiktok")) {
          source = "TikTok";
        } else if (referer.includes("linkedin")) {
          source = "LinkedIn";
        } else if (referer.includes("youtube")) {
          source = "YouTube";
        } else {
          source = "Other";
        }
      }

      if (!trafficMap[source]) {
        trafficMap[source] = { clicks: 0 };
      }
      trafficMap[source].clicks++;
    });

    // Estimate orders per source based on click proportion
    const trafficSources = Object.entries(trafficMap)
      .map(([source, data]) => {
        const estimatedOrders = totalClicks > 0 ? Math.round((data.clicks / totalClicks) * totalOrdersInPeriod) : 0;
        const percentage = totalClicks > 0 ? parseFloat(((data.clicks / totalClicks) * 100).toFixed(1)) : 0;

        return {
          source,
          clicks: data.clicks,
          orders: estimatedOrders,
          percentage,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          current: currentStats,
          previous: previousStats,
          growth,
        },
        monthlyData,
        topProducts: topProductsWithCommission,
        trafficSources,
        period,
      },
    });
  } catch (error) {
    console.error("Error fetching affiliate performance:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to fetch performance data",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
