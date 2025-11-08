const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

// prisma/seed-shipping.js

async function main() {
  console.log("🚚 Seeding shipping methods...\n");

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

  let created = 0;
  let updated = 0;

  for (const method of shippingMethods) {
    try {
      const existing = await prisma.shippingMethod.findUnique({
        where: { code: method.code },
      });

      if (existing) {
        await prisma.shippingMethod.update({
          where: { code: method.code },
          data: method,
        });
        console.log(`✅ Updated: ${method.name}`);
        updated++;
      } else {
        await prisma.shippingMethod.create({
          data: method,
        });
        console.log(`✨ Created: ${method.name}`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Failed to process ${method.name}:`, error.message);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   - Created: ${created} shipping methods`);
  console.log(`   - Updated: ${updated} shipping methods`);
  console.log(`   - Total: ${created + updated} shipping methods\n`);

  // Display active shipping methods
  const activeMethods = await prisma.shippingMethod.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      name: true,
      code: true,
      price: true,
      estimatedDays: true,
      isFreeShipping: true,
    },
  });

  console.log("🚀 Active Shipping Methods:");
  activeMethods.forEach((method) => {
    const priceText = method.isFreeShipping ? "🎁 GRATIS" : `Rp ${method.price.toLocaleString("id-ID")}`;
    console.log(`   - ${method.name} (${method.code}): ${priceText} | ${method.estimatedDays} hari`);
  });

  console.log("\n✅ Shipping methods seeded successfully!\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding shipping methods:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
