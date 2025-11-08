// prisma/seed-products.js

const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

// Unsplash image URL
const BASE_IMAGE = "https://images.unsplash.com/photo-1718009793079-d5b3aa81a62f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVtcGVofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500";

async function main() {
  console.log("🌱 Seeding tempe products...\n");

  const products = [
    // ============================================
    // KATEGORI: TEMPE PREMIUM
    // ============================================
    {
      sku: "TMP-PREM-001",
      name: "Tempe Premium Organik - Original",
      slug: "tempe-premium-organik-original",
      description: `Tempe premium dari kedelai organik pilihan, difermentasi dengan ragi murni berkualitas tinggi. Tekstur padat, aroma khas, dan rasa gurih alami. 

Keunggulan:
• 100% Kedelai Organik Bersertifikat
• Tanpa Pengawet & MSG
• Protein Tinggi (19g per 100g)
• Kaya Probiotik Alami
• Proses Fermentasi Tradisional 36 Jam

Cocok untuk:
- Dikonsumsi langsung (digoreng/dikukus)
- Bahan masakan premium
- Diet sehat & vegetarian
- Ekspor ke restoran internasional

Kemasan vacuum-sealed untuk kesegaran maksimal. Tahan hingga 7 hari di suhu ruang, 3 bulan di freezer.`,
      price: 25000,
      comparePrice: 35000,
      costPrice: 15000,
      stock: 500,
      lowStockAlert: 50,
      weight: 500, // grams
      length: 15,
      width: 10,
      height: 3,
      status: "ACTIVE",
      category: "premium",
      tags: ["organik", "premium", "bestseller", "export-quality"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&sat=-100`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&brightness=10`],
      featured: true,
      views: 1250,
      sales: 342,
      rating: 4.9,
      reviewCount: 89,
      seoTitle: "Tempe Premium Organik Original - Protein Tinggi & Sehat",
      seoDescription: "Tempe premium dari kedelai organik bersertifikat. Tanpa pengawet, tinggi protein, cocok untuk diet sehat dan ekspor.",
    },
    {
      sku: "TMP-PREM-002",
      name: "Tempe Premium Organik - Black Soybean",
      slug: "tempe-premium-organik-black-soybean",
      description: `Tempe premium dari kedelai hitam organik yang langka dan bergizi tinggi. Kandungan antioksidan 3x lebih tinggi dari tempe biasa.

Keunggulan:
• Kedelai Hitam Organik Premium
• Antioksidan Super Tinggi (Anthocyanin)
• Mencegah Penuaan Dini
• Baik untuk Kesehatan Jantung
• Rasa Lebih Gurih & Kaya

Manfaat Kesehatan:
- Menurunkan kolesterol
- Mengontrol gula darah
- Anti-kanker alami
- Meningkatkan metabolisme

Perfect untuk health-conscious customers dan pasar ekspor premium.`,
      price: 35000,
      comparePrice: 45000,
      costPrice: 22000,
      stock: 200,
      lowStockAlert: 30,
      weight: 500,
      length: 15,
      width: 10,
      height: 3,
      status: "ACTIVE",
      category: "premium",
      tags: ["organik", "black-soybean", "antioksidan", "limited-edition"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&hue=30`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&hue=30&sat=50`],
      featured: true,
      views: 890,
      sales: 156,
      rating: 4.8,
      reviewCount: 45,
      seoTitle: "Tempe Kedelai Hitam Organik - Antioksidan Tinggi",
      seoDescription: "Tempe premium dari kedelai hitam organik. Kaya antioksidan, baik untuk kesehatan jantung dan diet sehat.",
    },

    // ============================================
    // KATEGORI: TEMPE TRADISIONAL
    // ============================================
    {
      sku: "TMP-TRAD-001",
      name: "Tempe Tradisional Daun Pisang - Original",
      slug: "tempe-tradisional-daun-pisang",
      description: `Tempe tradisional dibungkus daun pisang seperti buatan nenek. Aroma khas daun pisang memberikan cita rasa autentik Indonesia.

Keistimewaan:
• Dibungkus Daun Pisang Asli
• Metode Fermentasi Tradisional
• Aroma Khas Nusantara
• Tekstur Lembut & Padat
• Fresh Daily Production

Nostalgia rasa Indonesia yang otentik. Populer di restoran tradisional dan komunitas Indonesia di luar negeri.

Storage: Best consumed within 3 days. Can be frozen for up to 2 months.`,
      price: 15000,
      comparePrice: 20000,
      costPrice: 9000,
      stock: 800,
      lowStockAlert: 100,
      weight: 400,
      length: 20,
      width: 8,
      height: 2,
      status: "ACTIVE",
      category: "tradisional",
      tags: ["tradisional", "daun-pisang", "authentic", "daily-fresh"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&sepia=20`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&sepia=20&brightness=-5`],
      featured: true,
      views: 2100,
      sales: 567,
      rating: 4.7,
      reviewCount: 134,
      seoTitle: "Tempe Tradisional Daun Pisang - Rasa Autentik Indonesia",
      seoDescription: "Tempe tradisional dibungkus daun pisang asli. Aroma khas, tekstur sempurna, fresh daily production.",
    },
    {
      sku: "TMP-TRAD-002",
      name: "Tempe Murni Kedelai Lokal - Ekonomis",
      slug: "tempe-murni-kedelai-lokal",
      description: `Tempe kualitas baik dari kedelai lokal pilihan dengan harga terjangkau. Perfect untuk konsumsi harian keluarga Indonesia.

Spesifikasi:
• Kedelai Lokal Berkualitas
• Harga Ekonomis
• Tetap Bernutrisi Tinggi
• Produksi Harian
• Kemasan Praktis

Ideal untuk:
- Lauk sehari-hari
- Usaha catering
- Warung makan
- Bulk order untuk komunitas

Best value for money! Kualitas terjaga dengan harga bersahabat.`,
      price: 12000,
      comparePrice: 15000,
      costPrice: 7000,
      stock: 1000,
      lowStockAlert: 150,
      weight: 400,
      length: 15,
      width: 10,
      height: 2,
      status: "ACTIVE",
      category: "tradisional",
      tags: ["ekonomis", "daily-use", "bulk-friendly", "lokal"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800`],
      featured: false,
      views: 3400,
      sales: 892,
      rating: 4.5,
      reviewCount: 201,
      seoTitle: "Tempe Kedelai Lokal Ekonomis - Berkualitas & Terjangkau",
      seoDescription: "Tempe murni kedelai lokal dengan harga ekonomis. Cocok untuk konsumsi harian, catering, dan bulk order.",
    },

    // ============================================
    // KATEGORI: TEMPE SPESIAL
    // ============================================
    {
      sku: "TMP-SPEC-001",
      name: "Tempe Gembus - Ampas Tahu Fermentasi",
      slug: "tempe-gembus-ampas-tahu",
      description: `Tempe gembus tradisional dari ampas tahu yang difermentasi. Khas Jawa Tengah dengan tekstur unik dan rasa gurih istimewa.

Unique Features:
• Berbahan Ampas Tahu Premium
• Tekstur Lembut & Berongga
• Rendah Kalori
• Tinggi Serat
• Traditional Javanese Recipe

Cocok untuk:
- Pecel sayur
- Tumisan spesial
- Sambal goreng
- Menu diet tinggi serat

Produk langka yang sulit ditemukan di luar Jawa. Favorit komunitas Indonesia di luar negeri!`,
      price: 18000,
      comparePrice: 25000,
      costPrice: 11000,
      stock: 150,
      lowStockAlert: 30,
      weight: 350,
      length: 12,
      width: 8,
      height: 4,
      status: "ACTIVE",
      category: "spesial",
      tags: ["gembus", "unik", "traditional", "jawa-tengah", "rare"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&blur=1`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&blur=1&brightness=5`],
      featured: false,
      views: 560,
      sales: 78,
      rating: 4.6,
      reviewCount: 23,
      seoTitle: "Tempe Gembus Ampas Tahu - Khas Jawa Tengah",
      seoDescription: "Tempe gembus tradisional dari ampas tahu. Tekstur unik, rendah kalori, tinggi serat. Langka dan istimewa!",
    },
    {
      sku: "TMP-SPEC-002",
      name: "Tempe Kedelai Campur Kacang Hijau",
      slug: "tempe-kedelai-kacang-hijau",
      description: `Inovasi tempe dengan kombinasi kedelai dan kacang hijau. Nutrisi ganda dengan rasa yang lebih kaya dan manis alami.

Combined Benefits:
• Protein dari Kedelai + Kacang Hijau
• Vitamin B Kompleks Tinggi
• Zat Besi & Folat
• Tekstur Lebih Renyah
• Rasa Manis Alami

Manfaat Kesehatan:
- Meningkatkan energi
- Baik untuk ibu hamil
- Mencegah anemia
- Menjaga kesehatan kulit

Innovation product yang cocok untuk market modern dan health-conscious consumers.`,
      price: 22000,
      comparePrice: 28000,
      costPrice: 14000,
      stock: 300,
      lowStockAlert: 50,
      weight: 450,
      length: 15,
      width: 10,
      height: 3,
      status: "ACTIVE",
      category: "spesial",
      tags: ["inovasi", "kacang-hijau", "nutrisi-ganda", "healthy"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&hue=80`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&hue=80&sat=30`],
      featured: false,
      views: 780,
      sales: 134,
      rating: 4.7,
      reviewCount: 38,
      seoTitle: "Tempe Kedelai Campur Kacang Hijau - Nutrisi Ganda",
      seoDescription: "Tempe inovasi kombinasi kedelai dan kacang hijau. Protein tinggi, baik untuk ibu hamil dan kesehatan.",
    },

    // ============================================
    // KATEGORI: TEMPE OLAHAN/READY TO EAT
    // ============================================
    {
      sku: "TMP-RTE-001",
      name: "Tempe Goreng Crispy - Original",
      slug: "tempe-goreng-crispy-original",
      description: `Tempe goreng kering super crispy, siap santap tanpa perlu dimasak lagi. Perfect untuk snack sehat atau topping salad.

Product Features:
• Pre-cooked & Ready to Eat
• Extra Crispy Texture
• No Preservatives
• Vacuum Sealed Fresh
• Long Shelf Life (30 days)

Serving Suggestions:
- Langsung dimakan sebagai snack
- Topping untuk salad
- Campuran nasi goreng
- Side dish untuk sandwich
- Traveling food

Perfect untuk busy professionals dan export market yang butuh convenience!`,
      price: 35000,
      comparePrice: 42000,
      costPrice: 20000,
      stock: 400,
      lowStockAlert: 60,
      weight: 200,
      length: 20,
      width: 15,
      height: 5,
      status: "ACTIVE",
      category: "olahan",
      tags: ["ready-to-eat", "crispy", "snack", "convenient", "export-ready"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&contrast=20`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&contrast=20&sat=50`],
      featured: true,
      views: 1450,
      sales: 287,
      rating: 4.8,
      reviewCount: 76,
      seoTitle: "Tempe Goreng Crispy Ready to Eat - Snack Sehat Praktis",
      seoDescription: "Tempe goreng crispy siap santap. Tanpa pengawet, vacuum sealed, tahan 30 hari. Perfect untuk snack dan ekspor.",
    },
    {
      sku: "TMP-RTE-002",
      name: "Tempe Goreng Crispy - Balado",
      slug: "tempe-goreng-crispy-balado",
      description: `Tempe goreng crispy dengan bumbu balado pedas khas Padang. Fusion of traditional tempe dengan flavour modern yang addictive!

Spicy Features:
• Bumbu Balado Autentik Padang
• Level Pedas: Medium-Hot
• Extra Crispy Coating
• Ready to Eat
• Premium Packaging

Rasa Nusantara yang International! Cocok untuk:
- Gift/souvenir khas Indonesia
- Snack untuk overseas Indonesian
- Restaurant appetizer
- Bar snacks
- Travel food

Best seller untuk komunitas Indonesia di luar negeri yang kangen rasa rumah!`,
      price: 38000,
      comparePrice: 45000,
      costPrice: 22000,
      stock: 300,
      lowStockAlert: 50,
      weight: 200,
      length: 20,
      width: 15,
      height: 5,
      status: "ACTIVE",
      category: "olahan",
      tags: ["ready-to-eat", "balado", "pedas", "fusion", "gift-worthy"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&hue=-20&sat=50`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&hue=-20&sat=50&brightness=5`],
      featured: true,
      views: 1890,
      sales: 412,
      rating: 4.9,
      reviewCount: 98,
      seoTitle: "Tempe Crispy Balado Pedas - Rasa Padang Autentik",
      seoDescription: "Tempe goreng crispy bumbu balado Padang. Pedas nikmat, ready to eat, cocok untuk gift dan ekspor.",
    },

    // ============================================
    // KATEGORI: PAKET HEMAT / BULK
    // ============================================
    {
      sku: "TMP-BULK-001",
      name: "Paket Hemat Tempe Mix - 10 Pack",
      slug: "paket-hemat-tempe-mix-10-pack",
      description: `Paket hemat berisi 10 pack tempe berbagai varian. Cocok untuk stok bulanan keluarga atau usaha catering.

Isi Paket:
• 5x Tempe Premium Organik (500g)
• 3x Tempe Tradisional Daun Pisang (400g)
• 2x Tempe Kedelai Lokal (400g)

Total: 4.6 kg tempe berkualitas!

Benefits:
- Hemat 25% dari harga satuan
- Variasi rasa untuk keluarga
- Bisa disimpan di freezer
- Perfect untuk usaha catering
- Free vacuum packaging

Ideal untuk: Keluarga besar, catering, warung makan, komunitas Indonesia, dan bulk export.`,
      price: 180000,
      comparePrice: 240000,
      costPrice: 120000,
      stock: 100,
      lowStockAlert: 20,
      weight: 4600,
      length: 30,
      width: 25,
      height: 15,
      status: "ACTIVE",
      category: "paket",
      tags: ["bulk", "hemat", "family-pack", "catering", "wholesale"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&brightness=10`],
      featured: false,
      views: 890,
      sales: 156,
      rating: 4.8,
      reviewCount: 45,
      seoTitle: "Paket Hemat Tempe Mix 10 Pack - Hemat 25%",
      seoDescription: "Paket hemat 10 pack tempe berbagai varian. Total 4.6kg, hemat 25%, cocok untuk keluarga dan usaha catering.",
    },
    {
      sku: "TMP-BULK-002",
      name: "Paket Premium Export - 20 Pack",
      slug: "paket-premium-export-20-pack",
      description: `Paket special untuk export dengan kemasan premium vacuum-sealed. Quality assured untuk pengiriman jarak jauh.

Premium Package Contains:
• 10x Tempe Premium Organik Original (500g)
• 5x Tempe Premium Black Soybean (500g)
• 5x Tempe Goreng Crispy Mix (200g)

Total: 8.5 kg premium tempe products!

Export Specifications:
- Triple vacuum-sealed packaging
- Food-grade cardboard box
- Cold chain compatible
- Shelf life: 3 months frozen
- Complete nutrition labels (EN/ID)
- Halal & Organic certified
- Custom label available (MOQ 50 packs)

Perfect for:
- Indonesian restaurants abroad
- Asian supermarkets
- Distributors
- Corporate gifting
- Diplomatic missions

Bulk discount available for 100+ packs!`,
      price: 450000,
      comparePrice: 600000,
      costPrice: 300000,
      stock: 50,
      lowStockAlert: 10,
      weight: 8500,
      length: 40,
      width: 30,
      height: 20,
      status: "ACTIVE",
      category: "paket",
      tags: ["export", "premium", "bulk", "wholesale", "distributor"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&sat=20`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&sat=20&contrast=10`],
      featured: true,
      views: 450,
      sales: 34,
      rating: 5.0,
      reviewCount: 12,
      seoTitle: "Paket Premium Export 20 Pack - Export Quality Tempe",
      seoDescription: "Paket premium 20 pack untuk export. Triple vacuum-sealed, tahan 3 bulan, certified halal & organik.",
    },

    // ============================================
    // KATEGORI: LIMITED EDITION / SEASONAL
    // ============================================
    {
      sku: "TMP-LTD-001",
      name: "Tempe Quinoa Fusion - Limited Edition",
      slug: "tempe-quinoa-fusion-limited",
      description: `LIMITED EDITION! Fusion tempe dengan quinoa - superfood dari Amerika Selatan. Protein complete dengan amino acid profile sempurna.

Revolutionary Combination:
• Kedelai Organik + Quinoa Premium
• Complete Protein Source
• Gluten-Free
• High Fiber Content
• Premium Texture

Nutritional Powerhouse:
- Protein: 22g per 100g
- All 9 Essential Amino Acids
- Rich in Magnesium & Iron
- Low Glycemic Index
- Omega-3 & Omega-6

Target Market:
- Health & fitness enthusiasts
- Vegan & vegetarian athletes
- Premium restaurants
- International markets
- Health food stores

Limited production: Only 300 units per month!
Pre-order available for next batch.`,
      price: 45000,
      comparePrice: 55000,
      costPrice: 28000,
      stock: 100,
      lowStockAlert: 20,
      weight: 500,
      length: 15,
      width: 10,
      height: 3,
      status: "ACTIVE",
      category: "limited-edition",
      tags: ["limited-edition", "superfood", "quinoa", "premium", "fusion"],
      images: [`${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&hue=120&sat=40`, `${BASE_IMAGE}&crop=entropy&fit=crop&h=800&w=800&hue=120&sat=40&brightness=10`],
      featured: true,
      views: 2300,
      sales: 67,
      rating: 4.9,
      reviewCount: 28,
      seoTitle: "Tempe Quinoa Fusion Limited Edition - Superfood Premium",
      seoDescription: "Limited edition tempe quinoa fusion. Complete protein, gluten-free, cocok untuk vegan athletes dan premium market.",
    },
  ];

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const product of products) {
    try {
      const existing = await prisma.product.findUnique({
        where: { sku: product.sku },
      });

      if (existing) {
        await prisma.product.update({
          where: { sku: product.sku },
          data: product,
        });
        console.log(`✅ Updated: ${product.name} (${product.sku})`);
        updated++;
      } else {
        await prisma.product.create({
          data: product,
        });
        console.log(`✨ Created: ${product.name} (${product.sku})`);
        created++;
      }
    } catch (error) {
      console.error(`❌ Failed: ${product.name} - ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   - Created: ${created} products`);
  console.log(`   - Updated: ${updated} products`);
  console.log(`   - Failed: ${failed} products`);
  console.log(`   - Total: ${created + updated} products\n`);

  // Display products by category
  const categories = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
    where: { status: "ACTIVE" },
  });

  console.log("📦 Products by Category:");
  for (const cat of categories) {
    const products = await prisma.product.findMany({
      where: { category: cat.category, status: "ACTIVE" },
      select: { name: true, price: true, stock: true },
    });

    console.log(`\n   ${cat.category.toUpperCase()} (${cat._count} products):`);
    products.forEach((p) => {
      console.log(`      - ${p.name}: Rp ${p.price.toLocaleString("id-ID")} | Stock: ${p.stock}`);
    });
  }

  // Calculate total inventory value
  const inventoryValue = await prisma.product.aggregate({
    _sum: {
      stock: true,
    },
    where: { status: "ACTIVE" },
  });

  const totalValue = await prisma.$queryRaw`
    SELECT SUM(price * stock) as total_value
    FROM products
    WHERE status = 'ACTIVE'
  `;

  console.log(`\n💰 Inventory Statistics:`);
  console.log(`   - Total Products: ${created + updated}`);
  console.log(`   - Total Stock: ${inventoryValue._sum.stock} units`);
  console.log(`   - Inventory Value: Rp ${Number(totalValue[0].total_value).toLocaleString("id-ID")}`);
  console.log(`\n✅ Products seeded successfully!\n`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
