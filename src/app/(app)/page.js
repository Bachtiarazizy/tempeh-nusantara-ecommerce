"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Star,
  TrendingUp,
  Package,
  Truck,
  Shield,
  Award,
  Globe,
  Users,
  ChevronRight,
  Play,
  Check,
  ArrowRight,
  Sparkles,
  Heart,
  MessageCircle,
  DollarSign,
  Target,
  BarChart3,
  Gift,
  Zap,
  Clock,
  MapPin,
  Quote,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const LandingPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");

  // Hero Stats
  const heroStats = [
    { value: "50K+", label: "Pelanggan Setia", icon: Users },
    { value: "100+", label: "Negara Export", icon: Globe },
    { value: "4.9/5", label: "Rating Produk", icon: Star },
    { value: "99%", label: "Kepuasan", icon: Heart },
  ];

  // Featured Products
  const featuredProducts = [
    {
      id: 1,
      name: "Tempe Premium Export Quality",
      category: "premium",
      price: 45000,
      originalPrice: 60000,
      rating: 4.9,
      reviews: 2847,
      image: "/products/tempe-premium.jpg",
      badge: "Best Seller",
      badgeColor: "bg-yellow-500",
      sold: "5K+ terjual",
      discount: 25,
    },
    {
      id: 2,
      name: "Tempe Organik Certified",
      category: "organic",
      price: 55000,
      originalPrice: 70000,
      rating: 4.8,
      reviews: 1923,
      image: "/products/tempe-organic.jpg",
      badge: "Organic",
      badgeColor: "bg-green-500",
      sold: "3K+ terjual",
      discount: 21,
    },
    {
      id: 3,
      name: "Tempe Tradisional Authentic",
      category: "traditional",
      price: 35000,
      originalPrice: 45000,
      rating: 4.9,
      reviews: 3421,
      image: "/products/tempe-traditional.jpg",
      badge: "Popular",
      badgeColor: "bg-blue-500",
      sold: "8K+ terjual",
      discount: 22,
    },
    {
      id: 4,
      name: "Paket Bulk Order (10kg)",
      category: "bulk",
      price: 400000,
      originalPrice: 550000,
      rating: 5.0,
      reviews: 892,
      image: "/products/tempe-bulk.jpg",
      badge: "Wholesale",
      badgeColor: "bg-purple-500",
      sold: "2K+ terjual",
      discount: 27,
    },
    {
      id: 5,
      name: "Tempe Fresh Daily",
      category: "fresh",
      price: 30000,
      rating: 4.7,
      reviews: 1567,
      image: "/products/tempe-fresh.jpg",
      badge: "New",
      badgeColor: "bg-red-500",
      sold: "1K+ terjual",
    },
    {
      id: 6,
      name: "Tempe Spesial Bumbu",
      category: "special",
      price: 48000,
      originalPrice: 60000,
      rating: 4.8,
      reviews: 2134,
      image: "/products/tempe-special.jpg",
      badge: "Limited",
      badgeColor: "bg-orange-500",
      sold: "4K+ terjual",
      discount: 20,
    },
  ];

  // Categories
  const categories = [
    { id: "all", name: "Semua Produk", icon: Package },
    { id: "premium", name: "Premium", icon: Sparkles },
    { id: "organic", name: "Organik", icon: Award },
    { id: "traditional", name: "Tradisional", icon: Heart },
    { id: "bulk", name: "Bulk Order", icon: Gift },
  ];

  // Features/Benefits
  const features = [
    {
      icon: Shield,
      title: "Kualitas Terjamin",
      description: "Sertifikasi Halal MUI, BPOM, dan ISO 9001:2015",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: Truck,
      title: "Pengiriman Cepat",
      description: "Free ongkir untuk pembelian >100K, 1-3 hari sampai",
      color: "bg-green-500/10 text-green-500",
    },
    {
      icon: Award,
      title: "Export Quality",
      description: "Standar internasional, diekspor ke 100+ negara",
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      icon: DollarSign,
      title: "Harga Terbaik",
      description: "Harga pabrik langsung, diskon hingga 40%",
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Ibu Sarah Wijaya",
      role: "Restoran Owner",
      avatar: "/avatars/avatar1.jpg",
      rating: 5,
      comment: "Kualitas tempe sangat bagus dan konsisten! Pelanggan saya selalu puas. Sudah order berkali-kali dan tidak pernah mengecewakan.",
      location: "Jakarta",
    },
    {
      name: "Bapak Ahmad Reza",
      role: "Distributor",
      avatar: "/avatars/avatar2.jpg",
      rating: 5,
      comment: "Sebagai distributor, saya sangat terbantu dengan sistem bulk order mereka. Harga kompetitif dan kualitas export. Recommended!",
      location: "Surabaya",
    },
    {
      name: "Ms. Jennifer Kim",
      role: "International Buyer",
      avatar: "/avatars/avatar3.jpg",
      rating: 5,
      comment: "Best Indonesian tempeh supplier! Quality is consistent and they handle international shipping very professionally.",
      location: "Singapore",
    },
  ];

  // Affiliate Benefits
  const affiliateBenefits = [
    {
      icon: DollarSign,
      title: "Komisi hingga 25%",
      description: "Dapatkan komisi menarik dari setiap penjualan",
    },
    {
      icon: Target,
      title: "Goal-Based Rewards",
      description: "Bonus tambahan saat capai target bulanan",
    },
    {
      icon: BarChart3,
      title: "Dashboard Real-time",
      description: "Pantau performa dan earnings langsung",
    },
    {
      icon: Award,
      title: "Leaderboard Ranking",
      description: "Kompetisi sehat dengan reward menarik",
    },
  ];

  // Process Steps
  const processSteps = [
    {
      number: "01",
      title: "Pilih Produk",
      description: "Browse katalog lengkap produk premium kami",
    },
    {
      number: "02",
      title: "Tambah ke Keranjang",
      description: "Pilih varian dan jumlah yang diinginkan",
    },
    {
      number: "03",
      title: "Checkout Aman",
      description: "Pembayaran mudah dengan berbagai metode",
    },
    {
      number: "04",
      title: "Terima Pesanan",
      description: "Pengiriman cepat langsung ke alamat Anda",
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredProducts = activeCategory === "all" ? featuredProducts : featuredProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                #1 Produsen Tempe Premium Indonesia
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Tempe Premium
                  <span className="block text-primary">Export Quality</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">Kualitas internasional dengan cita rasa tradisional Indonesia. Dipercaya oleh ribuan pelanggan di 100+ negara.</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="h-12 px-8 text-base group">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Belanja Sekarang
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  <Play className="w-5 h-5 mr-2" />
                  Lihat Video
                </Button>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {heroStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center relative overflow-hidden">
                  <Image src="/images/tempeh-premium.png" alt="Tempe Premium Nusantara" fill className="object-cover" priority />
                </div>

                {/* Floating Cards */}
                <div className="absolute top-8 -left-4 bg-card border shadow-lg rounded-lg p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">2,847 Orders</p>
                      <p className="text-xs text-muted-foreground">Hari ini</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 -right-4 bg-card border shadow-lg rounded-lg p-4 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">4.9/5 Rating</p>
                      <p className="text-xs text-muted-foreground">12,341 reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4">Produk Unggulan</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Tempe Premium Pilihan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Dipilih dengan standar kualitas tertinggi untuk kepuasan Anda</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button key={category.id} variant={activeCategory === category.id ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(category.id)} className="gap-2">
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-24 h-24 text-muted-foreground/20" />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge className={`${product.badgeColor} text-white border-0`}>{product.badge}</Badge>
                      {product.discount && <Badge className="bg-red-500 text-white border-0">-{product.discount}%</Badge>}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-lg">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button className="gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Tambah ke Keranjang
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>

                    {/* Rating & Sold */}
                    <div className="flex items-center gap-3 mb-3 text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviews})</span>
                      </div>
                      <span className="text-muted-foreground">• {product.sold}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                        {product.originalPrice && <p className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>}
                      </div>
                      <Button size="icon" className="h-10 w-10 rounded-full">
                        <ShoppingCart className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Button size="lg" variant="outline" className="gap-2">
              Lihat Semua Produk
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Cara Belanja</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Mudah & Cepat</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Proses pemesanan yang simpel dalam 4 langkah mudah</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 relative">
                    <span className="text-2xl font-bold text-primary">{step.number}</span>
                    {index < processSteps.length - 1 && <ChevronRight className="w-6 h-6 text-primary/30 absolute -right-8 top-5 hidden md:block" />}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimoni</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Kata Pelanggan Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Kepuasan pelanggan adalah prioritas utama kami</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.comment}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <Badge className="bg-white/20 text-white border-0 mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Affiliate Program
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Hasilkan Hingga 25% Komisi!</h2>
              <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">Bergabunglah dengan ribuan affiliate kami dan dapatkan penghasilan pasif. Sistem tracking real-time, payout cepat, dan support penuh dari tim kami.</p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button size="lg" variant="secondary" className="h-12 px-8 gap-2">
                  <Users className="w-5 h-5" />
                  Daftar Sekarang Gratis
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 border-white text-white hover:bg-white/10">
                  Pelajari Lebih Lanjut
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold mb-1">5,000+</p>
                  <p className="text-sm text-primary-foreground/80">Active Affiliates</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">$2M+</p>
                  <p className="text-sm text-primary-foreground/80">Total Earnings</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">25%</p>
                  <p className="text-sm text-primary-foreground/80">Max Commission</p>
                </div>
              </div>
            </div>

            {/* Right Benefits */}
            <div className="grid sm:grid-cols-2 gap-4">
              {affiliateBenefits.map((benefit, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-primary-foreground/80">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card rounded-2xl p-12 shadow-xl border">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Zap className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Dapatkan Penawaran Eksklusif</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Berlangganan newsletter kami dan dapatkan diskon 15% untuk pembelian pertama, plus update produk terbaru dan promo spesial.</p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button size="lg" className="gap-2 whitespace-nowrap">
                Berlangganan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4">
              Dengan berlangganan, Anda menyetujui{" "}
              <a href="/privacy" className="underline hover:text-primary">
                Privacy Policy
              </a>{" "}
              kami
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges Footer */}
      <section className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">SSL Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">ISO 9001:2015</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Export Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Fast Response</span>
            </div>
          </div>
        </div>
      </section>

      {/* CSS for Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
