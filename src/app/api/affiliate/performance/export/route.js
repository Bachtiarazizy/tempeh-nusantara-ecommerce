// app/api/affiliate/performance/export/route.js
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
    const format = searchParams.get("format") || "csv"; // csv or json

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate account not found" }, { status: 404 });
    }

    // Get date range
    const now = new Date();
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

    const dateRange = getDateRange(period);

    // Get all orders in period
    const orders = await prisma.order.findMany({
      where: {
        affiliateId: affiliate.id,
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
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
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get clicks
    const clicks = await prisma.affiliateClick.count({
      where: {
        affiliateId: affiliate.id,
        clickedAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
    });

    if (format === "json") {
      return NextResponse.json({
        success: true,
        data: {
          affiliate: {
            name: affiliate.user.name,
            email: affiliate.user.email,
            referralCode: affiliate.referralCode,
          },
          period: {
            type: period,
            start: dateRange.start,
            end: dateRange.end,
          },
          summary: {
            totalClicks: clicks,
            totalOrders: orders.length,
            totalSales: orders.reduce((sum, o) => sum + parseFloat(o.total), 0),
            totalCommission: orders.reduce((sum, o) => sum + parseFloat(o.affiliateCommission || 0), 0),
          },
          orders: orders.map((order) => ({
            orderNumber: order.orderNumber,
            customerName: order.user?.name || order.shippingName,
            status: order.status,
            total: parseFloat(order.total),
            commission: parseFloat(order.affiliateCommission),
            items: order.items.map((item) => ({
              product: item.productName,
              quantity: item.quantity,
              price: parseFloat(item.price),
            })),
            date: order.createdAt,
          })),
        },
      });
    }

    // Generate CSV
    let csv = "LAPORAN PERFORMA AFFILIATE\n\n";
    csv += `Nama,${affiliate.user.name}\n`;
    csv += `Email,${affiliate.user.email}\n`;
    csv += `Kode Referral,${affiliate.referralCode}\n`;
    csv += `Periode,${period}\n`;
    csv += `Tanggal Generate,${new Date().toLocaleString("id-ID")}\n\n`;

    csv += "RINGKASAN\n";
    csv += `Total Klik,${clicks}\n`;
    csv += `Total Pesanan,${orders.length}\n`;
    csv += `Total Penjualan,${orders.reduce((sum, o) => sum + parseFloat(o.total), 0)}\n`;
    csv += `Total Komisi,${orders.reduce((sum, o) => sum + parseFloat(o.affiliateCommission || 0), 0)}\n\n`;

    csv += "DETAIL PESANAN\n";
    csv += "No,Tanggal,Order Number,Customer,Status,Total,Komisi,Produk,Qty\n";

    orders.forEach((order, index) => {
      const products = order.items.map((item) => `${item.productName} (${item.quantity}x)`).join("; ");

      csv += `${index + 1},`;
      csv += `"${new Date(order.createdAt).toLocaleDateString("id-ID")}",`;
      csv += `"${order.orderNumber}",`;
      csv += `"${order.user?.name || order.shippingName}",`;
      csv += `"${order.status}",`;
      csv += `${parseFloat(order.total)},`;
      csv += `${parseFloat(order.affiliateCommission || 0)},`;
      csv += `"${products}",`;
      csv += `${order.items.reduce((sum, item) => sum + item.quantity, 0)}\n`;
    });

    // Return CSV
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="affiliate-report-${affiliate.referralCode}-${period}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting affiliate performance:", error);
    return NextResponse.json({ error: "Failed to export data", details: error.message }, { status: 500 });
  }
}
