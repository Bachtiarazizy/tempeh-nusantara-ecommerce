// app/api/admin/affiliates/[id]/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get single affiliate detail
export async function GET(request, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const { id } = await params;

    const affiliate = await prisma.affiliate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
            clicks: true,
            commissions: true,
          },
        },
      },
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: affiliate,
    });
  } catch (error) {
    console.error("Error fetching affiliate detail:", error);
    return NextResponse.json({ error: "Failed to fetch affiliate detail", details: error.message }, { status: 500 });
  }
}

// PATCH - Update affiliate
export async function PATCH(request, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if affiliate exists
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { id },
    });

    if (!existingAffiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData = {};

    // Update status
    if (body.status) {
      const validStatuses = ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateData.status = body.status;

      // Set approvedAt when status changes to ACTIVE
      if (body.status === "ACTIVE" && !existingAffiliate.approvedAt) {
        updateData.approvedAt = new Date();
      }
    }

    // Update commission rate
    if (body.commissionRate !== undefined) {
      updateData.commissionRate = parseFloat(body.commissionRate);
    }

    // Update monthly goal
    if (body.monthlyGoal !== undefined) {
      updateData.monthlyGoal = parseInt(body.monthlyGoal);
    }

    // Update bank info
    if (body.bankName !== undefined) updateData.bankName = body.bankName;
    if (body.accountNumber !== undefined) updateData.accountNumber = body.accountNumber;
    if (body.accountName !== undefined) updateData.accountName = body.accountName;

    // Update affiliate
    const updatedAffiliate = await prisma.affiliate.update({
      where: { id },
      data: updateData,
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
      message: "Affiliate updated successfully",
      data: updatedAffiliate,
    });
  } catch (error) {
    console.error("Error updating affiliate:", error);
    return NextResponse.json({ error: "Failed to update affiliate", details: error.message }, { status: 500 });
  }
}

// DELETE - Delete affiliate (optional)
export async function DELETE(request, { params }) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const { id } = await params;

    // Check if affiliate exists
    const affiliate = await prisma.affiliate.findUnique({
      where: { id },
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate not found" }, { status: 404 });
    }

    // Delete affiliate (will cascade delete related records)
    await prisma.affiliate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Affiliate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting affiliate:", error);
    return NextResponse.json({ error: "Failed to delete affiliate", details: error.message }, { status: 500 });
  }
}
