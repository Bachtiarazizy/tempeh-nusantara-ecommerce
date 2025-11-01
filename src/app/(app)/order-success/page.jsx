// // app/order-success/page.jsx
// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import OrderSuccessClient from "@/components/shared/order-success-client";

// export default async function OrderSuccessPage({ searchParams }) {
//   const session = await auth();

//   if (!session) {
//     redirect("/login");
//   }

//   const params = await searchParams;
//   const orderId = params.order_id;

//   if (!orderId) {
//     redirect("/products");
//   }

//   // Fetch order details
//   const order = await prisma.order.findUnique({
//     where: {
//       id: orderId,
//       userId: session.user.id,
//     },
//     include: {
//       items: {
//         include: {
//           product: {
//             select: {
//               images: true,
//               slug: true,
//             },
//           },
//         },
//       },
//       shippingMethod: true,
//     },
//   });

//   if (!order) {
//     redirect("/products?error=order-not-found");
//   }

//   // Parse shipping address
//   const shippingAddress = JSON.parse(order.shippingAddress);

//   // Transform order data
//   const transformedOrder = {
//     id: order.id,
//     orderNumber: order.orderNumber,
//     status: order.status,
//     paymentStatus: order.paymentStatus,
//     subtotal: Number(order.subtotal),
//     shippingCost: Number(order.shippingCost),
//     tax: Number(order.tax),
//     total: Number(order.total),
//     shippingAddress,
//     shippingMethod: {
//       name: order.shippingMethod.name,
//       description: order.shippingMethod.description,
//       estimatedDays: order.shippingMethod.estimatedDays,
//     },
//     items: order.items.map((item) => ({
//       id: item.id,
//       productName: item.productName,
//       productSku: item.productSku,
//       price: Number(item.price),
//       quantity: item.quantity,
//       variant: item.variant,
//       weight: item.weight,
//       subtotal: Number(item.subtotal),
//       image: item.product.images?.[0] || null,
//       slug: item.product.slug,
//     })),
//     paidAt: order.paidAt ? order.paidAt.toISOString() : null,
//     createdAt: order.createdAt.toISOString(),
//   };

//   return <OrderSuccessClient order={transformedOrder} user={session.user} />;
// }

// export const metadata = {
//   title: "Pesanan Berhasil | Terima Kasih",
//   description: "Pesanan Anda telah berhasil diproses",
//   robots: "noindex, nofollow",
// };

// export const dynamic = "force-dynamic";

// // components/shared/order-success-client.jsx
// "use client";

// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { CheckCircle2, Package, Truck, MapPin, Download, ArrowRight } from "lucide-react";
// import Link from "next/link";

