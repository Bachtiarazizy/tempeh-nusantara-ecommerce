// app/api/admin/orders/export/route.js
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
      where.status = status;
    }

    if (startDate) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(endDate),
      };
    }

    // Get all orders matching criteria
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
        affiliate: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Generate CSV content
    let csv = "Order Number,Date,Customer,Email,Phone,Status,Payment Status,Products,Quantity,Subtotal,Shipping,Total,Affiliate,Commission\n";

    orders.forEach((order) => {
      const products = order.items.map((item) => `${item.product.name} (${item.quantity}x)`).join("; ");
      const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

      csv += `"${order.orderNumber}",`;
      csv += `"${new Date(order.createdAt).toLocaleDateString("id-ID")}",`;
      csv += `"${order.user?.name || "N/A"}",`;
      csv += `"${order.user?.email || "N/A"}",`;
      csv += `"${order.user?.phone || "N/A"}",`;
      csv += `"${order.status}",`;
      csv += `"${order.paymentStatus}",`;
      csv += `"${products}",`;
      csv += `${totalQty},`;
      csv += `${order.subtotal},`;
      csv += `${order.shippingCost},`;
      csv += `${order.total},`;
      csv += `"${order.affiliate?.name || "-"}",`;
      csv += `${order.affiliateCommission || 0}\n`;
    });

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting orders:", error);
    return NextResponse.json({ error: "Failed to export orders", details: error.message }, { status: 500 });
  }
}
