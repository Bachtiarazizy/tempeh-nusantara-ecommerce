// app/api/buyer/orders/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please login" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause
    const whereClause = {
      userId,
    };

    // Filter by status
    if (status !== "all") {
      whereClause.status = status.toUpperCase();
    }

    // Search by order number or product name
    if (search) {
      whereClause.OR = [
        {
          orderNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          orderItems: {
            some: {
              product: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ];
    }

    // Get total count for pagination
    const totalOrders = await prisma.order.count({
      where: whereClause,
    });

    // Calculate pagination
    const totalPages = Math.ceil(totalOrders / limit);
    const skip = (page - 1) * limit;

    // Fetch orders with items and products
    const orders = await prisma.order.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
              },
            },
          },
        },
        affiliate: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Format orders
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: parseFloat(order.subtotal.toString()),
      shippingCost: parseFloat(order.shippingCost.toString()),
      total: parseFloat(order.total.toString()),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.name || "Product Deleted",
        productImage: item.product?.images && item.product.images.length > 0 ? item.product.images[0] : null,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        subtotal: parseFloat(item.subtotal.toString()),
      })),
      itemCount: order.items.length,
      affiliate: order.affiliate
        ? {
            name: order.affiliate.user?.name || "Unknown",
            commission: order.commission ? parseFloat(order.commission.toString()) : 0,
          }
        : null,
    }));

    // Get status counts for filter badges
    const statusCounts = await prisma.order.groupBy({
      where: {
        userId,
      },
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const statusCountMap = {
      all: totalOrders,
    };

    statusCounts.forEach((item) => {
      statusCountMap[item.status.toLowerCase()] = item._count.id;
    });

    return NextResponse.json({
      success: true,
      data: {
        orders: formattedOrders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        statusCounts: statusCountMap,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// app/api/buyer/orders/[id]/route.js
export async function GET_SINGLE(request, { params }) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    const userId = session.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId, // Ensure user can only access their own orders
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                description: true,
              },
            },
          },
        },
        affiliate: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: parseFloat(order.subtotal.toString()),
      shippingCost: parseFloat(order.shippingCost.toString()),
      total: parseFloat(order.total.toString()),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      customer: {
        name: order.user?.name,
        email: order.user?.email,
        phone: order.user?.phone,
      },
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product?.name || "Product Deleted",
        productImage: item.product?.images && item.product.images.length > 0 ? item.product.images[0] : null,
        productDescription: item.product?.description,
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
        subtotal: parseFloat(item.subtotal.toString()),
      })),
      affiliate: order.affiliate
        ? {
            name: order.affiliate.user?.name || "Unknown",
            email: order.affiliate.user?.email,
            commission: order.commission ? parseFloat(order.commission.toString()) : 0,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      data: formattedOrder,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order details",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
