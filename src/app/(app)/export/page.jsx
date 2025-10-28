"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Globe,
  Plane,
  Award,
  CheckCircle2,
  FileText,
  Shield,
  TrendingUp,
  Users,
  Package,
  Target,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  Ship,
  Building2,
  Mail,
  Phone,
  Star,
  Sparkles,
  ArrowRight,
  Download,
  Factory,
  Leaf,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function ExportInfoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    email: "",
    phone: "",
    message: "",
  });

  const exportCountries = [
    { name: "Singapura", flag: "🇸🇬", status: "Active", volume: "5 ton/bulan" },
    { name: "Malaysia", flag: "🇲🇾", status: "Active", volume: "8 ton/bulan" },
    { name: "Belanda", flag: "🇳🇱", status: "Active", volume: "3 ton/bulan" },
    { name: "Jerman", flag: "🇩🇪", status: "Active", volume: "2 ton/bulan" },
    { name: "Australia", flag: "🇦🇺", status: "Active", volume: "4 ton/bulan" },
    { name: "Jepang", flag: "🇯🇵", status: "Active", volume: "6 ton/bulan" },
    { name: "Korea Selatan", flag: "🇰🇷", status: "Active", volume: "3 ton/bulan" },
    { name: "Amerika Serikat", flag: "🇺🇸", status: "Expanding", volume: "2 ton/bulan" },
  ];

  const certifications = [
    {
      icon: Award,
      name: "Halal Certificate",
      issuer: "MUI - Indonesia",
      description: "Sertifikat halal untuk pasar Muslim global",
      color: "bg-green-50 text-green-600 dark:bg-green-950/30",
    },
    {
      icon: Shield,
      name: "BPOM Certification",
      issuer: "Badan POM RI",
      description: "Keamanan dan kualitas produk terjamin",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30",
    },
    {
      icon: FileText,
      name: "ISO 22000:2018",
      issuer: "International Organization",
      description: "Standar manajemen keamanan pangan",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/30",
    },
    {
      icon: CheckCircle2,
      name: "HACCP",
      issuer: "Global Standard",
      description: "Hazard Analysis Critical Control Point",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30",
    },
    {
      icon: Leaf,
      name: "Organic Certificate",
      issuer: "EU & USDA Standard",
      description: "Produk organik bersertifikat internasional",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
    },
    {
      icon: Star,
      name: "Export License",
      issuer: "Kementerian Perdagangan",
      description: "Izin ekspor resmi pemerintah Indonesia",
      color: "bg-red-50 text-red-600 dark:bg-red-950/30",
    },
  ];

  const exportAdvantages = [
    {
      icon: Package,
      title: "Premium Quality",
      description: "Produk berkualitas export dengan standar internasional",
    },
    {
      icon: Factory,
      title: "Large Capacity",
      description: "Kapasitas produksi hingga 50 ton per bulan",
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "Pengiriman tepat waktu dengan logistik terpercaya",
    },
    {
      icon: DollarSign,
      title: "Competitive Price",
      description: "Harga kompetitif untuk pembelian dalam jumlah besar",
    },
    {
      icon: Shield,
      title: "Full Certification",
      description: "Lengkap dengan sertifikasi internasional",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Tim export yang berpengalaman siap membantu",
    },
  ];

  const exportProcess = [
    {
      step: 1,
      icon: Mail,
      title: "Inquiry & Discussion",
      description: "Hubungi tim export kami untuk diskusi kebutuhan dan spesifikasi produk",
    },
    {
      step: 2,
      icon: FileText,
      title: "Quotation & Samples",
      description: "Kami berikan penawaran harga dan sampel produk untuk evaluasi",
    },
    {
      step: 3,
      icon: CheckCircle2,
      title: "Agreement & Contract",
      description: "Kesepakatan kontrak dan terms of payment yang saling menguntungkan",
    },
    {
      step: 4,
      icon: Factory,
      title: "Production & QC",
      description: "Produksi dengan quality control ketat sesuai standar internasional",
    },
    {
      step: 5,
      icon: Package,
      title: "Packaging & Documentation",
      description: "Pengemasan export grade dan penyiapan dokumen lengkap",
    },
    {
      step: 6,
      icon: Ship,
      title: "Shipping & Delivery",
      description: "Pengiriman via sea/air freight dengan tracking lengkap",
    },
  ];

  const exportProducts = [
    {
      name: "Tempe Premium Export Grade A",
      specs: "Fresh/Frozen | 500g - 1kg packs",
      moq: "Min. Order: 1 Ton",
      shelfLife: "Frozen: 6 bulan",
      badge: "Best Seller",
    },
    {
      name: "Organic Tempeh Certified",
      specs: "100% Organic Soybeans",
      moq: "Min. Order: 500 kg",
      shelfLife: "Frozen: 8 bulan",
      badge: "Organic",
    },
    {
      name: "Flavored Tempeh Variants",
      specs: "Original, Garlic, Spicy, Herbs",
      moq: "Min. Order: 1 Ton",
      shelfLife: "Frozen: 6 bulan",
      badge: "Premium",
    },
    {
      name: "Tempeh Chips & Snacks",
      specs: "Ready-to-eat snacks",
      moq: "Min. Order: 500 kg",
      shelfLife: "Dry: 12 bulan",
      badge: "New",
    },
  ];

  const testimonials = [
    {
      company: "Global Foods Singapore",
      country: "🇸🇬 Singapore",
      text: "Excellent quality and reliable supplier. We've been importing their tempeh for 3 years with zero quality issues.",
      rating: 5,
      person: "David Tan, Procurement Manager",
    },
    {
      company: "Amsterdam Asian Market",
      country: "🇳🇱 Netherlands",
      text: "Their organic tempeh is highly appreciated by our customers. Professional export team and smooth logistics.",
      rating: 5,
      person: "Anna van der Berg, CEO",
    },
    {
      company: "Tokyo Natural Foods",
      country: "🇯🇵 Japan",
      text: "High quality product with complete certifications. Perfect for the Japanese market. Highly recommended!",
      rating: 5,
      person: "Yuki Nakamura, Import Director",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Inquiry berhasil dikirim!", {
        description: "Tim export kami akan menghubungi Anda dalam 1x24 jam.",
      });
      setFormData({
        companyName: "",
        country: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error("Gagal mengirim inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-linear-to-t from-primary/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/80 mb-4">
            <span className="hover:text-primary-foreground cursor-pointer" onClick={() => router.push("/")}>
              Home
            </span>
            <span>/</span>
            <span className="text-primary-foreground font-medium">Export Info</span>
          </div>

          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <Globe className="w-3 h-3 mr-1" />
              International Export
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tempe Berkualitas Export ke Seluruh Dunia</h1>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Kami melayani ekspor tempe premium dengan standar internasional ke lebih dari 15 negara. Lengkap dengan sertifikasi Halal, Organic, dan ISO untuk memenuhi kebutuhan pasar global.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary">
                <Mail className="w-5 h-5 mr-2" />
                Request Quotation
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Download className="w-5 h-5 mr-2" />
                Download Catalog
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-20">
          {[
            { icon: Globe, value: "15+", label: "Export Countries", color: "text-blue-600" },
            { icon: Package, value: "50", label: "Ton/Bulan", color: "text-green-600" },
            { icon: Award, value: "8+", label: "Certifications", color: "text-amber-600" },
            { icon: Users, value: "100+", label: "Global Partners", color: "text-purple-600" },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Export Countries */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <MapPin className="w-3 h-3 mr-1" />
              Global Reach
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Negara Tujuan Export</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Produk tempe kami telah diekspor ke berbagai negara di Asia, Eropa, dan Amerika</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {exportCountries.map((country, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3">{country.flag}</div>
                  <h3 className="font-bold text-foreground mb-2">{country.name}</h3>
                  <Badge variant={country.status === "Active" ? "default" : "secondary"} className="mb-2">
                    {country.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{country.volume}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Award className="w-3 h-3 mr-1" />
              Certifications
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Sertifikasi Internasional</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Produk kami telah memenuhi standar kualitas dan keamanan pangan internasional</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl ${cert.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{cert.name}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{cert.issuer}</p>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Export Advantages */}
        <section>
          <Card className="bg-linear-to-r from-primary/5 to-background">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-4">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Why Choose Us
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">Keunggulan Export Kami</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exportAdvantages.map((advantage, index) => {
                  const IconComponent = advantage.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{advantage.title}</h3>
                        <p className="text-sm text-muted-foreground">{advantage.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Export Process */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Target className="w-3 h-3 mr-1" />
              Export Process
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Proses Export</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">6 langkah mudah untuk memulai kerjasama export dengan kami</p>
          </div>

          <div className="relative">
            {/* Timeline line - desktop only */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />

            <div className="space-y-8">
              {exportProcess.map((process, index) => {
                const IconComponent = process.icon;
                return (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <Badge variant="secondary" className="mb-3">
                            Step {process.step}
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground mb-2">{process.title}</h3>
                          <p className="text-sm text-muted-foreground">{process.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Center icon */}
                    <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-primary border-4 border-background shadow-lg items-center justify-center">
                      <IconComponent className="w-7 h-7 text-primary-foreground" />
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Export Products */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Package className="w-3 h-3 mr-1" />
              Export Products
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Produk Export Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Berbagai varian produk tempe premium untuk kebutuhan pasar internasional</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {exportProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{product.specs}</p>
                    </div>
                    <Badge variant="secondary">{product.badge}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{product.moq}</span>
                      <span className="text-primary font-medium">{product.shelfLife}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Testimoni Partner Global</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Apa kata partner import kami di berbagai negara</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="pt-4 border-t">
                    <p className="font-semibold text-foreground text-sm">{testimonial.person}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">{testimonial.country}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Export Inquiry Form
                </CardTitle>
                <CardDescription>Isi formulir untuk mendapatkan penawaran export</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input id="companyName" name="companyName" placeholder="Your Company Ltd." value={formData.companyName} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">
                      Country <span className="text-destructive">*</span>
                    </Label>
                    <Input id="country" name="country" placeholder="Your Country" value={formData.country} onChange={handleInputChange} required />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input id="email" name="email" type="email" placeholder="contact@company.com" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+1 234 567 890" value={formData.phone} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message / Requirements <span className="text-destructive">*</span>
                    </Label>
                    <Textarea id="message" name="message" placeholder="Please specify product type, quantity, and other requirements..." rows={5} value={formData.message} onChange={handleInputChange} required />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Department Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">PT Tempe Nusantara Export Division</p>
                      <p className="text-sm text-muted-foreground">Jl. Export Plaza No. 123, Bandung</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a href="mailto:export@tempenusantara.com" className="text-sm text-primary hover:underline">
                        export@tempenusantara.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone / WhatsApp</p>
                      <a href="tel:+622212345678" className="text-sm text-primary hover:underline">
                        +62 22 1234 5678
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Working Hours</p>
                      <p className="text-sm text-muted-foreground">Monday - Friday: 08:00 - 17:00 WIB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-linear-to-br from-primary/5 to-background">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Zap className="w-6 h-6 text-amber-500" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Quick Response Guarantee</h4>
                      <p className="text-sm text-muted-foreground">Kami menjamin respon inquiry dalam 24 jam kerja. Tim export kami siap memberikan quotation dan sampel produk.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10" />
            <CardContent className="p-12 relative">
              <div className="max-w-3xl mx-auto text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-3">Siap Untuk Memulai Partnership?</h2>
                <p className="text-lg text-primary-foreground/90 mb-8">Bergabunglah dengan lebih dari 100 partner global kami dan bawa produk tempe premium Indonesia ke pasar Anda</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary">
                    <Mail className="w-5 h-5 mr-2" />
                    Request Quotation
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Download className="w-5 h-5 mr-2" />
                    Download Product Catalog
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={() => window.open("https://wa.me/6281234567890", "_blank")}>
                    <Phone className="w-5 h-5 mr-2" />
                    WhatsApp Export Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Additional Info */}
        <section>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center mb-4">
                  <Ship className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Flexible Shipping</h3>
                <p className="text-sm text-muted-foreground mb-3">Sea freight untuk volume besar atau air freight untuk pengiriman cepat. Kami bekerja dengan forwarder terpercaya.</p>
                <Button variant="link" className="p-0 h-auto">
                  Learn more <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 dark:bg-green-950/30 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Complete Documentation</h3>
                <p className="text-sm text-muted-foreground mb-3">Certificate of Origin, Health Certificate, Halal Certificate, dan dokumen export lainnya kami siapkan lengkap.</p>
                <Button variant="link" className="p-0 h-auto">
                  Learn more <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/30 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Private Label Available</h3>
                <p className="text-sm text-muted-foreground mb-3">Kami menyediakan layanan private label dengan MOQ tertentu. Custom packaging dan branding sesuai kebutuhan Anda.</p>
                <Button variant="link" className="p-0 h-auto">
                  Learn more <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Export */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Export FAQ
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "What is the Minimum Order Quantity (MOQ)?",
                a: "MOQ varies by product type. Generally 500kg - 1 ton for first order. We can discuss flexible terms for regular importers.",
              },
              {
                q: "What are the payment terms?",
                a: "We accept T/T (Telegraphic Transfer), L/C (Letter of Credit), and for regular customers we can discuss payment terms.",
              },
              {
                q: "How long is the lead time?",
                a: "Production time is 7-14 days after order confirmation. Shipping time depends on destination (Sea freight: 14-30 days, Air freight: 3-7 days).",
              },
              {
                q: "Can you provide samples?",
                a: "Yes, we can provide samples. Sample cost and shipping will be charged, which can be refunded when you place a bulk order.",
              },
              {
                q: "What certifications do you have?",
                a: "We have Halal (MUI), Organic (EU/USDA), ISO 22000, HACCP, BPOM, and Export License from Indonesian government.",
              },
              {
                q: "Do you offer private label?",
                a: "Yes, we provide private label service with custom packaging and branding for orders above certain MOQ. Contact us for details.",
              },
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2 flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {faq.q}
                  </h4>
                  <p className="text-sm text-muted-foreground pl-7">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Download Section */}
        <section>
          <Card className="bg-linear-to-br from-amber-50 to-background dark:from-amber-950/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
                    <Download className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Download Export Catalog & Price List</h3>
                    <p className="text-sm text-muted-foreground mb-4">Dapatkan katalog lengkap produk export, spesifikasi detail, dan price list terbaru dalam format PDF</p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Full product specifications
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Updated price list (FOB/CIF)
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Packaging options & certifications
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button size="lg" className="shadow-lg">
                    <Download className="w-5 h-5 mr-2" />
                    Download Now (PDF)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
