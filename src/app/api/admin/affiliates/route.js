// app/api/admin/affiliates/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all affiliates with filters and pagination
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
    const search = searchParams.get("search");

    // Build where clause
    const where = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { referralCode: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }],
          },
        },
      ];
    }

    // Get affiliates with relations
    const [affiliates, total] = await Promise.all([
      prisma.affiliate.findMany({
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
          _count: {
            select: {
              orders: true,
              clicks: true,
            },
          },
        },
        orderBy: { totalSales: "desc" },
        skip,
        take: limit,
      }),
      prisma.affiliate.count({ where }),
    ]);

    // Calculate statistics
    const stats = await prisma.affiliate.aggregate({
      _count: { id: true },
      _sum: {
        totalOrders: true,
        totalSales: true,
        totalCommission: true,
        pendingCommission: true,
      },
    });

    const statusCounts = await prisma.affiliate.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const statusMap = statusCounts.reduce((acc, stat) => {
      acc[stat.status.toLowerCase()] = stat._count.id;
      return acc;
    }, {});

    // Get top performers (ranked by totalSales)
    const topPerformers = await prisma.affiliate.findMany({
      where: { status: "ACTIVE" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { totalSales: "desc" },
      take: 10,
    });

    // Add rank to affiliates
    const affiliatesWithRank = affiliates.map((aff) => {
      const rank = topPerformers.findIndex((t) => t.id === aff.id) + 1;
      return {
        ...aff,
        rank: rank > 0 && rank <= 10 ? rank : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: affiliatesWithRank,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total,
        active: statusMap.active || 0,
        inactive: statusMap.inactive || 0,
        pending: statusMap.pending || 0,
        totalOrders: stats._sum.totalOrders || 0,
        totalSales: stats._sum.totalSales || 0,
        totalCommission: stats._sum.totalCommission || 0,
        pendingPayout: stats._sum.pendingCommission || 0,
      },
      leaderboard: topPerformers.map((aff, index) => ({
        ...aff,
        rank: index + 1,
      })),
    });
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return NextResponse.json({ error: "Failed to fetch affiliates", details: error.message }, { status: 500 });
  }
}

// POST - Create new affiliate (if needed)
export async function POST(request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, referralCode, commissionRate, monthlyGoal } = body;

    // Validate required fields
    if (!userId || !referralCode) {
      return NextResponse.json({ error: "userId and referralCode are required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if referral code is unique
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { referralCode },
    });

    if (existingAffiliate) {
      return NextResponse.json({ error: "Referral code already exists" }, { status: 400 });
    }

    // Create affiliate
    const affiliate = await prisma.affiliate.create({
      data: {
        userId,
        referralCode,
        commissionRate: commissionRate || 10,
        monthlyGoal: monthlyGoal || 10,
        status: "PENDING",
      },
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

    return NextResponse.json({
      success: true,
      message: "Affiliate created successfully",
      data: affiliate,
    });
  } catch (error) {
    console.error("Error creating affiliate:", error);
    return NextResponse.json({ error: "Failed to create affiliate", details: error.message }, { status: 500 });
  }
}
