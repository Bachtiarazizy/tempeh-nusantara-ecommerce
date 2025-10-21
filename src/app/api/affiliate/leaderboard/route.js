import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { auth } from "@/lib/auth";

// GET - Get affiliate leaderboard
export async function GET(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "totalCommission"; // totalOrders, totalSales, totalCommission

    // Valid sort fields
    const validSortFields = ["totalOrders", "totalSales", "totalCommission"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "totalCommission";

    // Get top affiliates
    const topAffiliates = await prisma.affiliate.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        [sortField]: "desc",
      },
      take: limit,
    });

    // Get current user's affiliate
    const currentAffiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate ranks
    const leaderboard = topAffiliates.map((affiliate, index) => ({
      rank: index + 1,
      id: affiliate.id,
      name: affiliate.user.name,
      totalOrders: affiliate.totalOrders,
      totalSales: Number(affiliate.totalSales),
      totalCommission: Number(affiliate.totalCommission),
      isCurrentUser: currentAffiliate?.id === affiliate.id,
    }));

    // Find current user's position if not in top
    let currentUserRank = null;
    if (currentAffiliate && !leaderboard.some((a) => a.id === currentAffiliate.id)) {
      const affiliatesAbove = await prisma.affiliate.count({
        where: {
          status: "ACTIVE",
          [sortField]: {
            gt: currentAffiliate[sortField],
          },
        },
      });
      currentUserRank = affiliatesAbove + 1;
    }

    return NextResponse.json({
      leaderboard,
      currentUser: currentAffiliate
        ? {
            rank: currentUserRank || leaderboard.find((a) => a.isCurrentUser)?.rank,
            name: currentAffiliate.user.name,
            totalOrders: currentAffiliate.totalOrders,
            totalSales: Number(currentAffiliate.totalSales),
            totalCommission: Number(currentAffiliate.totalCommission),
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
