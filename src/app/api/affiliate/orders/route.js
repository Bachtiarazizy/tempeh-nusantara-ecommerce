// app/api/affiliate/orders/route.js
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
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate account not found" }, { status: 404 });
    }

    // Build where clause
    const where = {
      affiliateId: affiliate.id,
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Calculate stats
    const stats = await prisma.order.aggregate({
      where: {
        affiliateId: affiliate.id,
        status: {
          notIn: ["CANCELLED", "REFUNDED"],
        },
      },
      _sum: {
        total: true,
        affiliateCommission: true,
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.user?.name || order.shippingName,
          email: order.user?.email || null,
        },
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        total: parseFloat(order.total),
        commission: parseFloat(order.affiliateCommission),
        commissionPaid: order.commissionPaid,
        items: order.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: parseFloat(item.price),
          image: item.product?.images?.[0] || null,
        })),
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalOrders: stats._count.id || 0,
        totalSales: parseFloat(stats._sum.total || 0),
        totalCommission: parseFloat(stats._sum.affiliateCommission || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching affiliate orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders", details: error.message }, { status: 500 });
  }
}