// const OrderSuccessClient = ({ order, user }) => {
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(price);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("id-ID", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="min-h-screen bg-background py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Success Header */}
//         <div className="text-center mb-8">
//           <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <CheckCircle2 className="w-12 h-12 text-emerald-600" />
//           </div>
//           <h1 className="text-3xl font-bold text-foreground mb-2">Pesanan Berhasil!</h1>
//           <p className="text-muted-foreground mb-4">
//             Terima kasih atas pembelian Anda. Pesanan sedang diproses.
//           </p>
//           <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
//             <span className="text-sm text-muted-foreground">Nomor Pesanan:</span>
//             <span className="text-lg font-bold text-primary">{order.orderNumber}</span>
//           </div>
//         </div>

//         {/* Order Status Timeline */}
//         <div className="bg-card border rounded-lg p-6 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Status Pesanan</h2>
//           <div className="flex items-center justify-between">
//             <div className="flex flex-col items-center flex-1">
//               <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
//                 <CheckCircle2 className="w-5 h-5 text-emerald-600" />
//               </div>
//               <span className="text-xs font-medium text-center">Pesanan Dibuat</span>
//               <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
//             </div>
//             <div className="flex-1 h-1 bg-muted mx-2" />
//             <div className="flex flex-col items-center flex-1">
//               <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
//                 <Package className="w-5 h-5 text-primary" />
//               </div>
//               <span className="text-xs font-medium text-center">Sedang Diproses</span>
//             </div>
//             <div className="flex-1 h-1 bg-muted mx-2" />
//             <div className="flex flex-col items-center flex-1">
//               <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-2">
//                 <Truck className="w-5 h-5 text-muted-foreground" />
//               </div>
//               <span className="text-xs font-medium text-center">Dikirim</span>
//             </div>
//             <div className="flex-1 h-1 bg-muted mx-2" />
//             <div className="flex flex-col items-center flex-1">
//               <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-2">
//                 <MapPin className="w-5 h-5 text-muted-foreground" />
//               </div>
//               <span className="text-xs font-medium text-center">Diterima</span>
//             </div>
//           </div>
//         </div>

//         {/* Order Details */}
//         <div className="grid md:grid-cols-2 gap-6 mb-6">
//           {/* Shipping Address */}
//           <div className="bg-card border rounded-lg p-6">
//             <div className="flex items-center gap-2 mb-4">
//               <MapPin className="w-5 h-5 text-primary" />
//               <h2 className="text-lg font-semibold">Alamat Pengiriman</h2>
//             </div>
//             <div className="space-y-1 text-sm">
//               <p className="font-semibold">{order.shippingAddress.fullName}</p>
//               <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
//               <p className="text-muted-foreground">{order.shippingAddress.address}</p>
//               <p className="text-muted-foreground">
//                 {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
//               </p>
//               <p className="text-muted-foreground">{order.shippingAddress.country}</p>
//             </div>
//           </div>

//           {/* Shipping Method */}
//           <div className="bg-card border rounded-lg p-6">
//             <div className="flex items-center gap-2 mb-4">
//               <Truck className="w-5 h-5 text-primary" />
//               <h2 className="text-lg font-semibold">Metode Pengiriman</h2>
//             </div>
//             <div className="space-y-1 text-sm">
//               <p className="font-semibold">{order.shippingMethod.name}</p>
//               <p className="text-muted-foreground">{order.shippingMethod.description}</p>
//               <p className="text-muted-foreground">
//                 Estimasi: {order.shippingMethod.estimatedDays} hari kerja
//               </p>
//               <p className="font-semibold text-primary mt-2">{formatPrice(order.shippingCost)}</p>
//             </div>
//           </div>
//         </div>

//         {/* Order Items */}
//         <div className="bg-card border rounded-lg p-6 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Detail Pesanan</h2>
//           <div className="space-y-4">
//             {order.items.map((item) => (
//               <div key={item.id} className="flex gap-4">
//                 <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
//                   {item.image ? (
//                     <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
//                   ) : (
//                     <Package className="w-8 h-8 text-muted-foreground" />
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-sm">{item.productName}</h3>
//                   <p className="text-xs text-muted-foreground">SKU: {item.productSku}</p>
//                   {item.variant && <p className="text-xs text-muted-foreground">Varian: {item.variant}</p>}
//                   {item.weight && <p className="text-xs text-muted-foreground">Ukuran: {item.weight}</p>}
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-sm text-muted-foreground">
//                       {formatPrice(item.price)} x {item.quantity}
//                     </span>
//                     <span className="text-sm font-semibold">{formatPrice(item.subtotal)}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <Separator className="my-4" />

//           {/* Order Summary */}
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Subtotal</span>
//               <span className="font-medium">{formatPrice(order.subtotal)}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">Pengiriman</span>
//               <span className="font-medium">{formatPrice(order.shippingCost)}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-muted-foreground">PPN (11%)</span>
//               <span className="font-medium">{formatPrice(order.tax)}</span>
//             </div>
//             <Separator className="my-2" />
//             <div className="flex justify-between items-center pt-2">
//               <span className="text-lg font-semibold">Total</span>
//               <span className="text-2xl font-bold text-primary">{formatPrice(order.total)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Payment Info */}
//         <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
//           <div className="flex items-start gap-3">
//             <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
//             <div className="flex-1">
//               <p className="font-semibold text-emerald-900">Pembayaran Berhasil</p>
//               <p className="text-sm text-emerald-700">
//                 Pembayaran Anda telah berhasil diproses pada {order.paidAt ? formatDate(order.paidAt) : "baru saja"}
//               </p>
//               <p className="text-xs text-emerald-600 mt-1">
//                 Konfirmasi pesanan telah dikirim ke {order.shippingAddress.email}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <Button className="flex-1" size="lg" onClick={handlePrint}>
//             <Download className="w-4 h-4 mr-2" />
//             Cetak Invoice
//           </Button>
//           <Button variant="outline" className="flex-1" size="lg" asChild>
//             <Link href="/orders">
//               Lihat Pesanan Saya
//               <ArrowRight className="w-4 h-4 ml-2" />
//             </Link>
//           </Button>
//           <Button variant="outline" className="flex-1" size="lg" asChild>
//             <Link href="/products">Lanjut Belanja</Link>
//           </Button>
//         </div>

//         {/* Help Section */}
//         <div className="mt-8 text-center">
//           <p className="text-sm text-muted-foreground">
//             Butuh bantuan?{" "}
//             <Link href="/contact" className="text-primary hover:underline">
//               Hubungi Customer Service
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSuccessClient;
