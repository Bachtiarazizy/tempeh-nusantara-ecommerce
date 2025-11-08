// app/api/checkout/xendit-webhook/route.js
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import crypto from "crypto";

// export async function POST(request) {
//   try {
//     // Verify webhook signature
//     const callbackToken = request.headers.get("x-callback-token");

//     if (callbackToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
//       return NextResponse.json({ error: "Invalid webhook token" }, { status: 401 });
//     }

//     const body = await request.json();
//     const { external_id, status, payment_method, paid_amount, id } = body;

//     // Find order by external ID
//     const order = await prisma.order.findFirst({
//       where: { externalId: external_id },
//       include: { items: true },
//     });

//     if (!order) {
//       console.error("Order not found:", external_id);
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     // Handle different payment statuses
//     switch (status) {
//       case "PAID":
//       case "SETTLED":
//         // Update order status to paid
//         await prisma.order.update({
//           where: { id: order.id },
//           data: {
//             status: "PROCESSING",
//             paymentStatus: "PAID",
//             paidAt: new Date(),
//             xenditInvoiceId: id,
//           },
//         });

//         // Reduce product stock
//         for (const item of order.items) {
//           await prisma.product.update({
//             where: { id: item.productId },
//             data: {
//               stock: {
//                 decrement: item.quantity,
//               },
//             },
//           });
//         }

//         // Clear user's cart
//         await prisma.cart.update({
//           where: { userId: order.userId, status: "ACTIVE" },
//           data: {
//             status: "COMPLETED",
//           },
//         });

//         // Create new empty cart for user
//         await prisma.cart.create({
//           data: {
//             userId: order.userId,
//             status: "ACTIVE",
//           },
//         });

//         // TODO: Send confirmation email
//         // await sendOrderConfirmationEmail(order);

//         break;

//       case "EXPIRED":
//         await prisma.order.update({
//           where: { id: order.id },
//           data: {
//             status: "CANCELLED",
//             paymentStatus: "EXPIRED",
//             notes: "Payment invoice expired",
//           },
//         });
//         break;

//       case "FAILED":
//         await prisma.order.update({
//           where: { id: order.id },
//           data: {
//             status: "CANCELLED",
//             paymentStatus: "FAILED",
//             notes: `Payment failed via ${payment_method}`,
//           },
//         });
//         break;

//       default:
//         console.log("Unhandled status:", status);
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     return NextResponse.json(
//       {
//         error: "Webhook processing failed",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
