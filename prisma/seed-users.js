// prisma/seed-users.js

const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding users and related data...\n");

  // Hash password untuk semua user (password: "Password123!")
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // ============================================
  // 1. CREATE ADMIN USERS
  // ============================================
  console.log("👤 Creating Admin Users...");

  const admin1 = await prisma.user.upsert({
    where: { email: "admin@tempehnusantara.com" },
    update: {},
    create: {
      email: "admin@tempehnusantara.com",
      password: hashedPassword,
      name: "Super Admin",
      phone: "+628123456789",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: new Date(),
      lastLoginIp: "103.127.96.18",
    },
  });
  console.log(`✅ Created: ${admin1.name} (${admin1.email})`);

  const admin2 = await prisma.user.upsert({
    where: { email: "operations@tempehnusantara.com" },
    update: {},
    create: {
      email: "operations@tempehnusantara.com",
      password: hashedPassword,
      name: "Operations Manager",
      phone: "+628123456790",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      lastLoginIp: "103.127.96.19",
    },
  });
  console.log(`✅ Created: ${admin2.name} (${admin2.email})`);

  // ============================================
  // 2. CREATE AFFILIATE USERS
  // ============================================
  console.log("\n🤝 Creating Affiliate Users...");

  // Affiliate 1 - Top Performer (GOLD TIER)
  const affiliateUser1 = await prisma.user.upsert({
    where: { email: "top.affiliate@gmail.com" },
    update: {},
    create: {
      email: "top.affiliate@gmail.com",
      password: hashedPassword,
      name: "Budi Santoso",
      phone: "+628567891234",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
      role: "AFFILIATE",
      status: "ACTIVE",
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      lastLoginIp: "114.124.168.45",
    },
  });

  const affiliate1 = await prisma.affiliate.upsert({
    where: { userId: affiliateUser1.id },
    update: {},
    create: {
      userId: affiliateUser1.id,
      status: "ACTIVE",
      referralCode: "BUDI2024",
      commissionRate: 10.0,
      monthlyGoal: 50,
      totalClicks: 2450,
      totalOrders: 156,
      totalSales: 38900000,
      totalCommission: 3890000,
      paidCommission: 3200000,
      pendingCommission: 690000,
      rank: 1,
      tier: "GOLD",
      joinedAt: new Date("2024-01-15"),
      approvedAt: new Date("2024-01-16"),
      bankName: "Bank BCA",
      bankCode: "014",
      accountNumber: "1234567890",
      accountName: "Budi Santoso",
    },
  });
  console.log(`✅ Created: ${affiliateUser1.name} - ${affiliate1.tier} tier (${affiliate1.referralCode})`);

  // Affiliate 2 - Rising Star (SILVER TIER)
  const affiliateUser2 = await prisma.user.upsert({
    where: { email: "rising.star@gmail.com" },
    update: {},
    create: {
      email: "rising.star@gmail.com",
      password: hashedPassword,
      name: "Siti Nurhaliza",
      phone: "+628567891235",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=siti",
      role: "AFFILIATE",
      status: "ACTIVE",
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      lastLoginIp: "114.124.168.46",
    },
  });

  const affiliate2 = await prisma.affiliate.upsert({
    where: { userId: affiliateUser2.id },
    update: {},
    create: {
      userId: affiliateUser2.id,
      status: "ACTIVE",
      referralCode: "SITI2024",
      commissionRate: 7.5,
      monthlyGoal: 30,
      totalClicks: 1250,
      totalOrders: 78,
      totalSales: 18600000,
      totalCommission: 1395000,
      paidCommission: 1200000,
      pendingCommission: 195000,
      rank: 2,
      tier: "SILVER",
      joinedAt: new Date("2024-03-20"),
      approvedAt: new Date("2024-03-21"),
      bankName: "Bank Mandiri",
      bankCode: "008",
      accountNumber: "9876543210",
      accountName: "Siti Nurhaliza",
    },
  });
  console.log(`✅ Created: ${affiliateUser2.name} - ${affiliate2.tier} tier (${affiliate2.referralCode})`);

  // Affiliate 3 - New Starter (BRONZE TIER)
  const affiliateUser3 = await prisma.user.upsert({
    where: { email: "newbie.affiliate@gmail.com" },
    update: {},
    create: {
      email: "newbie.affiliate@gmail.com",
      password: hashedPassword,
      name: "Ahmad Wijaya",
      phone: "+628567891236",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad",
      role: "AFFILIATE",
      status: "ACTIVE",
      emailVerified: true,
      phoneVerified: false,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      lastLoginIp: "114.124.168.47",
    },
  });

  const affiliate3 = await prisma.affiliate.upsert({
    where: { userId: affiliateUser3.id },
    update: {},
    create: {
      userId: affiliateUser3.id,
      status: "ACTIVE",
      referralCode: "AHMAD2024",
      commissionRate: 5.0,
      monthlyGoal: 10,
      totalClicks: 340,
      totalOrders: 12,
      totalSales: 2400000,
      totalCommission: 120000,
      paidCommission: 0,
      pendingCommission: 120000,
      rank: 15,
      tier: "BRONZE",
      joinedAt: new Date("2024-10-01"),
      approvedAt: new Date("2024-10-02"),
      bankName: "Bank BRI",
      bankCode: "002",
      accountNumber: "5678901234",
      accountName: "Ahmad Wijaya",
    },
  });
  console.log(`✅ Created: ${affiliateUser3.name} - ${affiliate3.tier} tier (${affiliate3.referralCode})`);

  // Affiliate 4 - Pending Approval
  const affiliateUser4 = await prisma.user.upsert({
    where: { email: "pending.affiliate@gmail.com" },
    update: {},
    create: {
      email: "pending.affiliate@gmail.com",
      password: hashedPassword,
      name: "Dewi Lestari",
      phone: "+628567891237",
      role: "AFFILIATE",
      status: "PENDING",
      emailVerified: true,
      phoneVerified: false,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      lastLoginIp: "114.124.168.48",
    },
  });

  const affiliate4 = await prisma.affiliate.upsert({
    where: { userId: affiliateUser4.id },
    update: {},
    create: {
      userId: affiliateUser4.id,
      status: "PENDING",
      referralCode: "DEWI2024",
      commissionRate: 5.0,
      monthlyGoal: 10,
      tier: "BRONZE",
      joinedAt: new Date("2024-11-01"),
    },
  });
  console.log(`✅ Created: ${affiliateUser4.name} - PENDING approval (${affiliate4.referralCode})`);

  // ============================================
  // 3. CREATE BUYER USERS
  // ============================================
  console.log("\n🛍️ Creating Buyer Users...");

  // Buyer 1 - VIP Customer (High value, many orders)
  const buyer1 = await prisma.user.upsert({
    where: { email: "vip.customer@gmail.com" },
    update: {},
    create: {
      email: "vip.customer@gmail.com",
      password: hashedPassword,
      name: "Rina Kusuma",
      phone: "+628123456701",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rina",
      role: "BUYER",
      status: "ACTIVE",
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 15),
      lastLoginIp: "125.160.245.67",
    },
  });
  console.log(`✅ Created: ${buyer1.name} (VIP Customer)`);

  // Buyer 2 - Regular Customer
  const buyer2 = await prisma.user.upsert({
    where: { email: "regular.buyer@gmail.com" },
    update: {},
    create: {
      email: "regular.buyer@gmail.com",
      password: hashedPassword,
      name: "Joko Widodo",
      phone: "+628123456702",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joko",
      role: "BUYER",
      status: "ACTIVE",
      emailVerified: true,
      phoneVerified: true,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      lastLoginIp: "125.160.245.68",
    },
  });
  console.log(`✅ Created: ${buyer2.name} (Regular Customer)`);

  // Buyer 3 - New Customer
  const buyer3 = await prisma.user.upsert({
    where: { email: "new.customer@gmail.com" },
    update: {},
    create: {
      email: "new.customer@gmail.com",
      password: hashedPassword,
      name: "Lina Wijaya",
      phone: "+628123456703",
      role: "BUYER",
      status: "ACTIVE",
      emailVerified: true,
      phoneVerified: false,
      lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      lastLoginIp: "125.160.245.69",
    },
  });
  console.log(`✅ Created: ${buyer3.name} (New Customer)`);

  // ============================================
  // 4. CREATE ADDRESSES
  // ============================================
  console.log("\n📍 Creating Addresses...");

  // Addresses for Buyer 1 (VIP)
  await prisma.address.createMany({
    data: [
      {
        userId: buyer1.id,
        fullName: "Rina Kusuma",
        label: "Rumah",
        phone: "+628123456701",
        address: "Jl. Sudirman No. 123, RT 01/RW 05",
        city: "Jakarta Selatan",
        state: "DKI Jakarta",
        postalCode: "12190",
        country: "Indonesia",
        isDefault: true,
      },
      {
        userId: buyer1.id,
        fullName: "Rina Kusuma",
        label: "Kantor",
        phone: "+628123456701",
        address: "Plaza Indonesia, Lantai 15, Jl. MH Thamrin",
        city: "Jakarta Pusat",
        state: "DKI Jakarta",
        postalCode: "10350",
        country: "Indonesia",
        isDefault: false,
      },
    ],
    skipDuplicates: true,
  });

  // Addresses for Buyer 2
  await prisma.address.create({
    data: {
      userId: buyer2.id,
      fullName: "Joko Widodo",
      label: "Rumah",
      phone: "+628123456702",
      address: "Jl. Gatot Subroto No. 45, RT 03/RW 08",
      city: "Bandung",
      state: "Jawa Barat",
      postalCode: "40264",
      country: "Indonesia",
      isDefault: true,
    },
  });

  // Addresses for Buyer 3
  await prisma.address.create({
    data: {
      userId: buyer3.id,
      fullName: "Lina Wijaya",
      label: "Rumah",
      phone: "+628123456703",
      address: "Jl. Diponegoro No. 78, RT 02/RW 04",
      city: "Surabaya",
      state: "Jawa Timur",
      postalCode: "60241",
      country: "Indonesia",
      isDefault: true,
    },
  });

  console.log("✅ Addresses created");

  // ============================================
  // 5. CREATE AFFILIATE CLICKS
  // ============================================
  console.log("\n👆 Creating Affiliate Clicks...");

  const clicksData = [];

  // Clicks for Affiliate 1 (spread over time)
  for (let i = 0; i < 50; i++) {
    clicksData.push({
      affiliateId: affiliate1.id,
      ipAddress: `114.124.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      referer: "https://instagram.com/tempe_hnusantara",
      countryCode: "ID",
      cityName: ["Jakarta", "Bandung", "Surabaya", "Medan"][Math.floor(Math.random() * 4)],
      converted: i < 10, // 10 converted
      clickedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
    });
  }

  // Clicks for Affiliate 2
  for (let i = 0; i < 30; i++) {
    clicksData.push({
      affiliateId: affiliate2.id,
      ipAddress: `125.160.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
      referer: "https://facebook.com",
      countryCode: "ID",
      cityName: ["Semarang", "Yogyakarta", "Solo"][Math.floor(Math.random() * 3)],
      converted: i < 5,
      clickedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
    });
  }

  // Clicks for Affiliate 3
  for (let i = 0; i < 15; i++) {
    clicksData.push({
      affiliateId: affiliate3.id,
      ipAddress: `103.127.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: "Mozilla/5.0 (Android 11; Mobile)",
      referer: "https://twitter.com",
      countryCode: "ID",
      cityName: ["Malang", "Bali"][Math.floor(Math.random() * 2)],
      converted: i < 2,
      clickedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
    });
  }

  await prisma.affiliateClick.createMany({
    data: clicksData,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${clicksData.length} affiliate clicks`);

  // ============================================
  // 6. CREATE SHIPPING METHODS
  // ============================================
  console.log("\n🚚 Creating Shipping Methods...");

  const shippingMethods = [
    // JNE Services
    {
      name: "JNE Reguler",
      code: "jne_reg",
      description: "Pengiriman standar JNE dengan estimasi 3-5 hari kerja",
      courier: "JNE",
      service: "REG",
      price: 15000,
      estimatedDays: 5,
      minOrderAmount: null,
      maxWeight: 30, // 30 kg
      isActive: true,
      isFreeShipping: false,
      sortOrder: 1,
    },
    {
      name: "JNE YES",
      code: "jne_yes",
      description: "Pengiriman cepat JNE dengan estimasi 1-2 hari kerja",
      courier: "JNE",
      service: "YES",
      price: 35000,
      estimatedDays: 2,
      minOrderAmount: 50000,
      maxWeight: 10, // 10 kg
      isActive: true,
      isFreeShipping: false,
      sortOrder: 2,
    },

    // J&T Services
    {
      name: "J&T Express Reguler",
      code: "jnt_reg",
      description: "Pengiriman J&T dengan estimasi 3-5 hari kerja",
      courier: "JNT",
      service: "REG",
      price: 12000,
      estimatedDays: 5,
      minOrderAmount: null,
      maxWeight: 20, // 20 kg
      isActive: true,
      isFreeShipping: false,
      sortOrder: 3,
    },

    // SiCepat Services
    {
      name: "SiCepat Reguler",
      code: "sicepat_reg",
      description: "Pengiriman SiCepat dengan estimasi 3-4 hari kerja",
      courier: "SiCepat",
      service: "REG",
      price: 13000,
      estimatedDays: 4,
      minOrderAmount: null,
      maxWeight: 25, // 25 kg
      isActive: true,
      isFreeShipping: false,
      sortOrder: 4,
    },
    {
      name: "SiCepat Best",
      code: "sicepat_best",
      description: "Pengiriman cepat SiCepat dengan estimasi 1-2 hari kerja",
      courier: "SiCepat",
      service: "BEST",
      price: 30000,
      estimatedDays: 2,
      minOrderAmount: 50000,
      maxWeight: 15, // 15 kg
      isActive: true,
      isFreeShipping: false,
      sortOrder: 5,
    },

    // Ninja Xpress
    {
      name: "Ninja Xpress Reguler",
      code: "ninja_reg",
      description: "Pengiriman Ninja Xpress dengan estimasi 3-5 hari kerja",
      courier: "Ninja Xpress",
      service: "REG",
      price: 11000,
      estimatedDays: 5,
      minOrderAmount: null,
      maxWeight: 20, // 20 kg
      isActive: true,
      isFreeShipping: false,
      sortOrder: 6,
    },

    // AnterAja
    {
      name: "AnterAja Reguler",
      code: "anteraja_reg",
      description: "Pengiriman AnterAja dengan estimasi 3-4 hari kerja",
      courier: "AnterAja",
      service: "REG",
      price: 10000,
      estimatedDays: 4,
      minOrderAmount: null,
      maxWeight: 20, // 20 kg
      isActive: true,
      isFreeShipping: false,
      sortOrder: 7,
    },

    // Same Day Delivery
    {
      name: "Same Day Delivery",
      code: "same_day",
      description: "Pengiriman di hari yang sama (khusus Jabodetabek)",
      courier: "Same Day",
      service: "SAME_DAY",
      price: 50000,
      estimatedDays: 0,
      minOrderAmount: 100000,
      maxWeight: 5, // 5 kg
      isActive: true,
      isFreeShipping: false,
      sortOrder: 8,
    },

    // Instant Delivery
    {
      name: "Instant Delivery (2-4 Jam)",
      code: "instant",
      description: "Pengiriman kilat dalam 2-4 jam (khusus area tertentu)",
      courier: "Instant",
      service: "INSTANT",
      price: 75000,
      estimatedDays: 0,
      minOrderAmount: 150000,
      maxWeight: 3, // 3 kg
      isActive: false, // Disabled by default, enable per area
      isFreeShipping: false,
      sortOrder: 9,
    },

    // Free Shipping Tiers
    {
      name: "Gratis Ongkir - Min. 200K",
      code: "free_200k",
      description: "Gratis ongkir untuk pembelian minimal Rp 200.000 (3-5 hari)",
      courier: "JNE",
      service: "REG",
      price: 0,
      estimatedDays: 5,
      minOrderAmount: 200000,
      maxWeight: 10, // 10 kg
      isActive: true,
      isFreeShipping: true,
      sortOrder: 10,
    },
    {
      name: "Gratis Ongkir - Min. 500K",
      code: "free_500k",
      description: "Gratis ongkir untuk pembelian minimal Rp 500.000 (1-2 hari)",
      courier: "JNE",
      service: "YES",
      price: 0,
      estimatedDays: 2,
      minOrderAmount: 500000,
      maxWeight: 20, // 20 kg
      isActive: true,
      isFreeShipping: true,
      sortOrder: 11,
    },

    // Self Pickup
    {
      name: "Ambil Sendiri (Gratis)",
      code: "self_pickup",
      description: "Ambil pesanan di toko kami (gratis ongkir)",
      courier: "Self Pickup",
      service: "PICKUP",
      price: 0,
      estimatedDays: 1,
      minOrderAmount: null,
      maxWeight: null, // No weight limit
      isActive: true,
      isFreeShipping: true,
      sortOrder: 12,
    },
  ];

  for (const method of shippingMethods) {
    await prisma.shippingMethod.upsert({
      where: { code: method.code },
      update: method,
      create: method,
    });
  }

  console.log("✅ Shipping methods created");

  // ============================================
  // 7. CREATE CART & WISHLIST
  // ============================================
  console.log("\n🛒 Creating Carts and Wishlists...");

  // Get some products
  const products = await prisma.product.findMany({
    take: 5,
    where: { status: "ACTIVE" },
  });

  // Cart for Buyer 1
  const cart1 = await prisma.cart.upsert({
    where: { userId: buyer1.id },
    update: {},
    create: {
      userId: buyer1.id,
      status: "ACTIVE",
    },
  });

  if (products.length > 0) {
    await prisma.cartItem.createMany({
      data: [
        {
          cartId: cart1.id,
          productId: products[0].id,
          productSku: products[0].sku,
          productName: products[0].name,
          quantity: 2,
          price: products[0].price,
          image: products[0].images[0],
        },
        {
          cartId: cart1.id,
          productId: products[1].id,
          productSku: products[1].sku,
          productName: products[1].name,
          quantity: 1,
          price: products[1].price,
          image: products[1].images[0],
        },
      ],
      skipDuplicates: true,
    });
  }

  // Wishlist for Buyer 2
  const wishlist2 = await prisma.wishlist.upsert({
    where: { userId: buyer2.id },
    update: {},
    create: {
      userId: buyer2.id,
    },
  });

  if (products.length > 2) {
    await prisma.wishlistItem.createMany({
      data: [
        {
          wishlistId: wishlist2.id,
          productId: products[2].id,
          productSku: products[2].sku,
          productName: products[2].name,
          price: products[2].price,
          image: products[2].images[0],
        },
        {
          wishlistId: wishlist2.id,
          productId: products[3].id,
          productSku: products[3].sku,
          productName: products[3].name,
          price: products[3].price,
          image: products[3].images[0],
        },
      ],
      skipDuplicates: true,
    });
  }

  console.log("✅ Carts and wishlists created");

  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n📊 Summary:");

  const userCounts = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  console.log("\n👥 Users by Role:");
  userCounts.forEach((count) => {
    console.log(`   - ${count.role}: ${count._count}`);
  });

  const affiliateCounts = await prisma.affiliate.groupBy({
    by: ["tier"],
    _count: true,
  });

  console.log("\n🏆 Affiliates by Tier:");
  affiliateCounts.forEach((count) => {
    console.log(`   - ${count.tier}: ${count._count}`);
  });

  const totalClicks = await prisma.affiliateClick.count();
  const convertedClicks = await prisma.affiliateClick.count({
    where: { converted: true },
  });

  console.log("\n📈 Affiliate Statistics:");
  console.log(`   - Total Clicks: ${totalClicks}`);
  console.log(`   - Converted: ${convertedClicks}`);
  console.log(`   - Conversion Rate: ${((convertedClicks / totalClicks) * 100).toFixed(2)}%`);

  const addressCount = await prisma.address.count();
  const cartCount = await prisma.cart.count();
  const wishlistCount = await prisma.wishlist.count();

  console.log("\n📍 Other Data:");
  console.log(`   - Addresses: ${addressCount}`);
  console.log(`   - Carts: ${cartCount}`);
  console.log(`   - Wishlists: ${wishlistCount}`);

  console.log("\n✅ All users and related data seeded successfully!");
  console.log("\n🔐 Login Credentials:");
  console.log("   Password untuk semua user: Password123!");
  console.log("\n   Admin:");
  console.log("   - admin@tempehnusantara.com");
  console.log("   - operations@tempehnusantara.com");
  console.log("\n   Affiliates:");
  console.log("   - top.affiliate@gmail.com (GOLD - Budi)");
  console.log("   - rising.star@gmail.com (SILVER - Siti)");
  console.log("   - newbie.affiliate@gmail.com (BRONZE - Ahmad)");
  console.log("   - pending.affiliate@gmail.com (PENDING - Dewi)");
  console.log("\n   Buyers:");
  console.log("   - vip.customer@gmail.com (VIP - Rina)");
  console.log("   - regular.buyer@gmail.com (Regular - Joko)");
  console.log("   - new.customer@gmail.com (New - Lina)");
  console.log("");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
