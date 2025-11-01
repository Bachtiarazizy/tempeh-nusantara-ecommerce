const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Settings and Marketing Materials seed...");

  // ============================================
  // 1. SYSTEM SETTINGS
  // ============================================
  console.log("\n⚙️  Creating System Settings...");

  const settings = [
    // Site Information
    {
      key: "site_name",
      value: "Tempeh Nusantara",
      type: "STRING",
      description: "Nama website/toko",
    },
    {
      key: "site_tagline",
      value: "Premium Indonesian Tempeh for Global Market",
      type: "STRING",
      description: "Tagline website",
    },
    {
      key: "site_description",
      value: "We export premium quality Indonesian tempeh to worldwide. HACCP certified, organic options available.",
      type: "STRING",
      description: "Deskripsi website untuk SEO",
    },
    {
      key: "site_logo_url",
      value: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=200",
      type: "STRING",
      description: "URL logo website",
    },
    {
      key: "site_email",
      value: "info@tempehexport.com",
      type: "STRING",
      description: "Email kontak utama",
    },
    {
      key: "site_phone",
      value: "+62 812-3456-7890",
      type: "STRING",
      description: "Nomor telepon kontak",
    },
    {
      key: "site_address",
      value: "Jl. Industri Tempe No. 123, Jakarta Selatan, DKI Jakarta 12345, Indonesia",
      type: "STRING",
      description: "Alamat kantor/pabrik",
    },

    // Social Media
    {
      key: "social_instagram",
      value: "https://instagram.com/tempehexport",
      type: "STRING",
      description: "Link Instagram",
    },
    {
      key: "social_facebook",
      value: "https://facebook.com/tempehexport",
      type: "STRING",
      description: "Link Facebook",
    },
    {
      key: "social_twitter",
      value: "https://twitter.com/tempehexport",
      type: "STRING",
      description: "Link Twitter/X",
    },
    {
      key: "social_linkedin",
      value: "https://linkedin.com/company/tempehexport",
      type: "STRING",
      description: "Link LinkedIn",
    },
    {
      key: "social_youtube",
      value: "https://youtube.com/@tempehexport",
      type: "STRING",
      description: "Link YouTube",
    },

    // Commission Settings
    {
      key: "commission_rate_default",
      value: "10",
      type: "NUMBER",
      description: "Default commission rate (%) untuk affiliate baru",
    },
    {
      key: "commission_rate_bronze",
      value: "8",
      type: "NUMBER",
      description: "Commission rate (%) untuk Bronze affiliate",
    },
    {
      key: "commission_rate_silver",
      value: "10",
      type: "NUMBER",
      description: "Commission rate (%) untuk Silver affiliate",
    },
    {
      key: "commission_rate_gold",
      value: "12",
      type: "NUMBER",
      description: "Commission rate (%) untuk Gold affiliate",
    },
    {
      key: "commission_rate_platinum",
      value: "15",
      type: "NUMBER",
      description: "Commission rate (%) untuk Platinum affiliate",
    },
    {
      key: "commission_minimum_payout",
      value: "100000",
      type: "NUMBER",
      description: "Minimum saldo komisi untuk withdraw (Rp)",
    },
    {
      key: "commission_approval_auto",
      value: "false",
      type: "BOOLEAN",
      description: "Auto-approve commission setelah order delivered",
    },
    {
      key: "commission_approval_days",
      value: "7",
      type: "NUMBER",
      description: "Jumlah hari setelah delivery untuk approve commission",
    },

    // Affiliate Settings
    {
      key: "affiliate_approval_auto",
      value: "false",
      type: "BOOLEAN",
      description: "Auto-approve affiliate registration",
    },
    {
      key: "affiliate_monthly_goal_default",
      value: "10",
      type: "NUMBER",
      description: "Default monthly sales goal untuk affiliate baru",
    },
    {
      key: "affiliate_cookie_duration",
      value: "30",
      type: "NUMBER",
      description: "Durasi cookie tracking affiliate (hari)",
    },

    // Shipping Settings
    {
      key: "shipping_free_minimum",
      value: "200000",
      type: "NUMBER",
      description: "Minimum pembelian untuk gratis ongkir (Rp)",
    },
    {
      key: "shipping_weight_unit",
      value: "kg",
      type: "STRING",
      description: "Unit berat untuk shipping (kg/gram)",
    },
    {
      key: "shipping_origin_city",
      value: "Jakarta",
      type: "STRING",
      description: "Kota asal pengiriman",
    },

    // Tax Settings
    {
      key: "tax_enabled",
      value: "true",
      type: "BOOLEAN",
      description: "Enable/disable pajak",
    },
    {
      key: "tax_rate",
      value: "11",
      type: "NUMBER",
      description: "Tax rate PPN (%)",
    },
    {
      key: "tax_included_in_price",
      value: "false",
      type: "BOOLEAN",
      description: "Pajak sudah termasuk dalam harga produk",
    },

    // Payment Gateway - Xendit
    {
      key: "xendit_enabled",
      value: "true",
      type: "BOOLEAN",
      description: "Enable Xendit payment gateway",
    },
    {
      key: "xendit_mode",
      value: "sandbox",
      type: "STRING",
      description: "Xendit mode: sandbox atau production",
    },
    {
      key: "xendit_payment_expiry",
      value: "24",
      type: "NUMBER",
      description: "Durasi expiry payment invoice (jam)",
    },
    {
      key: "xendit_payment_methods",
      value: JSON.stringify(["BANK_TRANSFER", "EWALLET", "CREDIT_CARD", "QRIS", "RETAIL_OUTLET"]),
      type: "JSON",
      description: "Metode pembayaran yang diaktifkan",
    },

    // Email Settings
    {
      key: "email_from_name",
      value: "Tempeh Export Indonesia",
      type: "STRING",
      description: "Nama pengirim email",
    },
    {
      key: "email_from_address",
      value: "noreply@tempehexport.com",
      type: "STRING",
      description: "Email pengirim",
    },
    {
      key: "email_notifications_enabled",
      value: "true",
      type: "BOOLEAN",
      description: "Enable email notifications",
    },

    // Order Settings
    {
      key: "order_number_prefix",
      value: "ORD",
      type: "STRING",
      description: "Prefix untuk order number",
    },
    {
      key: "order_auto_cancel_unpaid",
      value: "true",
      type: "BOOLEAN",
      description: "Auto cancel order yang belum dibayar",
    },
    {
      key: "order_auto_cancel_hours",
      value: "24",
      type: "NUMBER",
      description: "Durasi auto cancel order unpaid (jam)",
    },

    // Stock Settings
    {
      key: "stock_alert_enabled",
      value: "true",
      type: "BOOLEAN",
      description: "Enable notifikasi stock alert",
    },
    {
      key: "stock_alert_threshold",
      value: "10",
      type: "NUMBER",
      description: "Threshold untuk low stock alert",
    },

    // Currency
    {
      key: "currency_code",
      value: "IDR",
      type: "STRING",
      description: "Kode mata uang",
    },
    {
      key: "currency_symbol",
      value: "Rp",
      type: "STRING",
      description: "Symbol mata uang",
    },
    {
      key: "currency_position",
      value: "before",
      type: "STRING",
      description: "Posisi symbol: before atau after",
    },

    // Maintenance
    {
      key: "maintenance_mode",
      value: "false",
      type: "BOOLEAN",
      description: "Enable maintenance mode",
    },
    {
      key: "maintenance_message",
      value: "We are currently performing scheduled maintenance. We'll be back soon!",
      type: "STRING",
      description: "Pesan saat maintenance mode",
    },

    // SEO
    {
      key: "seo_meta_title",
      value: "Tempeh Export Indonesia - Premium Quality Tempeh for Global Market",
      type: "STRING",
      description: "Meta title untuk SEO",
    },
    {
      key: "seo_meta_description",
      value: "Export premium Indonesian tempeh worldwide. HACCP certified, organic options. Best quality tempeh for international market.",
      type: "STRING",
      description: "Meta description untuk SEO",
    },
    {
      key: "seo_meta_keywords",
      value: "tempeh export, indonesian tempeh, organic tempeh, premium tempeh, tempeh wholesale, tempeh international",
      type: "STRING",
      description: "Meta keywords untuk SEO",
    },

    // Analytics
    {
      key: "google_analytics_id",
      value: "GA-XXXXXXXXXX",
      type: "STRING",
      description: "Google Analytics ID",
    },
    {
      key: "facebook_pixel_id",
      value: "FB-XXXXXXXXXX",
      type: "STRING",
      description: "Facebook Pixel ID",
    },
  ];

  let settingsCreated = 0;
  let settingsUpdated = 0;

  for (const setting of settings) {
    const existing = await prisma.setting.findUnique({
      where: { key: setting.key },
    });

    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        type: setting.type,
        description: setting.description,
      },
      create: setting,
    });

    if (existing) {
      settingsUpdated++;
      console.log(`  ✏️  Updated: ${setting.key}`);
    } else {
      settingsCreated++;
      console.log(`  ✅ Created: ${setting.key}`);
    }
  }

  // ============================================
  // 2. MARKETING MATERIALS
  // ============================================
  console.log("\n🎨 Creating Marketing Materials...");

  const marketingMaterials = [
    // BANNERS
    {
      id: "banner_001",
      type: "BANNER",
      status: "ACTIVE",
      title: "Banner Instagram Story - Promo Lebaran",
      slug: "banner-instagram-story-promo-lebaran",
      description: "Banner untuk Instagram Story ukuran 1080x1920px. Tema Lebaran dengan diskon 20%. Sudah include logo dan call-to-action.",
      category: "Instagram Story",
      fileUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=1080&h=1920&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop",
      fileSize: 245000,
      fileFormat: "PNG",
      width: 1080,
      height: 1920,
      tags: ["instagram", "story", "lebaran", "promo"],
      sortOrder: 1,
      publishedAt: new Date(),
    },
    {
      id: "banner_002",
      type: "BANNER",
      status: "ACTIVE",
      title: "Banner Facebook Post - Premium Organic Tempeh",
      slug: "banner-facebook-post-premium-organic",
      description: "Banner untuk Facebook Post 1200x630px. Menampilkan produk tempe organic dengan sertifikasi internasional. Cocok untuk feed Facebook/Instagram.",
      category: "Facebook Post",
      fileUrl: "https://images.unsplash.com/photo-1596097635924-c7e88cb03635?w=1200&h=630&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1596097635924-c7e88cb03635?w=400&h=300&fit=crop",
      fileSize: 198000,
      fileFormat: "JPG",
      width: 1200,
      height: 630,
      tags: ["facebook", "organic", "premium", "certificate"],
      sortOrder: 2,
      publishedAt: new Date(),
    },
    {
      id: "banner_003",
      type: "BANNER",
      status: "ACTIVE",
      title: "Banner WhatsApp Story - Flash Sale",
      slug: "banner-whatsapp-story-flash-sale",
      description: "Banner untuk WhatsApp Status ukuran square 1080x1080px. Flash sale 3 jam dengan countdown timer. Urgent dan eye-catching.",
      category: "WhatsApp Status",
      fileUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=1080&h=1080&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=400&fit=crop",
      fileSize: 312000,
      fileFormat: "PNG",
      width: 1080,
      height: 1080,
      tags: ["whatsapp", "flash-sale", "urgent", "promo"],
      sortOrder: 3,
      publishedAt: new Date(),
    },
    {
      id: "banner_004",
      type: "BANNER",
      status: "ACTIVE",
      title: "Banner Twitter Header - Brand Identity",
      slug: "banner-twitter-header-brand",
      description: "Banner header untuk Twitter/X ukuran 1500x500px. Menampilkan brand identity dan tagline. Profesional dan clean design.",
      category: "Twitter Header",
      fileUrl: "https://images.unsplash.com/photo-1596097635924-c7e88cb03635?w=1500&h=500&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1596097635924-c7e88cb03635?w=400&h=300&fit=crop",
      fileSize: 278000,
      fileFormat: "JPG",
      width: 1500,
      height: 500,
      tags: ["twitter", "header", "brand", "professional"],
      sortOrder: 4,
      publishedAt: new Date(),
    },

    // PRODUCT PHOTOS
    {
      id: "photo_001",
      type: "PRODUCT_PHOTO",
      status: "ACTIVE",
      title: "Product Photo - Tempeh Original Premium 500g",
      slug: "product-photo-tempeh-original-500g",
      description: "High-resolution product photo tempe original premium. Background putih bersih dengan lighting profesional. Sudah di-retouch. Format PNG dengan transparent background.",
      category: "Product Shots",
      fileUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=2000&h=2000&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=400&fit=crop",
      fileSize: 1245000,
      fileFormat: "PNG",
      width: 2000,
      height: 2000,
      tags: ["product", "original", "premium", "white-background"],
      sortOrder: 5,
      publishedAt: new Date(),
    },
    {
      id: "photo_002",
      type: "PRODUCT_PHOTO",
      status: "ACTIVE",
      title: "Product Photo - Organic Tempeh Lifestyle",
      slug: "product-photo-organic-lifestyle",
      description: "Lifestyle photo organic tempeh dengan setting dapur modern. Natural lighting, props organic ingredients. Cocok untuk content Instagram feed.",
      category: "Lifestyle Shots",
      fileUrl: "https://images.unsplash.com/photo-1596097635924-c7e88cb03635?w=2000&h=2000&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1596097635924-c7e88cb03635?w=400&h=400&fit=crop",
      fileSize: 1780000,
      fileFormat: "JPG",
      width: 2000,
      height: 2000,
      tags: ["lifestyle", "organic", "kitchen", "natural"],
      sortOrder: 6,
      publishedAt: new Date(),
    },
    {
      id: "photo_003",
      type: "PRODUCT_PHOTO",
      status: "ACTIVE",
      title: "Product Photo - Black Soybean Tempeh Detail",
      slug: "product-photo-black-soybean-detail",
      description: "Macro shot texture tempe kedelai hitam. Menampilkan detail fermentasi dan kualitas premium. Untuk highlighting unique selling point.",
      category: "Detail Shots",
      fileUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=2000&h=2000&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=400&fit=crop",
      fileSize: 1456000,
      fileFormat: "JPG",
      width: 2000,
      height: 2000,
      tags: ["detail", "macro", "black-soybean", "texture"],
      sortOrder: 7,
      publishedAt: new Date(),
    },

    // COPYWRITING
    {
      id: "copy_001",
      type: "COPYWRITING",
      status: "ACTIVE",
      title: "Copywriting - Instagram Caption Template",
      slug: "copywriting-instagram-caption",
      description: "Template caption untuk Instagram dengan 5 variasi. Include emoji, hashtag, dan call-to-action. Siap copy-paste!",
      category: "Instagram",
      content: `🌱 TEMPLATE CAPTION INSTAGRAM 🌱

TEMPLATE 1 - EDUCATIONAL:
---
Tahukah kamu? Tempe adalah superfood Indonesia yang kini mendunia! 🇮🇩✨

✅ Protein tinggi (19-20%)
✅ Probiotik alami untuk pencernaan
✅ Rendah lemak & kalori
✅ Vegan & vegetarian friendly

Tempe premium kami sudah ekspor ke 15+ negara! Kamu juga bisa jadi bagian dari kesuksesan ini dengan jadi affiliate kami 💪

Kode referal: [KODE_KAMU]
Komisi hingga 15%! 🤑

#TempehIndonesia #SuperfoodIndonesia #HealthyLiving #VeganProtein #TempehExport #MakananSehat #AffiliateBisnis

---

TEMPLATE 2 - PROMO:
---
🔥 FLASH SALE ALERT! 🔥

Diskon 25% untuk semua produk tempe premium!
Hanya 3 jam aja! ⏰

Kualitas ekspor, harga lokal 🎉
Free ongkir min. belanja Rp 200rb

Buruan order sebelum kehabisan!
Link di bio! 👆

Pake kode: [KODE_KAMU]
Dapat komisi tambahan! 💰

#FlashSale #TempehSale #DiskonTempeh #HealthyFood #PromoMakanan

---

TEMPLATE 3 - TESTIMONIAL:
---
"Tempe-nya enak banget! Teksturnya padat, bersih, dan tahan lama. Puas banget!" ⭐⭐⭐⭐⭐

- Bu Sarah, Customer dari Jakarta

Tempe premium kami sudah dipercaya ribuan customer! Kualitas terjamin dengan sertifikasi HACCP & Halal internasional 🏆

Mau order atau jadi reseller? 
DM atau klik link di bio!

Kode affiliate: [KODE_KAMU]

#TempehPremium #TempehBerkualitas #TestimoniCustomer #ProdukIndonesia

---

TEMPLATE 4 - LIFESTYLE:
---
Sunday meal prep dengan tempe? YES! 🙌

Ide menu seminggu:
🍽️ Senin: Tempe Bacem
🍽️ Selasa: Tempe Orek
🍽️ Rabu: Tempe Goreng Tepung
🍽️ Kamis: Salad Tempe
🍽️ Jumat: Burger Tempe
🍽️ Sabtu: Pizza Tempe
🍽️ Minggu: Tempe Penyet

1 pack tempe = 7 resep! Hemat & sehat 💚

Order tempe premium di link bio!
Pake kode: [KODE_KAMU]

#MealPrep #HealthyMealPrep #TempehRecipe #ResepSehat #MasakanRumahan

---

TEMPLATE 5 - CALL TO ACTION:
---
Mau penghasilan tambahan dari rumah? 💰

Jadi AFFILIATE kami!
✨ Komisi hingga 15%
✨ Gratis materi promosi
✨ Training & support penuh
✨ Withdraw kapan saja

Caranya gampang:
1. Daftar di link bio
2. Dapat kode referral
3. Share ke sosmed
4. Terima komisi!

Yuk join ribuan affiliate sukses kami! 🚀

Link pendaftaran di bio! 👆

#AffiliateMarketing #BisnisOnline #PenghasilanTambahan #WorkFromHome #BisnisRumahan`,
      tags: ["instagram", "caption", "template", "social-media"],
      sortOrder: 8,
      publishedAt: new Date(),
    },
    {
      id: "copy_002",
      type: "COPYWRITING",
      status: "ACTIVE",
      title: "Copywriting - Email Marketing Template",
      slug: "copywriting-email-template",
      description: "Template email untuk campaign affiliate. Professional dan persuasive. Include subject line variations.",
      category: "Email",
      content: `📧 EMAIL MARKETING TEMPLATE 📧

SUBJECT LINE OPTIONS:
1. "🌱 Penghasilan Tambahan dari Tempe? Kenapa Tidak!"
2. "Jadi Affiliate Tempe & Raup Komisi Hingga Rp 5 Juta/Bulan"
3. "3 Cara Mudah Dapat Uang dari Promosi Tempe Premium"
4. "Tempe = Penghasilan? Ini Rahasianya! 💰"
5. "Bergabunglah dengan 500+ Affiliate Sukses Kami"

---

EMAIL BODY:
---
Subject: 🌱 Penghasilan Tambahan dari Tempe? Kenapa Tidak!

Halo [NAMA],

Pernahkah terpikir kalau tempe bisa jadi sumber penghasilan tambahan? 🤔

Kami adalah TEMPEH EXPORT INDONESIA, eksportir tempe premium ke 15+ negara. Dan sekarang, kami membuka program AFFILIATE untuk kamu!

🎯 APA ITU PROGRAM AFFILIATE?
Singkatnya: Kamu promosiin produk kami → ada yang beli → kamu dapat komisi!

💰 KEUNTUNGAN JADI AFFILIATE KAMI:
✅ Komisi 10-15% dari setiap penjualan
✅ Free materi promosi (banner, foto, copywriting)
✅ Produk berkualitas ekspor = mudah dijual
✅ Training & support dari tim kami
✅ Withdraw kapan saja, min. Rp 100.000
✅ Cookie tracking 30 hari (komisi tetap masuk!)

📊 POTENSI PENGHASILAN:
- 10 penjualan/bulan @ Rp 85.000 = Komisi Rp 850.000
- 20 penjualan/bulan @ Rp 85.000 = Komisi Rp 1.700.000
- 50 penjualan/bulan @ Rp 85.000 = Komisi Rp 4.250.000

Dan ini hanya dari 1 produk! Kami punya 10+ produk premium 🚀

🎁 BONUS SPECIAL:
Daftar sekarang, dapat:
- Free ebook "Cara Sukses Jadi Affiliate"
- Akses grup Telegram eksklusif
- Materi promosi senilai Rp 500.000

👉 CARA DAFTAR:
1. Klik: [LINK PENDAFTARAN]
2. Isi data diri
3. Tunggu approval (max 1x24 jam)
4. Mulai promosi & raih komisi!

Jangan sampai ketinggalan peluang ini!
Slot terbatas untuk 100 affiliate baru bulan ini.

Salam sukses,
Tim Tempeh Export Indonesia

---

P.S. Masih ragu? Lihat testimoni affiliate kami yang sudah sukses:
[LINK TESTIMONI]

---

[UNSUBSCRIBE LINK]`,
      tags: ["email", "marketing", "affiliate", "campaign"],
      sortOrder: 9,
      publishedAt: new Date(),
    },

    // VIDEO
    {
      id: "video_001",
      type: "VIDEO",
      status: "ACTIVE",
      title: "Video Tutorial - Cara Promosi di Instagram",
      slug: "video-tutorial-promosi-instagram",
      description: "Video tutorial lengkap cara promosi produk tempe di Instagram. Durasi 5 menit. Include tips algoritma, hashtag strategy, dan best posting time.",
      category: "Tutorial",
      fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // placeholder
      thumbnailUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=1280&h=720&fit=crop",
      fileSize: 45000000,
      fileFormat: "MP4",
      width: 1920,
      height: 1080,
      duration: 300, // 5 minutes
      tags: ["tutorial", "instagram", "social-media", "marketing"],
      sortOrder: 10,
      publishedAt: new Date(),
    },
    {
      id: "video_002",
      type: "VIDEO",
      status: "ACTIVE",
      title: "Video - Product Showcase All Variants",
      slug: "video-product-showcase",
      description: "Video showcase semua varian produk tempe. Professional videography dengan background music. Cocok untuk repost di social media.",
      category: "Product Video",
      fileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // placeholder
      thumbnailUrl: "https://images.unsplash.com/photo-1596097635924-c7e88cb03635?w=1280&h=720&fit=crop",
      fileSize: 78000000,
      fileFormat: "MP4",
      width: 1920,
      height: 1080,
      duration: 120, // 2 minutes
      tags: ["product", "showcase", "professional", "promo"],
      sortOrder: 11,
      publishedAt: new Date(),
    },

    // GUIDELINE
    {
      id: "guide_001",
      type: "GUIDELINE",
      status: "ACTIVE",
      title: "Panduan Lengkap Affiliate Marketing",
      slug: "panduan-affiliate-marketing",
      description: "E-book panduan lengkap untuk affiliate. Mulai dari basic sampai advanced strategy. PDF 50 halaman dengan ilustrasi dan case study.",
      category: "Affiliate Guide",
      fileUrl: "https://example.com/affiliate-guide.pdf", // placeholder
      thumbnailUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop",
      fileSize: 3500000,
      fileFormat: "PDF",
      content: `📚 PANDUAN AFFILIATE MARKETING - TEMPEH EXPORT 📚

===== BAB 1: PENGENALAN =====

Apa itu Affiliate Marketing?
Affiliate marketing adalah model bisnis dimana Anda (affiliate) mempromosikan produk orang lain dan mendapat komisi dari setiap penjualan yang terjadi melalui link referral Anda.

Kenapa Pilih Tempeh Export sebagai Produk Affiliate?
✅ Produk berkualitas ekspor - mudah dijual
✅ Niche market yang sedang berkembang (healthy lifestyle)
✅ Komisi kompetitif (10-15%)
✅ Support penuh dari tim
✅ Repeat order tinggi (produk konsumsi)

===== BAB 2: CARA KERJA SISTEM =====

1. Pendaftaran
   - Daftar melalui website
   - Lengkapi data diri & bank account
   - Tunggu approval (max 24 jam)

2. Dapat Kode Referral
   - Setiap affiliate dapat kode unik
   - Contoh: BUDI2024
   - Kode ini track semua penjualan Anda

3. Promosi Produk
   - Gunakan link referral di semua channel
   - Share materi promosi yang disediakan
   - Create konten sendiri (lebih efektif!)

4. Customer Order
   - Customer gunakan kode referral Anda
   - System otomatis track penjualan
   - Cookie tracking 30 hari!

5. Terima Komisi
   - Komisi masuk setelah order delivered
   - Waiting period 7 hari
   - Withdraw min. Rp 100.000
   - Transfer ke rekening 1-3 hari kerja

===== BAB 3: STRATEGI PROMOSI =====

A. SOCIAL MEDIA STRATEGY

1. Instagram
   - Post 2-3x seminggu
   - Gunakan hashtag mix (populer + niche)
   - Instagram Story daily
   - Highlight untuk kategori produk
   - Engage dengan follower (reply comment/DM)

2. Facebook
   - Join grup healthy lifestyle/vegan
   - Share testimonial customer
   - Facebook Ads (budget min. 50rb/hari)
   - Create Facebook Page untuk branding

3. TikTok
   - Short video 15-30 detik
   - Trend challenges
   - Behind the scenes content
   - Recipe videos

4. WhatsApp
   - Broadcast list (max 256 contact)
   - Status updates
   - Grup komunitas (max 1024 member)
   - Personal approach

B. CONTENT STRATEGY

1. Edukasi
   - Manfaat tempe untuk kesehatan
   - Kandungan nutrisi
   - Perbandingan dengan protein lain

2. Inspirasi Resep
   - Easy recipes
   - Meal prep ideas
   - Fusion recipes (tempe burger, pizza, dll)

3. Lifestyle Content
   - Your daily routine with tempeh
   - Workout + healthy eating
   - Family meals

4. Social Proof
   - Customer testimonials
   - Before/after health journey
   - Success stories

5. Behind The Scenes
   - Production process
   - Quality control
   - Packing & shipping

C. COPYWRITING FORMULA

AIDA Formula:
- Attention: Hook yang menarik
- Interest: Cerita atau fakta menarik
- Desire: Benefit produk
- Action: Clear CTA dengan kode referral

Contoh:
"Bosan cari protein murah tapi sehat? [ATTENTION]
Tempe adalah jawabnya! 19% protein dengan harga terjangkau. [INTEREST]
Kualitas ekspor, halal & HACCP certified. Tahan 6 bulan di freezer! [DESIRE]
Order sekarang dengan kode BUDI2024 dapat diskon 10%! [ACTION]"

===== BAB 4: TOOLS & RESOURCES =====

Free Tools:
✅ Canva - Design banner/poster
✅ CapCut - Video editing
✅ Linktree - Bio link organizer
✅ Google Analytics - Track performance
✅ Buffer - Schedule posts

Resources dari Kami:
✅ Banner siap pakai (10+ designs)
✅ Product photos high-res
✅ Copywriting templates
✅ Video tutorials
✅ Email templates

===== BAB 5: TIPS & TRICKS =====

1. Build Trust
   - Authentic content (pakai produk sendiri!)
   - Transparent tentang affiliate
   - Respond quickly to inquiries

2. Niche Down
   - Target audience spesifik
   - Contoh: vegan moms, fitness enthusiast, organic food lovers

3. Consistency
   - Post regularly
   - Test different content types
   - Track what works

4. Leverage Testimonials
   - Minta customer untuk review
   - Share success stories
   - Before/after transformations

5. Create Urgency
   - Limited time offers
   - Flash sales
   - Stock limitations

6. Email List
   - Build your own list
   - Newsletter mingguan
   - Exclusive offers untuk subscriber

===== BAB 6: MENGHITUNG ROI =====

Contoh Perhitungan:

Investasi:
- Facebook Ads: Rp 500.000/bulan
- Content creation tools: Rp 200.000/bulan
- Total: Rp 700.000/bulan

Target:
- 30 penjualan/bulan @ Rp 85.000
- Total sales: Rp 2.550.000
- Komisi 10%: Rp 255.000

Break even: 3 bulan
Profit mulai bulan ke-4!

===== BAB 7: COMMON MISTAKES =====

❌ Terlalu hard selling
✅ Berikan value dulu, jualan kemudian

❌ Tidak konsisten posting
✅ Buat content calendar & stick to it

❌ Copy-paste caption orang lain
✅ Create original content dengan personality Anda

❌ Ignore customer questions
✅ Response time cepat = conversion rate tinggi

❌ Tidak track performance
✅ Monitor metrics dan optimize

===== BAB 8: SUCCESS STORIES =====

Case Study 1: Budi - Instagram Influencer
- Follower: 5,000
- Posting frequency: 3x/week
- Hasil: 25 penjualan/bulan
- Komisi: Rp 2.125.000/bulan

Case Study 2: Siti - Facebook Group Admin
- Group members: 10,000
- Strategy: Educational content + soft selling
- Hasil: 40 penjualan/bulan
- Komisi: Rp 3.400.000/bulan

Case Study 3: Ahmad - TikTok Creator
- Follower: 15,000
- Video style: Recipe & lifestyle
- Hasil: 60 penjualan/bulan
- Komisi: Rp 5.100.000/bulan

===== BAB 9: FAQ =====

Q: Berapa lama approval affiliate?
A: Maximum 24 jam, biasanya lebih cepat.

Q: Minimum withdraw berapa?
A: Rp 100.000

Q: Berapa lama dapat komisi setelah penjualan?
A: 7 hari setelah order delivered (untuk memastikan tidak ada return).

Q: Bisa promosi di marketplace?
A: Tidak. Kami fokus di direct sales melalui website.

Q: Kalau customer komplain ke saya?
A: Forward ke customer service kami, kami yang handle.

===== BAB 10: NEXT STEPS =====

Checklist Memulai:
□ Daftar & approval affiliate
□ Download semua materi promosi
□ Setup sosial media profile
□ Buat content calendar 1 bulan
□ Create first 5 posts
□ Order sample produk (untuk foto authentic)
□ Join grup Telegram affiliate
□ Set target penjualan bulanan
□ Track & evaluate setiap minggu
□ Scale up yang berhasil!

Kontak Support:
📧 Email: affiliate@tempehexport.com
💬 Telegram: @tempehexport_support
📱 WhatsApp: +62 812-3456-7890

Selamat berjuang! 🚀

---
© 2024 Tempeh Export Indonesia`,
      tags: ["guide", "tutorial", "affiliate", "ebook"],
      sortOrder: 12,
      publishedAt: new Date(),
    },
    {
      id: "guide_002",
      type: "GUIDELINE",
      status: "ACTIVE",
      title: "Brand Guidelines - Logo & Color Usage",
      slug: "brand-guidelines",
      description: "Panduan penggunaan logo, warna, typography untuk menjaga konsistensi brand. Must-read untuk semua affiliate.",
      category: "Brand Identity",
      content: `🎨 BRAND GUIDELINES - TEMPEH EXPORT INDONESIA 🎨

===== 1. LOGO USAGE =====

Primary Logo:
- Full color logo untuk background putih/terang
- Minimum size: 100px width
- Clear space: 20px dari semua sisi

Logo Variations:
✅ Full color (untuk background terang)
✅ White version (untuk background gelap)
✅ Black version (untuk print monochrome)
❌ Jangan ubah proporsi
❌ Jangan ubah warna
❌ Jangan tambahkan efek (shadow, gradient, dll)

Logo Placement:
- Top left untuk banner/poster
- Center untuk product packaging mockup
- Watermark: bottom right dengan opacity 50%

===== 2. COLOR PALETTE =====

Primary Colors:
🟢 Forest Green: #2D5016
   (Nature, organic, healthy)
   
🟤 Earthy Brown: #8B4513
   (Traditional, authentic, natural)

Secondary Colors:
⚪ Pure White: #FFFFFF
   (Clean, premium, modern)
   
⚫ Deep Black: #1A1A1A
   (Professional, elegant)

Accent Colors:
🟡 Golden Yellow: #F4C430
   (Premium, export quality)
   
🔴 Alert Red: #DC143C
   (Promo, urgent, flash sale)

Usage Rules:
- Primary color untuk headline & CTA button
- Secondary untuk body text & background
- Accent sparingly untuk highlights

===== 3. TYPOGRAPHY =====

Heading Font:
- Font: Poppins Bold
- Size: 24-48px
- Color: Forest Green atau Deep Black
- Line height: 1.2

Body Font:
- Font: Inter Regular
- Size: 14-16px
- Color: Deep Black atau Dark Gray (#333333)
- Line height: 1.6

CTA Button:
- Font: Poppins SemiBold
- Size: 16-18px
- Color: White
- Background: Forest Green
- Border radius: 8px
- Padding: 12px 24px

===== 4. IMAGERY STYLE =====

Photo Style:
✅ Natural lighting
✅ Clean background (white/wood texture)
✅ Focus on product quality
✅ Show texture detail
✅ Lifestyle shots dengan natural setting

❌ Avoid:
- Over-edited/filter berlebihan
- Cluttered background
- Bad lighting
- Blurry images

===== 5. TONE OF VOICE =====

Brand Personality:
- Friendly tapi professional
- Educating not selling
- Confident dalam quality
- Approachable & supportive

Do's:
✅ "Tempe premium kualitas ekspor"
✅ "Dipercaya 1000+ customer"
✅ "HACCP & Halal certified"
✅ "100% natural ingredients"

Don'ts:
❌ "Tempe paling enak sedunia"
❌ "Dijamin sembuh dari penyakit"
❌ "Lebih bagus dari kompetitor X"
❌ Over-promising claims

===== 6. SOCIAL MEDIA TEMPLATES =====

Instagram Post:
- Size: 1080x1080px
- Safe area: 920x920px (untuk teks)
- Logo: Top left, 150px width
- CTA: Bottom dengan kode referral

Instagram Story:
- Size: 1080x1920px  
- Safe area: Top 250px & bottom 250px (untuk UI)
- Swipe up zone: Bottom 300px

Facebook Post:
- Size: 1200x630px
- Text overlay: Max 20% dari total area
- Logo: Bottom right corner

WhatsApp Status:
- Size: 1080x1080px (square) atau 1080x1920px (story)
- Large text untuk readability
- High contrast colors

===== 7. HASHTAG STRATEGY =====

Brand Hashtags (Always use):
#TempehExportIndonesia
#TempehPremium
#[KODE_REFERRAL_ANDA]

Category Hashtags (Pick 5-10):
#TempehSehat #ProteinNabati #VeganIndonesia
#MakananOrganik #HealthyLifestyle #DietSehat
#TempehEnak #ResepTempe #MenuSehat

Location Hashtags (If applicable):
#JakartaHealthy #BandungVegan #SurabayaFood

Size Strategy:
- 3-5 large hashtags (1M+ posts)
- 5-8 medium hashtags (100K-1M posts)  
- 5-10 small hashtags (<100K posts)

===== 8. CONTENT PILLARS =====

40% Education
- Health benefits
- Nutrition facts
- How it's made
- Quality standards

30% Product
- Product features
- New launches
- Variants showcase
- Behind the scenes

20% Lifestyle
- Recipes
- Meal ideas
- Customer stories
- Usage inspiration

10% Promotion
- Discounts
- Flash sales
- Affiliate rewards
- Limited offers

===== 9. DO'S AND DON'TS =====

✅ DO:
- Use high-quality images
- Credit photographer/designer
- Follow brand colors
- Include kode referral
- Add clear CTA
- Reply to comments
- Share user-generated content

❌ DON'T:
- Use competitor's images
- Over-filter photos
- Claim unverified benefits
- Spam hashtags
- Ignore negative comments
- Post inconsistently
- Copy content without credit

===== 10. APPROVAL PROCESS =====

Need Approval:
- Official campaign materials
- Collaboration with brands
- Press release content
- Media interview quotes

No Approval Needed:
- Personal social media posts
- Using provided templates
- Original content creation
- Customer testimonials sharing

Contact for Approval:
📧 marketing@tempehexport.com
Response time: 1-2 hari kerja

---
Last updated: November 2024
© Tempeh Export Indonesia`,
      tags: ["brand", "guidelines", "design", "identity"],
      sortOrder: 13,
      publishedAt: new Date(),
    },
  ];

  let materialsCreated = 0;
  let materialsUpdated = 0;

  for (const material of marketingMaterials) {
    const existing = await prisma.marketingMaterial.findUnique({
      where: { id: material.id },
    });

    await prisma.marketingMaterial.upsert({
      where: { id: material.id },
      update: {
        type: material.type,
        status: material.status,
        title: material.title,
        slug: material.slug,
        description: material.description,
        category: material.category,
        fileUrl: material.fileUrl,
        thumbnailUrl: material.thumbnailUrl,
        fileSize: material.fileSize,
        fileFormat: material.fileFormat,
        width: material.width,
        height: material.height,
        duration: material.duration,
        content: material.content,
        tags: material.tags,
        sortOrder: material.sortOrder,
        publishedAt: material.publishedAt,
      },
      create: material,
    });

    if (existing) {
      materialsUpdated++;
      console.log(`  ✏️  Updated: ${material.title}`);
    } else {
      materialsCreated++;
      console.log(`  ✅ Created: ${material.title}`);
    }
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n" + "=".repeat(60));
  console.log("✅ SETTINGS & MARKETING MATERIALS SEEDED SUCCESSFULLY!");
  console.log("=".repeat(60));

  console.log("\n📊 SUMMARY:");
  console.log("\n⚙️  SETTINGS:");
  console.log(`   - Created: ${settingsCreated}`);
  console.log(`   - Updated: ${settingsUpdated}`);
  console.log(`   - Total: ${settings.length} settings`);

  console.log("\n🎨 MARKETING MATERIALS:");
  console.log(`   - Created: ${materialsCreated}`);
  console.log(`   - Updated: ${materialsUpdated}`);
  console.log(`   - Total: ${marketingMaterials.length} materials`);

  console.log("\n📁 MATERIALS BY TYPE:");
  const materialsByType = {
    BANNER: marketingMaterials.filter((m) => m.type === "BANNER").length,
    PRODUCT_PHOTO: marketingMaterials.filter((m) => m.type === "PRODUCT_PHOTO").length,
    COPYWRITING: marketingMaterials.filter((m) => m.type === "COPYWRITING").length,
    VIDEO: marketingMaterials.filter((m) => m.type === "VIDEO").length,
    GUIDELINE: marketingMaterials.filter((m) => m.type === "GUIDELINE").length,
  };

  console.log(`   📸 Banners: ${materialsByType.BANNER}`);
  console.log(`   📷 Product Photos: ${materialsByType.PRODUCT_PHOTO}`);
  console.log(`   ✍️  Copywriting: ${materialsByType.COPYWRITING}`);
  console.log(`   🎬 Videos: ${materialsByType.VIDEO}`);
  console.log(`   📚 Guidelines: ${materialsByType.GUIDELINE}`);

  console.log("\n💡 KEY SETTINGS CONFIGURED:");
  console.log("   ✅ Commission rates (8-15%)");
  console.log("   ✅ Payment gateway (Xendit)");
  console.log("   ✅ Shipping settings");
  console.log("   ✅ Tax configuration (11% PPN)");
  console.log("   ✅ Email & notification settings");
  console.log("   ✅ Social media links");
  console.log("   ✅ SEO meta tags");

  console.log("\n🎁 AFFILIATE RESOURCES READY:");
  console.log("   ✅ 4 Social media banners");
  console.log("   ✅ 3 Product photos");
  console.log("   ✅ 2 Copywriting templates");
  console.log("   ✅ 2 Video tutorials");
  console.log("   ✅ 2 Complete guidelines");

  console.log("\n" + "=".repeat(60));
  console.log("🚀 YOUR AFFILIATE PROGRAM IS READY TO LAUNCH!");
  console.log("=".repeat(60));
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
