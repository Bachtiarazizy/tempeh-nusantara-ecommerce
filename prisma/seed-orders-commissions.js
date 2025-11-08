// prisma/seed-orders-commissions.js

const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

// Helper function to generate order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}${month}${day}-${random}`;
}

// Helper function to generate external ID for Xendit
function generateExternalId() {
  return `EXT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Helper function to calculate dates
function getDaysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("🌱 Seeding orders, commissions, and related data...\n");

  // Get required data
  const users = await prisma.user.findMany({
    where: { role: "BUYER", status: "ACTIVE" },
    include: { addresses: true },
  });

  const affiliates = await prisma.affiliate.findMany({
    where: { status: "ACTIVE" },
  });

  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
  });

  const shippingMethods = await prisma.shippingMethod.findMany({
    where: { isActive: true },
  });

  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN", status: "ACTIVE" },
  });

  if (users.length === 0 || products.length === 0 || shippingMethods.length === 0) {
    console.error("❌ Please run seed-users.js and seed-products.js first!");
    process.exit(1);
  }

  console.log(`📦 Found ${users.length} buyers, ${products.length} products, ${affiliates.length} affiliates\n`);

  // ============================================
  // 1. CREATE COMPLETED ORDERS (with commissions)
  // ============================================
  console.log("✅ Creating COMPLETED orders...");

  const completedOrders = [];

  // Order 1: VIP Customer via Top Affiliate (30 days ago) - COMPLETED
  const order1Products = [products[0], products[1]];
  const order1Items = order1Products.map((p) => ({
    productId: p.id,
    productName: p.name,
    productSku: p.sku,
    productImage: p.images[0],
    price: p.price,
    quantity: 2,
    discount: 0,
    subtotal: Number(p.price) * 2,
  }));

  const order1Subtotal = order1Items.reduce((sum, item) => sum + item.subtotal, 0);
  const order1Shipping = Number(shippingMethods[0].price);
  const order1Total = order1Subtotal + order1Shipping;

  const order1 = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: users[0].id,
      affiliateId: affiliates[0]?.id,
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentMethod: "BANK_TRANSFER",
      xenditInvoiceId: `inv_${Date.now()}_1`,
      xenditInvoiceUrl: "https://checkout.xendit.co/web/invoice-1",
      externalId: generateExternalId(),
      paymentChannel: "BCA",
      paymentExpiredAt: getDaysAgo(29),
      subtotal: order1Subtotal,
      discount: 0,
      shippingCost: order1Shipping,
      tax: 0,
      adminFee: 0,
      total: order1Total,
      shippingMethodId: shippingMethods[0].id,
      shippingAddress: JSON.stringify(users[0].addresses[0]),
      trackingNumber: "JNE123456789",
      courier: "JNE",
      estimatedDelivery: getDaysAgo(25),
      customerNotes: "Tolong kirim pagi ya, saya kerja siang",
      ipAddress: "125.160.245.67",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      paidAt: getDaysAgo(29),
      processedAt: getDaysAgo(29),
      packedAt: getDaysAgo(28),
      shippedAt: getDaysAgo(28),
      deliveredAt: getDaysAgo(25),
      completedAt: getDaysAgo(25),
      createdAt: getDaysAgo(30),
      items: {
        create: order1Items,
      },
    },
  });

  completedOrders.push(order1);
  console.log(`   ✓ Order ${order1.orderNumber} - Rp ${order1Total.toLocaleString("id-ID")} (COMPLETED)`);

  // Create commission for Order 1
  if (affiliates[0]) {
    await prisma.commission.create({
      data: {
        affiliateId: affiliates[0].id,
        orderId: order1.id,
        orderNumber: order1.orderNumber,
        orderTotal: order1.total,
        commissionRate: affiliates[0].commissionRate,
        amount: (Number(order1.total) * Number(affiliates[0].commissionRate)) / 100,
        status: "PAID",
        approvedAt: getDaysAgo(25),
        approvedBy: adminUser?.id || "admin@tempeempire.com",
        paidAt: getDaysAgo(20),
        paidAmount: (Number(order1.total) * Number(affiliates[0].commissionRate)) / 100,
        paymentNote: "Pembayaran komisi periode Oktober 2024",
        createdAt: getDaysAgo(30),
      },
    });
  }

  // Order 2: Regular Customer via Affiliate 2 (20 days ago) - COMPLETED
  const order2Products = [products[2], products[3], products[4]];
  const order2Items = order2Products.map((p, idx) => ({
    productId: p.id,
    productName: p.name,
    productSku: p.sku,
    productImage: p.images[0],
    price: p.price,
    quantity: idx === 0 ? 3 : 1,
    discount: 0,
    subtotal: Number(p.price) * (idx === 0 ? 3 : 1),
  }));

  const order2Subtotal = order2Items.reduce((sum, item) => sum + item.subtotal, 0);
  const order2Shipping = Number(shippingMethods[2].price);
  const order2Total = order2Subtotal + order2Shipping;

  const order2 = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: users[1].id,
      affiliateId: affiliates[1]?.id,
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentMethod: "EWALLET",
      xenditInvoiceId: `inv_${Date.now()}_2`,
      externalId: generateExternalId(),
      paymentChannel: "OVO",
      paymentExpiredAt: getDaysAgo(19),
      subtotal: order2Subtotal,
      discount: 0,
      shippingCost: order2Shipping,
      tax: 0,
      adminFee: 0,
      total: order2Total,
      shippingMethodId: shippingMethods[2].id,
      shippingAddress: JSON.stringify(users[1].addresses[0]),
      trackingNumber: "JNT987654321",
      courier: "J&T",
      estimatedDelivery: getDaysAgo(15),
      paidAt: getDaysAgo(19),
      processedAt: getDaysAgo(19),
      packedAt: getDaysAgo(18),
      shippedAt: getDaysAgo(18),
      deliveredAt: getDaysAgo(15),
      completedAt: getDaysAgo(15),
      createdAt: getDaysAgo(20),
      items: {
        create: order2Items,
      },
    },
  });

  completedOrders.push(order2);
  console.log(`   ✓ Order ${order2.orderNumber} - Rp ${order2Total.toLocaleString("id-ID")} (COMPLETED)`);

  // Create commission for Order 2
  if (affiliates[1]) {
    await prisma.commission.create({
      data: {
        affiliateId: affiliates[1].id,
        orderId: order2.id,
        orderNumber: order2.orderNumber,
        orderTotal: order2.total,
        commissionRate: affiliates[1].commissionRate,
        amount: (Number(order2.total) * Number(affiliates[1].commissionRate)) / 100,
        status: "PAID",
        approvedAt: getDaysAgo(15),
        approvedBy: adminUser?.id || "admin@tempeempire.com",
        paidAt: getDaysAgo(10),
        paidAmount: (Number(order2.total) * Number(affiliates[1].commissionRate)) / 100,
        paymentNote: "Pembayaran komisi periode Oktober 2024",
        createdAt: getDaysAgo(20),
      },
    });
  }

  // Order 3: VIP Customer (15 days ago) - COMPLETED (no affiliate)
  const order3Products = [products[5], products[6]];
  const order3Items = order3Products.map((p) => ({
    productId: p.id,
    productName: p.name,
    productSku: p.sku,
    productImage: p.images[0],
    price: p.price,
    quantity: 5,
    discount: 0,
    subtotal: Number(p.price) * 5,
  }));

  const order3Subtotal = order3Items.reduce((sum, item) => sum + item.subtotal, 0);
  const order3Shipping = 0; // Free shipping
  const order3Total = order3Subtotal;

  const order3 = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: users[0].id,
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentMethod: "CREDIT_CARD",
      xenditInvoiceId: `inv_${Date.now()}_3`,
      externalId: generateExternalId(),
      paymentChannel: "VISA",
      paymentExpiredAt: getDaysAgo(14),
      subtotal: order3Subtotal,
      discount: 0,
      shippingCost: order3Shipping,
      tax: 0,
      adminFee: 0,
      total: order3Total,
      shippingMethodId: shippingMethods[4].id,
      shippingAddress: JSON.stringify(users[0].addresses[0]),
      trackingNumber: "SICEPAT123456",
      courier: "SiCepat",
      estimatedDelivery: getDaysAgo(12),
      customerNotes: "Paket untuk kantor, jam 9-17",
      paidAt: getDaysAgo(14),
      processedAt: getDaysAgo(14),
      packedAt: getDaysAgo(13),
      shippedAt: getDaysAgo(13),
      deliveredAt: getDaysAgo(12),
      completedAt: getDaysAgo(12),
      createdAt: getDaysAgo(15),
      items: {
        create: order3Items,
      },
    },
  });

  completedOrders.push(order3);
  console.log(`   ✓ Order ${order3.orderNumber} - Rp ${order3Total.toLocaleString("id-ID")} (COMPLETED)`);

  // ============================================
  // 2. CREATE DELIVERED ORDERS (waiting confirmation)
  // ============================================
  console.log("\n📦 Creating DELIVERED orders...");

  const order4Products = [products[7], products[8]];
  const order4Items = order4Products.map((p) => ({
    productId: p.id,
    productName: p.name,
    productSku: p.sku,
    productImage: p.images[0],
    price: p.price,
    quantity: 2,
    discount: 0,
    subtotal: Number(p.price) * 2,
  }));

  const order4Subtotal = order4Items.reduce((sum, item) => sum + item.subtotal, 0);
  const order4Shipping = Number(shippingMethods[1].price);
  const order4Total = order4Subtotal + order4Shipping;

  const order4 = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: users[2].id,
      affiliateId: affiliates[0]?.id,
      status: "DELIVERED",
      paymentStatus: "PAID",
      paymentMethod: "QRIS",
      xenditInvoiceId: `inv_${Date.now()}_4`,
      externalId: generateExternalId(),
      paymentChannel: "QRIS",
      paymentExpiredAt: getDaysAgo(9),
      subtotal: order4Subtotal,
      discount: 0,
      shippingCost: order4Shipping,
      tax: 0,
      adminFee: 0,
      total: order4Total,
      shippingMethodId: shippingMethods[1].id,
      shippingAddress: JSON.stringify(users[2].addresses[0]),
      trackingNumber: "JNE789012345",
      courier: "JNE",
      estimatedDelivery: getDaysAgo(5),
      paidAt: getDaysAgo(9),
      processedAt: getDaysAgo(9),
      packedAt: getDaysAgo(8),
      shippedAt: getDaysAgo(7),
      deliveredAt: getDaysAgo(5),
      createdAt: getDaysAgo(10),
      items: {
        create: order4Items,
      },
    },
  });

  console.log(`   ✓ Order ${order4.orderNumber} - Rp ${order4Total.toLocaleString("id-ID")} (DELIVERED)`);

  if (affiliates[0]) {
    await prisma.commission.create({
      data: {
        affiliateId: affiliates[0].id,
        orderId: order4.id,
        orderNumber: order4.orderNumber,
        orderTotal: order4.total,
        commissionRate: affiliates[0].commissionRate,
        amount: (Number(order4.total) * Number(affiliates[0].commissionRate)) / 100,
        status: "APPROVED",
        approvedAt: getDaysAgo(5),
        approvedBy: adminUser?.id || "admin@tempeempire.com",
        createdAt: getDaysAgo(10),
      },
    });
  }

  // ============================================
  // 3. CREATE SHIPPED ORDERS (in transit)
  // ============================================
  console.log("\n🚚 Creating SHIPPED orders...");

  const order5Products = [products[0], products[2], products[4]];
  const order5Items = order5Products.map((p) => ({
    productId: p.id,
    productName: p.name,
    productSku: p.sku,
    productImage: p.images[0],
    price: p.price,
    quantity: 1,
    discount: 0,
    subtotal: Number(p.price),
  }));

  const order5Subtotal = order5Items.reduce((sum, item) => sum + item.subtotal, 0);
  const order5Shipping = Number(shippingMethods[3].price);
  const order5Total = order5Subtotal + order5Shipping;

  const order5 = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: users[1].id,
      affiliateId: affiliates[1]?.id,
      status: "SHIPPED",
      paymentStatus: "PAID",
      paymentMethod: "EWALLET",
      xenditInvoiceId: `inv_${Date.now()}_5`,
      externalId: generateExternalId(),
      paymentChannel: "DANA",
      paymentExpiredAt: getDaysAgo(4),
      subtotal: order5Subtotal,
      discount: 0,
      shippingCost: order5Shipping,
      tax: 0,
      adminFee: 0,
      total: order5Total,
      shippingMethodId: shippingMethods[3].id,
      shippingAddress: JSON.stringify(users[1].addresses[0]),
      trackingNumber: "SICEPAT789012",
      courier: "SiCepat",
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
      paidAt: getDaysAgo(4),
      processedAt: getDaysAgo(4),
      packedAt: getDaysAgo(3),
      shippedAt: getDaysAgo(3),
      createdAt: getDaysAgo(5),
      items: {
        create: order5Items,
      },
    },
  });

  console.log(`   ✓ Order ${order5.orderNumber} - Rp ${order5Total.toLocaleString("id-ID")} (SHIPPED)`);

  if (affiliates[1]) {
    await prisma.commission.create({
      data: {
        affiliateId: affiliates[1].id,
        orderId: order5.id,
        orderNumber: order5.orderNumber,
        orderTotal: order5.total,
        commissionRate: affiliates[1].commissionRate,
        amount: (Number(order5.total) * Number(affiliates[1].commissionRate)) / 100,
        status: "APPROVED",
        approvedAt: getDaysAgo(3),
        approvedBy: adminUser?.id || "admin@tempeempire.com",
        createdAt: getDaysAgo(5),
      },
    });
  }

  // ============================================
  // 4. CREATE PACKED ORDERS (ready to ship)
  // ============================================
  console.log("\n📦 Creating PACKED orders...");

  const order6Products = [products[1], products[3]];
  const order6Items = order6Products.map((p) => ({
    productId: p.id,
    productName: p.name,
    productSku: p.sku,
    productImage: p.images[0],
    price: p.price,
    quantity: 3,
    discount: 0,
    subtotal: Number(p.price) * 3,
  }));

  const order6Subtotal = order6Items.reduce((sum, item) => sum + item.subtotal, 0);
  const order6Shipping = Number(shippingMethods[0].price);
  const order6Total = order6Subtotal + order6Shipping;

  const order6 = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: users[0].id,
      affiliateId: affiliates[2]?.id,
      status: "PACKED",
      paymentStatus: "PAID",
      paymentMethod: "BANK_TRANSFER",
      xenditInvoiceId: `inv_${Date.now()}_6`,
      externalId: generateExternalId(),
      paymentChannel: "BNI",
      paymentExpiredAt: getDaysAgo(1),
      subtotal: order6Subtotal,
      discount: 0,
      shippingCost: order6Shipping,
      tax: 0,
      adminFee: 0,
      total: order6Total,
      shippingMethodId: shippingMethods[0].id,
      shippingAddress: JSON.stringify(users[0].addresses[0]),
      adminNotes: "Priority customer, pack dengan extra bubble wrap",
      paidAt: getDaysAgo(1),
      processedAt: getDaysAgo(1),
      packedAt: new Date(),
      createdAt: getDaysAgo(2),
      items: {
        create: order6Items,
      },
    },
  });

  console.log(`   ✓ Order ${order6.orderNumber} - Rp ${order6Total.toLocaleString("id-ID")} (PACKED)`);

  if (affiliates[2]) {
    await prisma.commission.create({
      data: {
        affiliateId: affiliates[2].id,
        orderId: order6.id,
        orderNumber: order6.orderNumber,
        orderTotal: order6.total,
        commissionRate: affiliates[2].commissionRate,
        amount: (Number(order6.total) * Number(affiliates[2].commissionRate)) / 100,
        status: "PENDING",
        createdAt: getDaysAgo(2),
      },
    });
  }

  // ============================================
  // 5. CREATE PROCESSING ORDERS (payment received)
  // ============================================
  console.log("\n⚙️ Creating PROCESSING orders...");

  const order7Products = [products[5]];
  const order7Items = order7Products.map((p) => ({
    productId: p.id,
    productName: p.name,
    productSku: p.sku,
    productImage: p.images[0],
    price: p.price,
    quantity: 10,
    discount: 0,
    subtotal: Number(p.price) * 10,
  }));

  const order7Subtotal = order7Items.reduce((sum, item) => sum + item.subtotal, 0);
  const order7Shipping = Number(shippingMethods[2].price);
  const order7Total = order7Subtotal + order7Shipping;

  const order7 = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: users[2].id,
      affiliateId: affiliates[0]?.id,
      status: "PROCESSING",
      paymentStatus: "PAID",
      paymentMethod: "EWALLET",
      xenditInvoiceId: `inv_${Date.now()}_7`,
      externalId: generateExternalId(),
      paymentChannel: "SHOPEEPAY",
      paymentExpiredAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
      subtotal: order7Subtotal,
      discount: 0,
      shippingCost: order7Shipping,
      tax: 0,
      adminFee: 0,
      total: order7Total,
      shippingMethodId: shippingMethods[2].id,
      shippingAddress: JSON.stringify(users[2].addresses[0]),
      customerNotes: "Untuk reseller, mohon packing rapi",
      paidAt: new Date(),
      processedAt: new Date(),
      createdAt: new Date(),
      items: {
        create: order7Items,
      },
    },
  });

  console.log(`   ✓ Order ${order7.orderNumber} - Rp ${order7Total.toLocaleString("id-ID")} (PROCESSING)`);

  if (affiliates[0]) {
    await prisma.commission.create({
      data: {
        affiliateId: affiliates[0].id,
        orderId: order7.id,
        orderNumber: order7.orderNumber,
        orderTotal: order7.total,
        commissionRate: affiliates[0].commissionRate,
        amount: (Number(order7.total) * Number(affiliates[0].commissionRate)) / 100,
        status: "PENDING",
        createdAt: new Date(),
      },
    });
  }

  // ============================================
  // 6. CREATE PENDING ORDERS (awaiting payment)
  // ============================================
  console.log("\n⏳ Creating PENDING orders...");

  const order8Products = [products[0], products[1]];
  const order8Items = order8Products.map((p) => ({
    productId: p.id,
    productName: p.name,
    productSku: p.sku,
    productImage: p.images[0],
    price: p.price,
    quantity: 1,
    discount: 0,
    subtotal: Number(p.price),
  }));

  const order8Subtotal = order8Items.reduce((sum, item) => sum + item.subtotal, 0);
  const order8Shipping = Number(shippingMethods[0].price);
  const order8Total = order8Subtotal + order8Shipping;

  const order8 = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: users[1].id,
      affiliateId: affiliates[1]?.id,
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: "BANK_TRANSFER",
      xenditInvoiceId: `inv_${Date.now()}_8`,
      xenditInvoiceUrl: `https://checkout.xendit.co/web/invoice-${Date.now()}`,
      externalId: generateExternalId(),
      paymentExpiredAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
      subtotal: order8Subtotal,
      discount: 0,
      shippingCost: order8Shipping,
      tax: 0,
      adminFee: 0,
      total: order8Total,
      shippingMethodId: shippingMethods[0].id,
      shippingAddress: JSON.stringify(users[1].addresses[0]),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      items: {
        create: order8Items,
      },
    },
  });

  console.log(`   ✓ Order ${order8.orderNumber} - Rp ${order8Total.toLocaleString("id-ID")} (PENDING)`);

  if (affiliates[1]) {
    await prisma.commission.create({
      data: {
        affiliateId: affiliates[1].id,
        orderId: order8.id,
        orderNumber: order8.orderNumber,
        orderTotal: order8.total,
        commissionRate: affiliates[1].commissionRate,
        amount: (Number(order8.total) * Number(affiliates[1].commissionRate)) / 100,
        status: "PENDING",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    });
  }

  // ============================================
  // 7. CREATE CANCELLED ORDER
  // ============================================
  console.log("\n❌ Creating CANCELLED order...");

  const order9Products = [products[2]];
  const order9Items = order9Products.map((p) => ({
    productId: p.id,
    productName: p.name,
    productSku: p.sku,
    productImage: p.images[0],
    price: p.price,
    quantity: 1,
    discount: 0,
    subtotal: Number(p.price),
  }));

  const order9Subtotal = order9Items.reduce((sum, item) => sum + item.subtotal, 0);
  const order9Shipping = Number(shippingMethods[0].price);
  const order9Total = order9Subtotal + order9Shipping;

  const order9 = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: users[2].id,
      status: "CANCELLED",
      paymentStatus: "EXPIRED",
      paymentMethod: "BANK_TRANSFER",
      xenditInvoiceId: `inv_${Date.now()}_9`,
      externalId: generateExternalId(),
      paymentExpiredAt: getDaysAgo(7),
      subtotal: order9Subtotal,
      discount: 0,
      shippingCost: order9Shipping,
      tax: 0,
      adminFee: 0,
      total: order9Total,
      shippingMethodId: shippingMethods[0].id,
      shippingAddress: JSON.stringify(users[2].addresses[0]),
      cancelReason: "Customer tidak melakukan pembayaran dalam 24 jam",
      cancelledAt: getDaysAgo(6),
      createdAt: getDaysAgo(7),
      items: {
        create: order9Items,
      },
    },
  });

  console.log(`   ✓ Order ${order9.orderNumber} - Rp ${order9Total.toLocaleString("id-ID")} (CANCELLED)`);

  // ============================================
  // 8. CREATE ORDER STATUS HISTORY
  // ============================================
  console.log("\n📝 Creating order status history...");

  // History for Order 1 (COMPLETED)
  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order1.id,
        status: "PENDING",
        notes: "Order dibuat oleh customer",
        createdAt: getDaysAgo(30),
      },
      {
        orderId: order1.id,
        status: "PROCESSING",
        notes: "Pembayaran diterima, order sedang diproses",
        createdBy: adminUser?.id,
        createdAt: getDaysAgo(29),
      },
      {
        orderId: order1.id,
        status: "PACKED",
        notes: "Order sudah di-pack dan siap dikirim",
        createdBy: adminUser?.id,
        createdAt: getDaysAgo(28),
      },
      {
        orderId: order1.id,
        status: "SHIPPED",
        notes: "Order dikirim via JNE dengan nomor resi JNE123456789",
        createdBy: adminUser?.id,
        createdAt: getDaysAgo(28),
      },
      {
        orderId: order1.id,
        status: "DELIVERED",
        notes: "Paket telah diterima oleh customer",
        createdAt: getDaysAgo(25),
      },
      {
        orderId: order1.id,
        status: "COMPLETED",
        notes: "Order selesai, customer puas dengan produk",
        createdAt: getDaysAgo(25),
      },
    ],
    skipDuplicates: true,
  });

  // History for Order 9 (CANCELLED)
  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order9.id,
        status: "PENDING",
        notes: "Order dibuat, menunggu pembayaran",
        createdAt: getDaysAgo(7),
      },
      {
        orderId: order9.id,
        status: "CANCELLED",
        notes: "Order dibatalkan karena pembayaran expired",
        createdBy: "SYSTEM",
        createdAt: getDaysAgo(6),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Order status history created");

  // ============================================
  // 9. CREATE PAYOUTS
  // ============================================
  console.log("\n💳 Creating payouts...");

  // Payout 1: Completed payout for Affiliate 1
  const payout1Amount = 3200000;
  await prisma.payout.create({
    data: {
      payoutNumber: `PAYOUT-${new Date().getFullYear()}10-001`,
      affiliateId: affiliates[0].id,
      amount: payout1Amount,
      status: "COMPLETED",
      method: "BANK_TRANSFER",
      bankName: "Bank BCA",
      accountNumber: "1234567890",
      accountName: "Budi Santoso",
      requestedAt: getDaysAgo(25),
      processedAt: getDaysAgo(21),
      processedBy: adminUser?.id || "admin@tempeempire.com",
      paidAt: getDaysAgo(20),
      referenceCode: "TRF20241020001",
      proofUrl: "https://example.com/proof/payout-001.pdf",
      note: "Pembayaran komisi periode Oktober 2024 - Batch 1",
      createdAt: getDaysAgo(25),
    },
  });
  console.log(`   ✓ Payout PAYOUT-${new Date().getFullYear()}10-001 - Rp ${payout1Amount.toLocaleString("id-ID")} (COMPLETED)`);

  // Payout 2: Completed payout for Affiliate 2
  const payout2Amount = 1200000;
  await prisma.payout.create({
    data: {
      payoutNumber: `PAYOUT-${new Date().getFullYear()}10-002`,
      affiliateId: affiliates[1].id,
      amount: payout2Amount,
      status: "COMPLETED",
      method: "BANK_TRANSFER",
      bankName: "Bank Mandiri",
      accountNumber: "9876543210",
      accountName: "Siti Nurhaliza",
      requestedAt: getDaysAgo(20),
      processedAt: getDaysAgo(16),
      processedBy: adminUser?.id || "admin@tempeempire.com",
      paidAt: getDaysAgo(15),
      referenceCode: "TRF20241021001",
      proofUrl: "https://example.com/proof/payout-002.pdf",
      note: "Pembayaran komisi periode Oktober 2024 - Batch 2",
      createdAt: getDaysAgo(20),
    },
  });
  console.log(`   ✓ Payout PAYOUT-${new Date().getFullYear()}10-002 - Rp ${payout2Amount.toLocaleString("id-ID")} (COMPLETED)`);

  // Payout 3: Processing payout for Affiliate 1
  const payout3Amount = 690000;
  await prisma.payout.create({
    data: {
      payoutNumber: `PAYOUT-${new Date().getFullYear()}11-001`,
      affiliateId: affiliates[0].id,
      amount: payout3Amount,
      status: "PROCESSING",
      method: "BANK_TRANSFER",
      bankName: "Bank BCA",
      accountNumber: "1234567890",
      accountName: "Budi Santoso",
      requestedAt: getDaysAgo(2),
      processedAt: new Date(),
      processedBy: adminUser?.id || "admin@tempeempire.com",
      note: "Pembayaran komisi periode November 2024 - sedang diproses",
      createdAt: getDaysAgo(2),
    },
  });
  console.log(`   ✓ Payout PAYOUT-${new Date().getFullYear()}11-001 - Rp ${payout3Amount.toLocaleString("id-ID")} (PROCESSING)`);

  // Payout 4: Pending payout for Affiliate 2
  const payout4Amount = 195000;
  await prisma.payout.create({
    data: {
      payoutNumber: `PAYOUT-${new Date().getFullYear()}11-002`,
      affiliateId: affiliates[1].id,
      amount: payout4Amount,
      status: "PENDING",
      method: "BANK_TRANSFER",
      bankName: "Bank Mandiri",
      accountNumber: "9876543210",
      accountName: "Siti Nurhaliza",
      requestedAt: getDaysAgo(1),
      note: "Menunggu approval admin untuk pembayaran",
      createdAt: getDaysAgo(1),
    },
  });
  console.log(`   ✓ Payout PAYOUT-${new Date().getFullYear()}11-002 - Rp ${payout4Amount.toLocaleString("id-ID")} (PENDING)`);

  // ============================================
  // SUMMARY & STATISTICS
  // ============================================
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY & STATISTICS");
  console.log("=".repeat(60));

  // Order statistics
  const orderStats = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
    _sum: {
      total: true,
    },
  });

  console.log("\n📦 Orders by Status:");
  let totalOrders = 0;
  let totalRevenue = 0;
  orderStats.forEach((stat) => {
    totalOrders += stat._count;
    totalRevenue += Number(stat._sum.total || 0);
    console.log(`   - ${stat.status}: ${stat._count} orders (Rp ${Number(stat._sum.total || 0).toLocaleString("id-ID")})`);
  });
  console.log(`   - TOTAL: ${totalOrders} orders (Rp ${totalRevenue.toLocaleString("id-ID")})`);

  // Commission statistics
  const commissionStats = await prisma.commission.groupBy({
    by: ["status"],
    _count: true,
    _sum: {
      amount: true,
    },
  });

  console.log("\n💰 Commissions by Status:");
  let totalCommissions = 0;
  commissionStats.forEach((stat) => {
    totalCommissions += Number(stat._sum.amount || 0);
    console.log(`   - ${stat.status}: ${stat._count} commissions (Rp ${Number(stat._sum.amount || 0).toLocaleString("id-ID")})`);
  });
  console.log(`   - TOTAL: Rp ${totalCommissions.toLocaleString("id-ID")}`);

  // Commission by affiliate
  console.log("\n👥 Commissions by Affiliate:");
  for (const affiliate of affiliates) {
    const affiliateUser = await prisma.user.findUnique({
      where: { id: affiliate.userId },
    });

    const commissions = await prisma.commission.findMany({
      where: { affiliateId: affiliate.id },
    });

    const totalCommission = commissions.reduce((sum, c) => sum + Number(c.amount), 0);
    const paidCount = commissions.filter((c) => c.status === "PAID").length;
    const approvedCount = commissions.filter((c) => c.status === "APPROVED").length;
    const pendingCount = commissions.filter((c) => c.status === "PENDING").length;

    console.log(`\n   ${affiliateUser?.name} (${affiliate.referralCode}) - ${affiliate.tier} Tier:`);
    console.log(`      - Total Commissions: Rp ${totalCommission.toLocaleString("id-ID")}`);
    console.log(`      - Paid: ${paidCount} | Approved: ${approvedCount} | Pending: ${pendingCount}`);
  }

  // Payout statistics
  const payoutStats = await prisma.payout.groupBy({
    by: ["status"],
    _count: true,
    _sum: {
      amount: true,
    },
  });

  console.log("\n💳 Payouts by Status:");
  payoutStats.forEach((stat) => {
    console.log(`   - ${stat.status}: ${stat._count} payouts (Rp ${Number(stat._sum.amount || 0).toLocaleString("id-ID")})`);
  });

  // Orders by payment method
  const paymentMethodStats = await prisma.order.groupBy({
    by: ["paymentMethod"],
    _count: true,
    where: {
      paymentMethod: { not: null },
    },
  });

  console.log("\n💳 Orders by Payment Method:");
  paymentMethodStats.forEach((stat) => {
    console.log(`   - ${stat.paymentMethod}: ${stat._count} orders`);
  });

  // Top customers
  console.log("\n🏆 Top Customers:");
  const topCustomers = await prisma.order.groupBy({
    by: ["userId"],
    _count: true,
    _sum: {
      total: true,
    },
    where: {
      status: { in: ["COMPLETED", "DELIVERED", "SHIPPED", "PACKED", "PROCESSING"] },
    },
    orderBy: {
      _sum: {
        total: "desc",
      },
    },
    take: 3,
  });

  for (const customer of topCustomers) {
    const user = await prisma.user.findUnique({
      where: { id: customer.userId },
    });
    console.log(`   - ${user?.name}: ${customer._count} orders (Rp ${Number(customer._sum.total || 0).toLocaleString("id-ID")})`);
  }

  // Best selling products
  console.log("\n🌟 Best Selling Products (from orders):");
  const productSales = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
      subtotal: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  for (const sale of productSales) {
    const product = await prisma.product.findUnique({
      where: { id: sale.productId },
    });
    console.log(`   - ${product?.name}: ${sale._sum.quantity} units sold (Rp ${Number(sale._sum.subtotal || 0).toLocaleString("id-ID")})`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Orders, commissions, and payouts seeded successfully!");
  console.log("=".repeat(60) + "\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding orders:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
