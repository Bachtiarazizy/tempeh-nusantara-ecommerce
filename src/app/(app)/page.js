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
import HeroSection from "@/components/home-page/hero-section";
import TestimonialSection from "@/components/home-page/testimonial-section";
import ProductSection from "@/components/home-page/product-section";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

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
      <ProductSection />

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
      <TestimonialSection />

      {/* Affiliate CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
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
    </div>
  );
};

export default LandingPage;
