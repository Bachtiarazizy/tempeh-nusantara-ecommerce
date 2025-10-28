"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Search,
  UserPlus,
  CreditCard,
  Truck,
  Package,
  CheckCircle2,
  ArrowRight,
  MousePointerClick,
  Smartphone,
  Laptop,
  MessageCircle,
  Phone,
  Mail,
  AlertCircle,
  Sparkles,
  Clock,
  Shield,
  Heart,
  Star,
  FileText,
  MapPin,
  Banknote,
  Wallet,
  QrCode,
  Building2,
  HelpCircle,
  PlayCircle,
} from "lucide-react";

export default function HowToOrderPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const orderSteps = [
    {
      number: 1,
      icon: Search,
      title: "Cari Produk",
      description: "Browse katalog produk tempe kami",
      details: ["Gunakan fitur pencarian atau filter kategori", "Lihat detail produk, harga, dan spesifikasi", "Baca review dan rating dari pembeli lain", "Bandingkan produk untuk pilihan terbaik"],
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30",
    },
    {
      number: 2,
      icon: ShoppingCart,
      title: "Masukkan Keranjang",
      description: "Tambahkan produk ke shopping cart",
      details: ["Pilih jumlah produk yang diinginkan", "Klik tombol 'Tambah ke Keranjang'", "Produk tersimpan di keranjang belanja", "Lanjutkan belanja atau checkout"],
      color: "bg-green-50 text-green-600 dark:bg-green-950/30",
    },
    {
      number: 3,
      icon: UserPlus,
      title: "Login / Daftar",
      description: "Masuk atau buat akun baru",
      details: ["Login dengan akun yang sudah ada", "Atau daftar akun baru (gratis)", "Isi data diri dan alamat pengiriman", "Verifikasi email untuk keamanan"],
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/30",
    },
    {
      number: 4,
      icon: FileText,
      title: "Isi Data Pengiriman",
      description: "Lengkapi informasi alamat",
      details: ["Masukkan alamat lengkap pengiriman", "Pilih ekspedisi yang tersedia", "Cek estimasi ongkir dan waktu kirim", "Tambahkan catatan jika diperlukan"],
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30",
    },
    {
      number: 5,
      icon: CreditCard,
      title: "Pilih Pembayaran",
      description: "Tentukan metode pembayaran",
      details: ["Pilih metode: Transfer Bank, E-wallet, atau COD", "Review total belanja dan ongkir", "Aplikasikan voucher atau promo (jika ada)", "Konfirmasi pesanan Anda"],
      color: "bg-red-50 text-red-600 dark:bg-red-950/30",
    },
    {
      number: 6,
      icon: CheckCircle2,
      title: "Selesai",
      description: "Tunggu konfirmasi pesanan",
      details: ["Terima email konfirmasi pesanan", "Lakukan pembayaran sesuai metode", "Upload bukti pembayaran (jika transfer)", "Lacak status pesanan di dashboard"],
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
    },
  ];

  const paymentMethods = [
    {
      category: "Transfer Bank",
      icon: Building2,
      methods: [
        { name: "BCA", account: "1234567890", holder: "PT Tempe Nusantara" },
        { name: "Mandiri", account: "1234567890", holder: "PT Tempe Nusantara" },
        { name: "BNI", account: "1234567890", holder: "PT Tempe Nusantara" },
        { name: "BRI", account: "1234567890", holder: "PT Tempe Nusantara" },
      ],
    },
    {
      category: "E-Wallet",
      icon: Wallet,
      methods: [
        { name: "GoPay", info: "Scan QR Code" },
        { name: "OVO", info: "Scan QR Code" },
        { name: "Dana", info: "Scan QR Code" },
        { name: "ShopeePay", info: "Scan QR Code" },
      ],
    },
    {
      category: "Lainnya",
      icon: Banknote,
      methods: [
        { name: "COD (Cash on Delivery)", info: "Bayar saat terima" },
        { name: "Kartu Kredit/Debit", info: "Via payment gateway" },
        { name: "Alfamart/Indomaret", info: "Bayar di toko" },
      ],
    },
  ];

  const shippingOptions = [
    {
      name: "JNE",
      services: ["REG (2-3 hari)", "YES (1 hari)", "OKE (3-5 hari)"],
      icon: Truck,
    },
    {
      name: "J&T Express",
      services: ["REG (2-3 hari)", "Express (1 hari)"],
      icon: Package,
    },
    {
      name: "SiCepat",
      services: ["REG (2-3 hari)", "HALU (1 hari)"],
      icon: Truck,
    },
    {
      name: "Pos Indonesia",
      services: ["Paket Kilat (2-3 hari)", "Express (1 hari)"],
      icon: Package,
    },
  ];

  const faqs = [
    {
      question: "Apakah saya harus membuat akun untuk berbelanja?",
      answer: "Ya, Anda perlu membuat akun untuk melakukan pemesanan. Proses pendaftaran sangat mudah dan gratis.",
    },
    {
      question: "Berapa minimum pembelian?",
      answer: "Tidak ada minimum pembelian. Anda bisa membeli produk mulai dari 1 unit.",
    },
    {
      question: "Bagaimana cara menggunakan voucher?",
      answer: "Masukkan kode voucher di halaman checkout sebelum melakukan pembayaran. Diskon akan otomatis teraplikasi.",
    },
    {
      question: "Apakah bisa ubah pesanan setelah checkout?",
      answer: "Pesanan dapat diubah selama belum diproses oleh tim kami. Hubungi customer service segera untuk perubahan.",
    },
    {
      question: "Bagaimana cara lacak pesanan saya?",
      answer: "Anda bisa melacak pesanan melalui dashboard akun Anda atau menggunakan nomor resi yang dikirim via email.",
    },
    {
      question: "Apa yang harus dilakukan jika pembayaran gagal?",
      answer: "Silakan coba lagi atau gunakan metode pembayaran lain. Jika masih bermasalah, hubungi customer service kami.",
    },
  ];

  const orderingChannels = [
    {
      icon: Laptop,
      title: "Website",
      description: "Pesan melalui website desktop dengan tampilan lengkap",
      link: "/products",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30",
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Download aplikasi untuk kemudahan belanja di smartphone",
      link: "#",
      color: "bg-green-50 text-green-600 dark:bg-green-950/30",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat langsung dengan admin untuk pemesanan manual",
      link: "https://wa.me/6281234567890",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
    },
    {
      icon: Phone,
      title: "Telepon",
      description: "Hubungi customer service untuk bantuan pemesanan",
      link: "tel:+622212345678",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/30",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Pembayaran Aman",
      description: "Transaksi dilindungi dengan enkripsi SSL",
    },
    {
      icon: Truck,
      title: "Pengiriman Cepat",
      description: "Berbagai pilihan ekspedisi terpercaya",
    },
    {
      icon: Clock,
      title: "Customer Service 24/7",
      description: "Siap membantu Anda kapan saja",
    },
    {
      icon: Heart,
      title: "Gratis Ongkir",
      description: "Promo gratis ongkir untuk pembelian tertentu",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-linear-to-t from-primary/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/80 mb-4">
            <span className="hover:text-primary-foreground cursor-pointer" onClick={() => router.push("/")}>
              Home
            </span>
            <span>/</span>
            <span className="text-primary-foreground font-medium">Cara Pemesanan</span>
          </div>

          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <HelpCircle className="w-3 h-3 mr-1" />
              Panduan
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cara Memesan Produk Tempe</h1>
            <p className="text-lg text-primary-foreground/90 mb-6">Ikuti langkah mudah berikut untuk melakukan pemesanan. Proses cepat, aman, dan terpercaya!</p>
            <Button size="lg" variant="secondary" onClick={() => router.push("/products")}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Mulai Belanja Sekarang
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Video Tutorial */}
        <section>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <PlayCircle className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground font-medium">Video Tutorial</p>
                    <p className="text-sm text-muted-foreground">Coming Soon</p>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit mb-3">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Panduan Visual
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Tonton Tutorial Video</h3>
                  <p className="text-muted-foreground mb-6">Pelajari cara memesan dengan mudah melalui video panduan lengkap kami. Ikuti langkah demi langkah untuk pengalaman belanja yang optimal.</p>
                  <div className="flex gap-3">
                    <Button variant="outline">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Tonton Video
                    </Button>
                    <Button variant="ghost">
                      <FileText className="w-4 h-4 mr-2" />
                      Download Panduan PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Order Steps */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <CheckCircle2 className="w-3 h-3 mr-1" />6 Langkah Mudah
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Cara Memesan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Ikuti 6 langkah sederhana ini untuk menyelesaikan pemesanan Anda</p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block mb-12">
            <div className="flex justify-between items-center mb-8">
              {orderSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center cursor-pointer transition-all ${activeStep === index ? "scale-110" : "opacity-60 hover:opacity-100"}`} onClick={() => setActiveStep(index)}>
                      <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mb-2 shadow-lg`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm text-foreground">{step.title}</p>
                        <p className="text-xs text-muted-foreground">Langkah {step.number}</p>
                      </div>
                    </div>
                    {index < orderSteps.length - 1 && (
                      <div className="flex-1 h-1 bg-border mx-4">
                        <div className={`h-full bg-primary transition-all ${index < activeStep ? "w-full" : "w-0"}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 rounded-2xl ${orderSteps[activeStep].color} flex items-center justify-center shrink-0`}>{React.createElement(orderSteps[activeStep].icon, { className: "w-10 h-10" })}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary">Langkah {orderSteps[activeStep].number}</Badge>
                      <h3 className="text-2xl font-bold text-foreground">{orderSteps[activeStep].title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{orderSteps[activeStep].description}</p>
                    <ul className="space-y-2">
                      {orderSteps[activeStep].details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex justify-between mt-6 pt-6 border-t">
                  <Button variant="outline" disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)}>
                    Sebelumnya
                  </Button>
                  <Button disabled={activeStep === orderSteps.length - 1} onClick={() => setActiveStep(activeStep + 1)}>
                    Selanjutnya
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="grid md:grid-cols-2 lg:hidden gap-4">
            {orderSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center shrink-0`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">
                          Langkah {step.number}
                        </Badge>
                        <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Payment & Shipping */}
        <section>
          <Tabs defaultValue="payment" className="space-y-6">
            <div className="text-center">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="payment">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Metode Pembayaran
                </TabsTrigger>
                <TabsTrigger value="shipping">
                  <Truck className="w-4 h-4 mr-2" />
                  Opsi Pengiriman
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="payment" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Metode Pembayaran</h3>
                <p className="text-muted-foreground">Pilih metode pembayaran yang paling nyaman untuk Anda</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {paymentMethods.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-primary" />
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {category.methods.map((method, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                            <p className="font-medium text-sm text-foreground">{method.name}</p>
                            {method.account && (
                              <>
                                <p className="text-xs text-muted-foreground">{method.account}</p>
                                <p className="text-xs text-muted-foreground">{method.holder}</p>
                              </>
                            )}
                            {method.info && <p className="text-xs text-muted-foreground">{method.info}</p>}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Opsi Pengiriman</h3>
                <p className="text-muted-foreground">Berbagai pilihan ekspedisi untuk kemudahan Anda</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {shippingOptions.map((shipping, index) => {
                  const IconComponent = shipping.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-all">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-bold text-foreground mb-3">{shipping.name}</h4>
                        <div className="space-y-1">
                          {shipping.services.map((service, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {service}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Ordering Channels */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <MousePointerClick className="w-3 h-3 mr-1" />
              Multi-Channel
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Pesan Dari Mana Saja</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Pilih channel yang paling nyaman untuk Anda</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orderingChannels.map((channel, index) => {
              const IconComponent = channel.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer" onClick={() => (channel.link.startsWith("http") ? window.open(channel.link, "_blank") : router.push(channel.link))}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${channel.color} flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{channel.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Pesan Sekarang
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section>
          <Card className="bg-linear-to-r from-primary/5 to-background">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-4">
                  <Star className="w-3 h-3 mr-1" />
                  Keuntungan Belanja
                </Badge>
                <h2 className="text-2xl font-bold text-foreground mb-2">Mengapa Belanja di Tempe Nusantara?</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="w-7 h-7 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="w-3 h-3 mr-1" />
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Pertanyaan Umum</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Jawaban untuk pertanyaan yang sering ditanyakan</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">{faq.question}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-11">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => router.push("/faq")}>
              Lihat Semua FAQ
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10" />
            <CardContent className="p-12 relative">
              <div className="max-w-3xl mx-auto text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-3">Siap Untuk Mulai Belanja?</h2>
                <p className="text-lg text-primary-foreground/90 mb-8">Jelajahi koleksi tempe berkualitas premium kami dan nikmati kemudahan berbelanja online</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" onClick={() => router.push("/products")}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Mulai Belanja
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={() => router.push("/contact")}>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Butuh Bantuan?
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tips Section */}
        <section>
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3">Tips Penting Sebelum Memesan</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Pastikan alamat pengiriman yang Anda masukkan lengkap dan benar untuk menghindari keterlambatan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Periksa kembali produk dan jumlah pesanan sebelum melakukan checkout</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Simpan bukti pembayaran Anda hingga pesanan diterima dengan baik</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Hubungi customer service jika ada pertanyaan atau kendala selama proses pemesanan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Gunakan voucher atau promo yang tersedia untuk mendapatkan harga terbaik</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
