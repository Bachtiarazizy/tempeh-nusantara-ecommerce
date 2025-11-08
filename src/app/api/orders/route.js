// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Generate unique order number
function generateOrderNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

// Generate external ID for Xendit
function generateExternalId() {
  return `xendit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please login first" }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      shippingAddressId,
      shippingMethodId,
      paymentMethod,
      customerNotes,
      subtotal,
      shippingCost,
      tax,
      adminFee,
      total,
      affiliateCode, // Optional
    } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 });
    }

    if (!shippingAddressId || !shippingMethodId || !paymentMethod) {
      return NextResponse.json({ error: "Shipping address, shipping method, and payment method are required" }, { status: 400 });
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: shippingAddressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return NextResponse.json({ error: "Invalid shipping address" }, { status: 400 });
    }

    // Verify shipping method exists
    const shippingMethod = await prisma.shippingMethod.findUnique({
      where: { id: shippingMethodId },
    });

    if (!shippingMethod || !shippingMethod.isActive) {
      return NextResponse.json({ error: "Invalid shipping method" }, { status: 400 });
    }

    // Check stock availability
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, status: true, name: true },
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productName}` }, { status: 400 });
      }

      if (product.status !== "ACTIVE") {
        return NextResponse.json({ error: `Product is not available: ${product.name}` }, { status: 400 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for: ${product.name}` }, { status: 400 });
      }
    }

    // Find affiliate if code provided
    let affiliateId = null;
    if (affiliateCode) {
      const affiliate = await prisma.affiliate.findUnique({
        where: { referralCode: affiliateCode },
      });
      if (affiliate && affiliate.status === "ACTIVE") {
        affiliateId = affiliate.id;
      }
    }

    // Generate order number and external ID
    const orderNumber = generateOrderNumber();
    const externalId = generateExternalId();

    // Prepare shipping address JSON
    const shippingAddressJson = JSON.stringify({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });

    // Calculate payment expiry (24 hours from now)
    const paymentExpiredAt = new Date();
    paymentExpiredAt.setHours(paymentExpiredAt.getHours() + 24);

    // Get IP and User Agent
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          externalId,
          userId: session.user.id,
          affiliateId,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: paymentMethod,
          paymentExpiredAt,
          subtotal: parseFloat(subtotal.toString()),
          discount: 0,
          shippingCost: parseFloat(shippingCost.toString()),
          tax: parseFloat(tax.toString()),
          adminFee: parseFloat(adminFee.toString()),
          total: parseFloat(total.toString()),
          shippingMethodId,
          shippingAddress: shippingAddressJson,
          customerNotes: customerNotes || null,
          ipAddress,
          userAgent,
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          productImage: item.productImage,
          price: parseFloat(item.price.toString()),
          quantity: item.quantity,
          variant: item.variant,
          weight: item.weight,
          discount: 0,
          subtotal: parseFloat(item.price.toString()) * item.quantity,
        })),
      });

      // Update product stock and sales
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            sales: { increment: item.quantity },
          },
        });
      }

      // Update affiliate stats if applicable
      if (affiliateId) {
        await tx.affiliate.update({
          where: { id: affiliateId },
          data: {
            totalOrders: { increment: 1 },
            totalSales: { increment: parseFloat(total.toString()) },
          },
        });
      }

      // Create order status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: "PENDING",
          notes: "Order created",
          createdBy: session.user.id,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: session.user.id,
          type: "ORDER_CREATED",
          title: "Pesanan Berhasil Dibuat",
          message: `Pesanan #${orderNumber} berhasil dibuat. Segera lakukan pembayaran.`,
          data: {
            orderId: newOrder.id,
            orderNumber: newOrder.orderNumber,
          },
          actionUrl: `/orders/${newOrder.orderNumber}`,
        },
      });

      return newOrder;
    });

    // If not COD, create Xendit invoice
    let xenditInvoiceUrl = null;
    if (paymentMethod !== "COD") {
      try {
        // In production, integrate with Xendit API here
        // For now, we'll simulate the invoice URL
        xenditInvoiceUrl = `https://checkout.xendit.co/web/${externalId}`;

        // Update order with Xendit info
        await prisma.order.update({
          where: { id: order.id },
          data: {
            xenditInvoiceId: externalId,
            xenditInvoiceUrl: xenditInvoiceUrl,
          },
        });

        /* Production Xendit integration example:
        const xendit = new Xendit({
          secretKey: process.env.XENDIT_SECRET_KEY!
        });
        
        const invoice = await xendit.Invoice.createInvoice({
          externalId: externalId,
          amount: total,
          payerEmail: session.user.email,
          description: `Order ${orderNumber}`,
          invoiceDuration: 86400, // 24 hours
          successRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderNumber}/success`,
          failureRedirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderNumber}/failed`,
        });
        
        xenditInvoiceUrl = invoice.invoice_url;
        */
      } catch (error) {
        console.error("Error creating Xendit invoice:", error);
        // Continue anyway, user can pay later
      }
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          total: order.total,
          xenditInvoiceUrl,
          paymentExpiredAt: order.paymentExpiredAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - List user orders
export async function GET(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
          shippingMethod: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
