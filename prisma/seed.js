const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

const productsData = [
  // ============================================
  // KATEGORI PREMIUM
  // ============================================
  {
    sku: "TPE-001",
    name: "Tempe Premium Export Grade A",
    slug: "tempe-premium-export-grade-a",
    description: `Tempe Premium Export Grade A adalah produk tempe berkualitas tinggi yang diproduksi dengan standar internasional. Dibuat dari kedelai pilihan organik dan difermentasi dengan ragi berkualitas premium.

Produk ini telah melewati berbagai sertifikasi kualitas dan food safety, menjadikannya pilihan sempurna untuk konsumen yang mengutamakan kesehatan dan kualitas.

Keunggulan:
- 100% Kedelai Organik Bersertifikat
- Tanpa Pengawet & MSG
- Proses Fermentasi Tradisional 36 Jam
- Dikemas Vacuum Sealed untuk Kesegaran Maksimal
- Halal & BPOM Certified
- High Protein Content (19g per 100g)
- Kaya Probiotik Alami
- Export Quality Standard`,
    price: 25000,
    comparePrice: 35000,
    stock: 150,
    weight: 0.5,
    status: "ACTIVE",
    category: "premium",
    images: [
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800",
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800",
      "https://images.unsplash.com/photo-1589621316382-008455b857cd?w=800",
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800",
    ],
    featured: true,
  },
  {
    sku: "TPE-002",
    name: "Tempe Premium Kedelai Hitam",
    slug: "tempe-premium-kedelai-hitam",
    description: `Tempe Premium dari kedelai hitam organik dengan kandungan antioksidan tinggi. Tekstur lebih padat dengan rasa yang khas dan kaya nutrisi.

Kedelai hitam mengandung lebih banyak antosianin, antioksidan kuat yang bermanfaat untuk kesehatan jantung dan anti-aging.

Keunggulan:
- Kedelai Hitam Organik Premium
- Kandungan Antioksidan 3x Lebih Tinggi
- Tekstur Extra Padat
- Rasa Khas & Gurih
- Cocok untuk Diet Sehat
- High Protein & Low Carb
- BPOM & Halal Certified`,
    price: 30000,
    comparePrice: 40000,
    stock: 80,
    weight: 0.5,
    status: "ACTIVE",
    category: "premium",
    images: ["https://images.unsplash.com/photo-1589621316382-008455b857cd?w=800", "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800"],
    featured: true,
  },
  {
    sku: "TPE-003",
    name: "Tempe Premium Triple Fermented",
    slug: "tempe-premium-triple-fermented",
    description: `Tempe premium dengan proses fermentasi tiga kali untuk menghasilkan tekstur super lembut dan mudah dicerna. Ideal untuk anak-anak dan lansia.

Proses triple fermentation menghasilkan probiotik lebih banyak dan protein yang lebih mudah diserap tubuh.

Keunggulan:
- Fermentasi 3x (72 Jam Total)
- Tekstur Super Lembut
- Mudah Dicerna
- Probiotik Maksimal
- Cocok untuk Semua Usia
- Tanpa Bau Menyengat
- Premium Quality`,
    price: 35000,
    comparePrice: 45000,
    stock: 60,
    weight: 0.5,
    status: "ACTIVE",
    category: "premium",
    images: ["https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800"],
    featured: false,
  },

  // ============================================
  // KATEGORI ORGANIK
  // ============================================
  {
    sku: "TOR-001",
    name: "Tempe Organik Bersertifikat",
    slug: "tempe-organik-bersertifikat",
    description: `Tempe organik dengan sertifikasi resmi dari lembaga organik internasional. Dibuat dari kedelai organik tanpa pestisida dan pupuk kimia.

100% natural dan ramah lingkungan, cocok untuk Anda yang peduli dengan kesehatan dan kelestarian alam.

Keunggulan:
- Sertifikat Organik Internasional
- Kedelai Non-GMO
- Tanpa Pestisida & Pupuk Kimia
- Ramah Lingkungan
- Packaging Biodegradable
- Farm to Table Process
- Mendukung Petani Lokal`,
    price: 28000,
    comparePrice: 35000,
    stock: 120,
    weight: 0.5,
    status: "ACTIVE",
    category: "organic",
    images: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800", "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800"],
    featured: true,
  },
  {
    sku: "TOR-002",
    name: "Tempe Organik Multigrain",
    slug: "tempe-organik-multigrain",
    description: `Tempe organik dengan campuran berbagai biji-bijian sehat seperti kedelai, kacang merah, dan beras merah. Nutrisi lengkap dalam satu produk.

Kombinasi sempurna untuk diet sehat dengan kandungan serat, protein, dan vitamin yang lengkap.

Keunggulan:
- Mix 5 Jenis Biji-bijian Organik
- Super High Fiber
- Complete Nutrition
- Rasa Unik & Gurih
- Cocok untuk Diet
- Sertifikat Organik
- Rich in Vitamins`,
    price: 32000,
    comparePrice: 40000,
    stock: 90,
    weight: 0.5,
    status: "ACTIVE",
    category: "organic",
    images: ["https://images.unsplash.com/photo-1589621316382-008455b857cd?w=800"],
    featured: true,
  },
  {
    sku: "TOR-003",
    name: "Tempe Organik Baby",
    slug: "tempe-organik-baby",
    description: `Tempe organik khusus untuk bayi dan balita dengan tekstur extra lembut dan mudah dicerna. Tanpa garam, gula, atau bahan tambahan.

Diformulasikan khusus untuk MPASI dengan standar keamanan pangan tertinggi.

Keunggulan:
- Khusus untuk Bayi 6+ Bulan
- Tekstur Extra Lembut
- Tanpa Garam & Gula
- Hypoallergenic
- Mudah Dicerna
- Sertifikat BPOM MPASI
- Organik 100%`,
    price: 35000,
    comparePrice: null,
    stock: 50,
    weight: 0.3,
    status: "ACTIVE",
    category: "organic",
    images: ["https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800"],
    featured: false,
  },

  // ============================================
  // KATEGORI TRADISIONAL
  // ============================================
  {
    sku: "TTR-001",
    name: "Tempe Tradisional Klasik",
    slug: "tempe-tradisional-klasik",
    description: `Tempe dengan resep tradisional turun-temurun. Dibungkus daun pisang untuk aroma khas yang autentik.

Tempe dengan cita rasa asli Indonesia yang telah diwariskan dari generasi ke generasi.

Keunggulan:
- Resep Turun Temurun
- Dibungkus Daun Pisang
- Aroma Khas Tradisional
- Rasa Autentik
- Proses Manual
- Supporting Local Farmers
- Harga Terjangkau`,
    price: 15000,
    comparePrice: 18000,
    stock: 200,
    weight: 0.5,
    status: "ACTIVE",
    category: "traditional",
    images: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800"],
    featured: true,
  },
  {
    sku: "TTR-002",
    name: "Tempe Mendoan Siap Goreng",
    slug: "tempe-mendoan-siap-goreng",
    description: `Tempe mendoan tipis yang sudah dibumbui, tinggal goreng. Praktis dan hemat waktu untuk camilan keluarga.

Bumbu rahasia khas Purwokerto yang gurih dan lezat, siap dalam 5 menit!

Keunggulan:
- Sudah Dibumbui Lengkap
- Tipis & Crispy
- Resep Khas Purwokerto
- Tinggal Goreng 3 Menit
- Cocok untuk Snack
- Hemat Waktu
- Ekonomis`,
    price: 18000,
    comparePrice: 22000,
    stock: 150,
    weight: 0.4,
    status: "ACTIVE",
    category: "traditional",
    images: ["https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800"],
    featured: true,
  },
  {
    sku: "TTR-003",
    name: "Tempe Benguk Tradisional",
    slug: "tempe-benguk-tradisional",
    description: `Tempe benguk dari kacang benguk khas Jawa Tengah. Tekstur lebih padat dengan rasa yang unik.

Makanan tradisional yang kaya akan nutrisi dan memiliki cita rasa khas yang berbeda dari tempe biasa.

Keunggulan:
- Kacang Benguk Asli
- Tekstur Padat & Unik
- Rasa Khas Tradisional
- High Protein
- Low Glycemic Index
- Cocok untuk Diabetes
- Warisan Kuliner Nusantara`,
    price: 20000,
    comparePrice: null,
    stock: 80,
    weight: 0.5,
    status: "ACTIVE",
    category: "traditional",
    images: ["https://images.unsplash.com/photo-1589621316382-008455b857cd?w=800"],
    featured: false,
  },
  {
    sku: "TTR-004",
    name: "Tempe Gembus Original",
    slug: "tempe-gembus-original",
    description: `Tempe gembus dari ampas tahu yang difermentasi. Makanan tradisional khas Banyumas dengan harga sangat terjangkau.

Pilihan ekonomis dengan nutrisi yang tetap tinggi, cocok untuk konsumsi sehari-hari.

Keunggulan:
- Harga Super Terjangkau
- High Fiber
- Tetap Bergizi
- Tekstur Lembut
- Mudah Diolah
- Ramah di Kantong
- Sustainable Food`,
    price: 8000,
    comparePrice: 10000,
    stock: 300,
    weight: 0.4,
    status: "ACTIVE",
    category: "traditional",
    images: ["https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800"],
    featured: false,
  },

  // ============================================
  // KATEGORI BULK/PAKET HEMAT
  // ============================================
  {
    sku: "TBK-001",
    name: "Paket Hemat Tempe 5kg",
    slug: "paket-hemat-tempe-5kg",
    description: `Paket hemat berisi 10 potong tempe @ 500g. Cocok untuk usaha kuliner atau konsumsi keluarga besar.

Hemat hingga 30% dibanding beli satuan! Fresh from production, langsung dikirim ke Anda.

Keunggulan:
- Hemat 30% dari Harga Normal
- 10 Potong x 500g
- Fresh & Berkualitas
- Cocok untuk Reseller
- Free Ongkir (Jabodetabek)
- Minimal Order 5kg
- Packaging Aman`,
    price: 200000,
    comparePrice: 250000,
    stock: 50,
    weight: 5.0,
    status: "ACTIVE",
    category: "bulk",
    images: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800"],
    featured: true,
  },
  {
    sku: "TBK-002",
    name: "Paket Reseller 10kg",
    slug: "paket-reseller-10kg",
    description: `Paket khusus untuk reseller dan pedagang dengan harga grosir terbaik. Isi 20 potong @ 500g.

Dapatkan harga grosir dengan kualitas premium. Support lengkap untuk reseller!

Keunggulan:
- Harga Grosir Termurah
- 20 Potong x 500g
- Margin Keuntungan Tinggi
- Support Marketing Material
- Priority Shipping
- Konsultasi Bisnis Gratis
- Repeat Order Discount`,
    price: 350000,
    comparePrice: 500000,
    stock: 30,
    weight: 10.0,
    status: "ACTIVE",
    category: "bulk",
    images: ["https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800"],
    featured: true,
  },
  {
    sku: "TBK-003",
    name: "Paket Frozen Tempe 3kg",
    slug: "paket-frozen-tempe-3kg",
    description: `Paket tempe frozen yang tahan hingga 3 bulan di freezer. Praktis untuk stock di rumah.

Pre-cut dan vacuum sealed, tinggal cairkan dan masak. Kualitas tetap terjaga!

Keunggulan:
- Tahan 3 Bulan (Frozen)
- Pre-cut Ready Cook
- Vacuum Sealed
- No Preservatives
- Praktis & Ekonomis
- Kualitas Terjaga
- Stock Aman`,
    price: 120000,
    comparePrice: 150000,
    stock: 100,
    weight: 3.0,
    status: "ACTIVE",
    category: "bulk",
    images: ["https://images.unsplash.com/photo-1589621316382-008455b857cd?w=800"],
    featured: false,
  },
  {
    sku: "TBK-004",
    name: "Paket Mix Variant 2kg",
    slug: "paket-mix-variant-2kg",
    description: `Paket campuran berbagai varian tempe untuk mencoba semua jenis. Isi 4 varian @ 500g.

Coba semua varian favorit kami dalam satu paket dengan harga spesial!

Keunggulan:
- 4 Varian Premium
- Hemat 25%
- Perfect for Tasting
- Gift Ready Packaging
- Mix & Match Options
- Quality Assurance
- Satisfaction Guaranteed`,
    price: 95000,
    comparePrice: 120000,
    stock: 70,
    weight: 2.0,
    status: "ACTIVE",
    category: "bulk",
    images: ["https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800"],
    featured: true,
  },

  // ============================================
  // PRODUK SPESIAL / LIMITED
  // ============================================
  {
    sku: "TSP-001",
    name: "Tempe Cokelat Fusion (Limited)",
    slug: "tempe-cokelat-fusion-limited",
    description: `Inovasi tempe dengan campuran cokelat premium. Cocok untuk dessert atau camilan sehat.

Limited edition product yang menggabungkan protein tinggi dari tempe dengan antioksidan dari dark chocolate.

Keunggulan:
- Limited Edition
- Dark Chocolate 70%
- High Protein Dessert
- Unique Taste
- Healthy Indulgence
- Instagram Worthy
- Premium Gift Option`,
    price: 45000,
    comparePrice: null,
    stock: 30,
    weight: 0.4,
    status: "ACTIVE",
    category: "premium",
    images: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800"],
    featured: true,
  },
  {
    sku: "TSP-002",
    name: "Tempe Chips Variety Pack",
    slug: "tempe-chips-variety-pack",
    description: `Keripik tempe dalam 5 rasa berbeda: Original, Balado, BBQ, Cheese, dan Pedas Manis.

Camilan sehat tinggi protein yang cocok untuk teman ngopi atau snack anak-anak.

Keunggulan:
- 5 Varian Rasa
- Crispy & Crunchy
- High Protein Snack
- No MSG
- Long Shelf Life
- Perfect for Gifts
- Family Size`,
    price: 55000,
    comparePrice: 65000,
    stock: 100,
    weight: 0.5,
    status: "ACTIVE",
    category: "premium",
    images: ["https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800"],
    featured: true,
  },
];

async function seedProducts() {
  console.log("🌱 Starting product seeding...");

  try {
    // Clear existing products (optional - comment out if you want to keep existing data)
    await prisma.product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Create products
    let createdCount = 0;
    for (const productData of productsData) {
      await prisma.product.create({
        data: productData,
      });
      createdCount++;
      console.log(`✅ Created: ${productData.name}`);
    }

    console.log(`\n🎉 Successfully seeded ${createdCount} products!`);

    // Print summary
    const summary = await prisma.product.groupBy({
      by: ["category"],
      _count: {
        id: true,
      },
    });

    console.log("\n📊 Products by category:");
    summary.forEach(({ category, _count }) => {
      console.log(`   ${category}: ${_count.id} products`);
    });
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}

async function main() {
  await seedProducts();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

module.exports = { productsData };
