// app/api/admin/orders/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all orders with filters and pagination
export async function GET(request) {
  try {
    const session = await auth();

    // Check authentication and admin role
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search");

    // Build where clause
    const where = {};

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }],
          },
        },
      ];
    }

    // Get orders with relations
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: true,
                },
              },
            },
          },
          affiliate: {
            select: {
              id: true,
              userId: true,
              referralCode: true,
              commissionRate: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    // Calculate statistics
    const stats = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const totalRevenue = await prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    });

    const statsMap = stats.reduce((acc, stat) => {
      acc[stat.status.toLowerCase()] = stat._count.id;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total,
        pending: statsMap.pending || 0,
        paid: statsMap.paid || 0,
        processing: statsMap.processing || 0,
        shipped: statsMap.shipped || 0,
        delivered: statsMap.delivered || 0,
        cancelled: statsMap.cancelled || 0,
        totalRevenue: totalRevenue._sum.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders", details: error.message }, { status: 500 });
  }
}
