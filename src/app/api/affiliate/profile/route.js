import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { auth } from "@/lib/auth";

// GET - Fetch affiliate profile
export async function GET(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data with affiliate info
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        affiliate: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!userData.affiliate) {
      return NextResponse.json({ error: "Not an affiliate" }, { status: 403 });
    }

    // Calculate current month stats
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyOrders = await prisma.order.count({
      where: {
        affiliateId: userData.affiliate.id,
        createdAt: { gte: startOfMonth },
      },
    });

    return NextResponse.json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      },
      affiliate: {
        ...userData.affiliate,
        totalClicks: Number(userData.affiliate.totalClicks),
        totalOrders: Number(userData.affiliate.totalOrders),
        totalSales: Number(userData.affiliate.totalSales),
        totalCommission: Number(userData.affiliate.totalCommission),
        paidCommission: Number(userData.affiliate.paidCommission),
        pendingCommission: Number(userData.affiliate.pendingCommission),
        commissionRate: Number(userData.affiliate.commissionRate),
        monthlyOrdersCount: monthlyOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching affiliate profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update profile
export async function PUT(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone } = body;

    // Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if email already exists (if changing)
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: session.user.id },
        },
      });

      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        phone,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
