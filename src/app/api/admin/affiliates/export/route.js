// app/api/admin/affiliates/export/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build where clause
    const where = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (startDate) {
      where.joinedAt = {
        ...where.joinedAt,
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.joinedAt = {
        ...where.joinedAt,
        lte: new Date(endDate),
      };
    }

    // Get all affiliates matching criteria
    const affiliates = await prisma.affiliate.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { totalSales: "desc" },
    });

    // Generate CSV content
    let csv = "Name,Email,Phone,Referral Code,Status,Total Clicks,Total Orders,Total Sales,Total Commission,Paid Commission,Pending Commission,Monthly Goal,Commission Rate,Joined Date\n";

    affiliates.forEach((aff) => {
      csv += `"${aff.user?.name || "N/A"}",`;
      csv += `"${aff.user?.email || "N/A"}",`;
      csv += `"${aff.user?.phone || "N/A"}",`;
      csv += `"${aff.referralCode}",`;
      csv += `"${aff.status}",`;
      csv += `${aff.totalClicks || 0},`;
      csv += `${aff.totalOrders || 0},`;
      csv += `${aff.totalSales || 0},`;
      csv += `${aff.totalCommission || 0},`;
      csv += `${aff.paidCommission || 0},`;
      csv += `${aff.pendingCommission || 0},`;
      csv += `${aff.monthlyGoal || 0},`;
      csv += `${aff.commissionRate || 0},`;
      csv += `"${new Date(aff.joinedAt || aff.createdAt).toLocaleDateString("id-ID")}"\n`;
    });

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="affiliates-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting affiliates:", error);
    return NextResponse.json({ error: "Failed to export affiliates", details: error.message }, { status: 500 });
  }
}
