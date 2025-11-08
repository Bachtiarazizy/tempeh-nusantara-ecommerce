// app/api/checkout/create-payment/route.js
// import { NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import Xendit from "xendit-node";

// const xendit = new Xendit({
//   secretKey: process.env.XENDIT_SECRET_KEY,
// });

// const { Invoice } = xendit;
// const invoiceClient = new Invoice({});

// export async function POST(request) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { cartId, shippingInfo, shippingMethodId, paymentMethod, saveAddress } = await request.json();

//     // Get cart with items
//     const cart = await prisma.cart.findUnique({
//       where: { id: cartId, userId: session.user.id },
//       include: {
//         items: {
//           include: {
//             product: true,
//           },
//         },
//       },
//     });

//     if (!cart || cart.items.length === 0) {
//       return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
//     }

//     // Check stock availability
//     for (const item of cart.items) {
//       if (item.product.status !== "ACTIVE" || item.product.stock < item.quantity) {
//         return NextResponse.json(
//           {
//             error: `Product ${item.product.name} is not available or insufficient stock`,
//           },
//           { status: 400 }
//         );
//       }
//     }

//     // Get shipping method
//     const shippingMethod = await prisma.shippingMethod.findUnique({
//       where: { id: shippingMethodId },
//     });

//     if (!shippingMethod) {
//       return NextResponse.json({ error: "Invalid shipping method" }, { status: 400 });
//     }

//     // Calculate totals
//     const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

//     // Check minimum order for shipping
//     if (shippingMethod.minOrderAmount && subtotal < Number(shippingMethod.minOrderAmount)) {
//       return NextResponse.json(
//         {
//           error: `Minimum order amount for this shipping method is ${shippingMethod.minOrderAmount}`,
//         },
//         { status: 400 }
//       );
//     }

//     const shippingCost = Number(shippingMethod.price);
//     const tax = subtotal * 0.11; // 11% PPN
//     const total = subtotal + shippingCost + tax;

//     // Save address if requested
//     let addressId = null;
//     if (saveAddress) {
//       const newAddress = await prisma.address.create({
//         data: {
//           userId: session.user.id,
//           fullName: shippingInfo.fullName,
//           phone: shippingInfo.phone,
//           address: shippingInfo.address,
//           city: shippingInfo.city,
//           state: shippingInfo.state,
//           postalCode: shippingInfo.postalCode,
//           country: shippingInfo.country,
//           isDefault: false,
//         },
//       });
//       addressId = newAddress.id;
//     }

//     // Generate unique external ID
//     const externalId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

//     // Create order in database
//     const order = await prisma.order.create({
//       data: {
//         orderNumber: externalId,
//         userId: session.user.id,
//         status: "PENDING",
//         paymentStatus: "PENDING",
//         paymentMethod: paymentMethod,
//         subtotal,
//         shippingCost,
//         tax,
//         total,
//         shippingMethodId,
//         shippingAddress: JSON.stringify(shippingInfo),
//         externalId: externalId,
//         items: {
//           create: cart.items.map((item) => ({
//             productId: item.productId,
//             productName: item.product.name,
//             productSku: item.product.sku,
//             price: Number(item.product.price),
//             quantity: item.quantity,
//             variant: item.variant,
//             weight: item.weight,
//             subtotal: Number(item.product.price) * item.quantity,
//           })),
//         },
//       },
//       include: {
//         items: true,
//       },
//     });

//     // Prepare invoice items for Xendit
//     const invoiceItems = cart.items.map((item) => ({
//       name: item.product.name,
//       quantity: item.quantity,
//       price: Number(item.product.price),
//       category: item.product.category || "PRODUCT",
//     }));

//     // Add shipping and tax as separate items
//     if (shippingCost > 0) {
//       invoiceItems.push({
//         name: `Pengiriman - ${shippingMethod.name}`,
//         quantity: 1,
//         price: shippingCost,
//         category: "SHIPPING",
//       });
//     }

//     if (tax > 0) {
//       invoiceItems.push({
//         name: "PPN (11%)",
//         quantity: 1,
//         price: tax,
//         category: "TAX",
//       });
//     }

//     // Map payment methods to Xendit channels
//     const paymentChannels = [];
//     switch (paymentMethod) {
//       case "credit_card":
//         paymentChannels.push("CREDIT_CARD");
//         break;
//       case "ewallet":
//         paymentChannels.push("OVO", "DANA", "LINKAJA", "SHOPEEPAY");
//         break;
//       case "qris":
//         paymentChannels.push("QRIS");
//         break;
//       case "bank_transfer":
//         paymentChannels.push("BCA", "MANDIRI", "BNI", "BRI", "PERMATA");
//         break;
//       case "retail_outlet":
//         paymentChannels.push("ALFAMART", "INDOMARET");
//         break;
//       default:
//         paymentChannels.push("CREDIT_CARD", "BANK_TRANSFER");
//     }

//     // Create Xendit invoice
//     const invoiceData = {
//       externalId: externalId,
//       amount: Math.round(total),
//       payerEmail: shippingInfo.email,
//       description: `Pembayaran untuk pesanan ${externalId}`,
//       invoiceDuration: 86400, // 24 hours
//       customer: {
//         givenNames: shippingInfo.fullName,
//         email: shippingInfo.email,
//         mobileNumber: shippingInfo.phone,
//         addresses: [
//           {
//             city: shippingInfo.city,
//             country: "Indonesia",
//             postalCode: shippingInfo.postalCode,
//             state: shippingInfo.state,
//             streetLine1: shippingInfo.address,
//           },
//         ],
//       },
//       customerNotificationPreference: {
//         invoiceCreated: ["email"],
//         invoiceReminder: ["email"],
//         invoicePaid: ["email"],
//       },
//       successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?order_id=${order.id}`,
//       failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed?order_id=${order.id}`,
//       currency: "IDR",
//       items: invoiceItems,
//       fees: [],
//       paymentMethods: paymentChannels,
//     };

//     const invoice = await invoiceClient.createInvoice({ data: invoiceData });

//     // Save invoice ID to order
//     await prisma.order.update({
//       where: { id: order.id },
//       data: {
//         xenditInvoiceId: invoice.id,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       invoiceUrl: invoice.invoiceUrl,
//       invoiceId: invoice.id,
//       orderId: order.id,
//       orderNumber: order.orderNumber,
//       externalId: externalId,
//     });
//   } catch (error) {
//     console.error("Create payment error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to create payment",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
