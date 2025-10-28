"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Building2, Facebook, Instagram, Twitter, Linkedin, Youtube, CheckCircle2, Sparkles, HeadphonesIcon, Globe, ShoppingBag, Users, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Telepon",
      details: ["+62 22 1234 5678", "+62 812 3456 7890 (WhatsApp)"],
      action: "tel:+622212345678",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@tempenusantara.com", "support@tempenusantara.com"],
      action: "mailto:info@tempenusantara.com",
      color: "bg-red-50 text-red-600 dark:bg-red-950/30",
    },
    {
      icon: MapPin,
      title: "Alamat",
      details: ["Jl. Tempe Raya No. 123", "Bandung, Jawa Barat 40123"],
      action: "https://maps.google.com",
      color: "bg-green-50 text-green-600 dark:bg-green-950/30",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      details: ["Senin - Jumat: 08.00 - 17.00", "Sabtu: 08.00 - 14.00"],
      action: null,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/30",
    },
  ];

  const departments = [
    {
      icon: ShoppingBag,
      title: "Penjualan & Pemesanan",
      description: "Informasi produk, harga, dan pemesanan",
      contact: "sales@tempenusantara.com",
    },
    {
      icon: HeadphonesIcon,
      title: "Customer Service",
      description: "Bantuan umum dan pertanyaan",
      contact: "support@tempenusantara.com",
    },
    {
      icon: Users,
      title: "Partnership & B2B",
      description: "Kerjasama bisnis dan bulk order",
      contact: "partnership@tempenusantara.com",
    },
    {
      icon: HelpCircle,
      title: "Keluhan & Saran",
      description: "Feedback dan komplain produk",
      contact: "feedback@tempenusantara.com",
    },
  ];

  const socialMedia = [
    { icon: Facebook, name: "Facebook", handle: "@tempenusantara", url: "#", color: "hover:text-blue-600" },
    { icon: Instagram, name: "Instagram", handle: "@tempenusantara", url: "#", color: "hover:text-pink-600" },
    { icon: Twitter, name: "Twitter", handle: "@tempe_id", url: "#", color: "hover:text-sky-600" },
    { icon: Youtube, name: "YouTube", handle: "Tempe Nusantara", url: "#", color: "hover:text-red-600" },
    { icon: Linkedin, name: "LinkedIn", handle: "Tempe Nusantara", url: "#", color: "hover:text-blue-700" },
  ];

  const faqQuick = [
    { question: "Bagaimana cara memesan?", link: "/faq#order" },
    { question: "Apa metode pembayaran yang tersedia?", link: "/faq#payment" },
    { question: "Berapa lama pengiriman?", link: "/faq#shipping" },
    { question: "Bagaimana cara retur produk?", link: "/faq#return" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Pesan berhasil dikirim!", {
        description: "Tim kami akan segera menghubungi Anda.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Gagal mengirim pesan", {
        description: "Silakan coba lagi nanti.",
      });
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/80 mb-4">
            <span className="hover:text-primary-foreground cursor-pointer" onClick={() => router.push("/")}>
              Home
            </span>
            <span>/</span>
            <span className="text-primary-foreground font-medium">Kontak</span>
          </div>

          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <MessageCircle className="w-3 h-3 mr-1" />
              Hubungi Kami
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kami Siap Membantu Anda</h1>
            <p className="text-lg text-primary-foreground/90">Ada pertanyaan atau butuh bantuan? Tim customer service kami siap melayani Anda dengan senang hati.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Quick Contact Info */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer" onClick={() => info.action && window.open(info.action, "_blank")}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Kirim Pesan
                </CardTitle>
                <CardDescription>Isi formulir di bawah ini dan kami akan segera merespons pesan Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nama Lengkap <span className="text-destructive">*</span>
                      </Label>
                      <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+62 812 3456 7890" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        Subjek <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            subject: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih subjek" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">Pertanyaan Pemesanan</SelectItem>
                          <SelectItem value="product">Informasi Produk</SelectItem>
                          <SelectItem value="partnership">Partnership & B2B</SelectItem>
                          <SelectItem value="complaint">Keluhan</SelectItem>
                          <SelectItem value="feedback">Saran & Feedback</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Pesan <span className="text-destructive">*</span>
                    </Label>
                    <Textarea id="message" name="message" placeholder="Tulis pesan Anda di sini..." rows={6} value={formData.message} onChange={handleInputChange} required />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Dengan mengirim pesan ini, Anda menyetujui{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Kebijakan Privasi
                    </a>{" "}
                    kami
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Departments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Departemen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => {
                  const IconComponent = dept.icon;
                  return (
                    <div key={index} className="pb-4 last:pb-0 border-b last:border-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground mb-1">{dept.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{dept.description}</p>
                          <a href={`mailto:${dept.contact}`} className="text-xs text-primary hover:underline">
                            {dept.contact}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Media Sosial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {socialMedia.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors ${social.color}`}>
                      <IconComponent className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{social.name}</p>
                        <p className="text-xs text-muted-foreground">{social.handle}</p>
                      </div>
                    </a>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  FAQ Cepat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {faqQuick.map((faq, index) => (
                  <button key={index} onClick={() => router.push(faq.link)} className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </div>
                  </button>
                ))}
                <Button variant="outline" className="w-full mt-4" onClick={() => router.push("/faq")}>
                  Lihat Semua FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Lokasi Kami
              </CardTitle>
              <CardDescription>Kunjungi kantor dan pabrik kami</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {/* Replace with actual Google Maps embed */}
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Google Maps akan ditampilkan di sini</p>
                  <p className="text-sm text-muted-foreground">Jl. Tempe Raya No. 123, Bandung, Jawa Barat 40123</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.open("https://maps.google.com", "_blank")}>
                    Buka di Google Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10" />
            <CardContent className="p-8 md:p-12 relative">
              <div className="max-w-3xl mx-auto text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Butuh Respons Cepat?</h2>
                <p className="text-primary-foreground/90 mb-6">Hubungi kami melalui WhatsApp untuk mendapat tanggapan langsung dari tim customer service kami</p>
                <Button size="lg" variant="secondary" onClick={() => window.open("https://wa.me/6281234567890", "_blank")}>
                  <Phone className="w-5 h-5 mr-2" />
                  Chat via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
