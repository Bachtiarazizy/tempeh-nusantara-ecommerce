"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Target, Award, Users, Leaf, TrendingUp, Globe, CheckCircle2, Star, ArrowRight, Factory, Shield, Sparkles, Clock, Package, ThumbsUp } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  const stats = [
    { icon: Users, value: "50K+", label: "Pelanggan Setia", color: "text-blue-600" },
    { icon: Package, value: "100K+", label: "Produk Terjual", color: "text-green-600" },
    { icon: Award, value: "15+", label: "Penghargaan", color: "text-amber-600" },
    { icon: Clock, value: "25+", label: "Tahun Pengalaman", color: "text-purple-600" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Kualitas Premium",
      description: "Menggunakan kedelai pilihan dan proses fermentasi tradisional yang terjaga kualitasnya",
      color: "bg-red-50 text-red-600 dark:bg-red-950/30",
    },
    {
      icon: Leaf,
      title: "Organik & Alami",
      description: "Tanpa bahan pengawet, pewarna, atau bahan kimia berbahaya untuk kesehatan keluarga",
      color: "bg-green-50 text-green-600 dark:bg-green-950/30",
    },
    {
      icon: Shield,
      title: "Higienis & Aman",
      description: "Diproduksi di fasilitas bersertifikat dengan standar keamanan pangan internasional",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30",
    },
    {
      icon: Globe,
      title: "Ramah Lingkungan",
      description: "Proses produksi berkelanjutan dengan kemasan eco-friendly dan zero waste",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
    },
  ];

  const milestones = [
    {
      year: "1998",
      title: "Berdiri",
      description: "Memulai usaha tempe rumahan dengan resep turun temurun keluarga",
    },
    {
      year: "2005",
      title: "Ekspansi",
      description: "Membuka pabrik modern pertama dengan kapasitas produksi 1 ton/hari",
    },
    {
      year: "2012",
      title: "Sertifikasi",
      description: "Mendapat sertifikasi halal dan standar keamanan pangan BPOM",
    },
    {
      year: "2018",
      title: "Go Digital",
      description: "Meluncurkan platform e-commerce untuk jangkauan lebih luas",
    },
    {
      year: "2023",
      title: "Ekspor",
      description: "Mulai ekspor ke negara Asia & Eropa dengan produk premium",
    },
    {
      year: "2025",
      title: "Inovasi",
      description: "Meluncurkan produk tempe organik dan varian inovatif",
    },
  ];

  const team = [
    {
      name: "Budi Santoso",
      position: "Founder & CEO",
      image: null,
      description: "Visioner di balik Tempe Nusantara dengan pengalaman 25+ tahun",
    },
    {
      name: "Siti Nurhaliza",
      position: "Head of Production",
      image: null,
      description: "Ahli fermentasi dengan sertifikasi internasional",
    },
    {
      name: "Andi Wijaya",
      position: "Quality Control Manager",
      image: null,
      description: "Menjaga standar kualitas produk dengan ketat",
    },
    {
      name: "Maya Kusuma",
      position: "Marketing Director",
      image: null,
      description: "Membawa brand Tempe Nusantara ke kancah nasional",
    },
  ];

  const certifications = [
    { name: "Halal MUI", icon: CheckCircle2 },
    { name: "BPOM", icon: Shield },
    { name: "ISO 22000", icon: Award },
    { name: "Organic Certified", icon: Leaf },
    { name: "HACCP", icon: CheckCircle2 },
    { name: "SNI", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/80 mb-4">
            <span className="hover:text-primary-foreground cursor-pointer" onClick={() => router.push("/")}>
              Home
            </span>
            <span>/</span>
            <span className="text-primary-foreground font-medium">Tentang Kami</span>
          </div>

          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Sejak 1998
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Membawa Cita Rasa Tempe Tradisional ke Seluruh Nusantara</h1>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Kami adalah produsen tempe berkualitas premium yang menggabungkan resep tradisional dengan teknologi modern, menghadirkan produk bernutrisi tinggi untuk kesehatan keluarga Indonesia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" onClick={() => router.push("/products")}>
                Lihat Produk
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-12 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {/* Our Story */}
        <section>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Heart className="w-3 h-3 mr-1" />
                Cerita Kami
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">Dari Dapur Rumah hingga Meja Makan Nusantara</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Berawal dari warisan resep keluarga yang diturunkan dari generasi ke generasi, Tempe Nusantara memulai perjalanan pada tahun 1998 sebagai usaha rumahan kecil di Bandung.</p>
                <p>
                  Dengan komitmen pada kualitas dan cita rasa autentik, kami berkembang menjadi salah satu produsen tempe terkemuka di Indonesia. Setiap potongan tempe yang kami produksi mengandung dedikasi, tradisi, dan inovasi untuk
                  menghadirkan yang terbaik bagi pelanggan kami.
                </p>
                <p>Hari ini, kami bangga melayani lebih dari 50,000 pelanggan setia di seluruh Indonesia dan mulai merambah pasar internasional, membawa kebanggaan kuliner Indonesia ke dunia.</p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Factory className="w-32 h-32 text-primary/40" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-2xl -z-10" />
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Target className="w-3 h-3 mr-1" />
              Nilai-Nilai Kami
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Komitmen Kami untuk Anda</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Kami tidak hanya memproduksi tempe, tetapi menghadirkan gaya hidup sehat dan berkualitas</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center mb-4`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Clock className="w-3 h-3 mr-1" />
              Perjalanan Kami
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Milestone & Pencapaian</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Lebih dari dua dekade dedikasi untuk menghadirkan tempe berkualitas</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-2">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg" />

                  {/* Spacer */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section>
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Tim Kami
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Orang-Orang di Balik Kesuksesan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Tim profesional dan berdedikasi yang membawa visi kami menjadi kenyataan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-xs text-muted-foreground">{member.description}</p>
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
              Sertifikasi & Penghargaan
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Dipercaya dan Tersertifikasi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Produk kami telah memenuhi standar kualitas dan keamanan pangan internasional</p>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {certifications.map((cert, index) => {
                  const IconComponent = cert.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{cert.name}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10" />
            <CardContent className="p-12 relative">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Siap Mencoba Tempe Berkualitas Premium?</h2>
                <p className="text-lg text-primary-foreground/90 mb-8">Bergabunglah dengan ribuan pelanggan yang telah merasakan kualitas terbaik tempe kami</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" onClick={() => router.push("/products")}>
                    <Package className="w-5 h-5 mr-2" />
                    Belanja Sekarang
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <ThumbsUp className="w-5 h-5 mr-2" />
                    Lihat Testimoni
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
