// app/api/checkout/check-payment/route.js
// import { NextResponse } from "next/server";
// import { auth } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import Xendit from "xendit-node";

// const xendit = new Xendit({
//   secretKey: process.env.XENDIT_SECRET_KEY,
// });

// const { Invoice } = xendit;
// const invoiceClient = new Invoice({});

// export async function GET(request) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const orderId = searchParams.get("orderId");

//     if (!orderId) {
//       return NextResponse.json({ error: "Order ID required" }, { status: 400 });
//     }

//     // Get order
//     const order = await prisma.order.findUnique({
//       where: {
//         id: orderId,
//         userId: session.user.id,
//       },
//     });

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     }

//     // Check invoice status with Xendit
//     if (order.xenditInvoiceId) {
//       try {
//         const invoice = await invoiceClient.getInvoice({
//           invoiceId: order.xenditInvoiceId,
//         });

//         // Update order if status changed
//         if (invoice.status === "PAID" && order.paymentStatus !== "PAID") {
//           await prisma.order.update({
//             where: { id: order.id },
//             data: {
//               status: "PROCESSING",
//               paymentStatus: "PAID",
//               paidAt: new Date(),
//             },
//           });
//         }

//         return NextResponse.json({
//           success: true,
//           order: {
//             id: order.id,
//             orderNumber: order.orderNumber,
//             status: order.status,
//             paymentStatus: invoice.status === "PAID" ? "PAID" : order.paymentStatus,
//           },
//           invoice: {
//             id: invoice.id,
//             status: invoice.status,
//             invoiceUrl: invoice.invoiceUrl,
//             expiryDate: invoice.expiryDate,
//           },
//         });
//       } catch (xenditError) {
//         console.error("Xendit API error:", xenditError);
//         // Return order status from database if Xendit fails
//         return NextResponse.json({
//           success: true,
//           order: {
//             id: order.id,
//             orderNumber: order.orderNumber,
//             status: order.status,
//             paymentStatus: order.paymentStatus,
//           },
//         });
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       order: {
//         id: order.id,
//         orderNumber: order.orderNumber,
//         status: order.status,
//         paymentStatus: order.paymentStatus,
//       },
//     });
//   } catch (error) {
//     console.error("Check payment error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to check payment status",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
