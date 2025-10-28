"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Award,
  CheckCircle2,
  FileText,
  Leaf,
  Star,
  Sparkles,
  Factory,
  Microscope,
  FlaskConical,
  ThermometerSun,
  Droplets,
  Users,
  TrendingUp,
  Package,
  Truck,
  Clock,
  Mail,
  Eye,
  ClipboardCheck,
  Zap,
  Heart,
  Globe,
  BookOpen,
  ArrowRight,
  Download,
  Target,
  Lock,
  AlertCircle,
  BadgeCheck,
  Beaker,
  ShieldCheck,
  FileCheck,
  UserCheck,
  Building2,
} from "lucide-react";

export default function QualityCertificationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("quality");

  const certifications = [
    {
      id: "halal",
      icon: Award,
      name: "Sertifikat Halal",
      issuer: "Majelis Ulama Indonesia (MUI)",
      number: "ID-MUI-00123456",
      validUntil: "31 Desember 2025",
      description: "Produk kami telah tersertifikasi halal oleh MUI, memastikan semua bahan dan proses produksi sesuai syariat Islam",
      scope: "Seluruh produk tempe dan turunannya",
      color: "bg-green-50 text-green-600 dark:bg-green-950/30",
      verified: true,
    },
    {
      id: "bpom",
      icon: Shield,
      name: "BPOM RI",
      issuer: "Badan Pengawas Obat dan Makanan",
      number: "MD 123456789012",
      validUntil: "Ongoing",
      description: "Terdaftar di BPOM RI dengan standar keamanan dan kualitas pangan yang ketat",
      scope: "Semua varian produk",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30",
      verified: true,
    },
    {
      id: "iso22000",
      icon: FileText,
      name: "ISO 22000:2018",
      issuer: "International Organization for Standardization",
      number: "ISO-22000-2018-ID-001",
      validUntil: "15 Juni 2026",
      description: "Sistem manajemen keamanan pangan internasional untuk menjamin keamanan produk dari hulu ke hilir",
      scope: "Sistem produksi & distribusi",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/30",
      verified: true,
    },
    {
      id: "haccp",
      icon: ClipboardCheck,
      name: "HACCP",
      issuer: "Hazard Analysis Critical Control Point",
      number: "HACCP-ID-2024-001",
      validUntil: "20 Maret 2026",
      description: "Sistem keamanan pangan yang mengidentifikasi, mengevaluasi, dan mengendalikan bahaya keamanan pangan",
      scope: "Proses produksi lengkap",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30",
      verified: true,
    },
    {
      id: "organic",
      icon: Leaf,
      name: "Organic Certificate",
      issuer: "EU & USDA Organic Standard",
      number: "ORG-EU-2024-123 / USDA-NOP-456",
      validUntil: "10 September 2025",
      description: "Sertifikasi organik internasional untuk produk tempe organik, tanpa pestisida dan bahan kimia sintetis",
      scope: "Produk tempe organik",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
      verified: true,
    },
    {
      id: "sni",
      icon: Star,
      name: "SNI (Standar Nasional Indonesia)",
      issuer: "Badan Standardisasi Nasional",
      number: "SNI-3144-2024",
      validUntil: "Ongoing",
      description: "Memenuhi standar kualitas produk tempe nasional Indonesia",
      scope: "Semua produk tempe",
      color: "bg-red-50 text-red-600 dark:bg-red-950/30",
      verified: true,
    },
  ];

  const qualityProcess = [
    {
      step: 1,
      icon: Target,
      title: "Seleksi Bahan Baku",
      description: "Kedelai pilihan berkualitas premium dari petani terpercaya",
      details: ["Kedelai non-GMO berkualitas tinggi", "Sortasi manual dan mesin untuk konsistensi", "Uji kadar air dan kebersihan", "Sertifikat kualitas dari supplier"],
    },
    {
      step: 2,
      icon: Droplets,
      title: "Pencucian & Perendaman",
      description: "Proses pembersihan dengan standar sanitasi ketat",
      details: ["Air bersih dengan standar pH terkontrol", "Perendaman 8-12 jam untuk tekstur optimal", "Sistem filtrasi air bertingkat", "Monitoring suhu dan waktu"],
    },
    {
      step: 3,
      icon: ThermometerSun,
      title: "Perebusan & Sterilisasi",
      description: "Sterilisasi pada suhu optimal untuk keamanan pangan",
      details: ["Suhu perebusan 90-100°C", "Waktu perebusan terstandar", "Eliminasi mikroorganisme berbahaya", "Sistem otomatis dengan monitoring"],
    },
    {
      step: 4,
      icon: Beaker,
      title: "Inokulasi Ragi",
      description: "Penambahan kultur starter berkualitas tinggi",
      details: ["Ragi Rhizopus oligosporus murni", "Ruangan steril ber-AC", "Dosis tepat untuk fermentasi optimal", "Quality control kultur berkala"],
    },
    {
      step: 5,
      icon: Factory,
      title: "Fermentasi Terkontrol",
      description: "Proses fermentasi dalam ruangan temperature-controlled",
      details: ["Suhu 28-32°C dengan humidity 70-80%", "Waktu fermentasi 36-48 jam", "Monitoring real-time 24/7", "Sirkulasi udara optimal"],
    },
    {
      step: 6,
      icon: Microscope,
      title: "Quality Control",
      description: "Inspeksi ketat multi-tahap sebelum pengemasan",
      details: ["Uji visual: warna, tekstur, aroma", "Uji mikrobiologi di laboratorium", "Uji organoleptik oleh tim QC", "Dokumentasi batch lengkap"],
    },
    {
      step: 7,
      icon: Package,
      title: "Pengemasan Higienis",
      description: "Packaging food-grade dalam ruang bersih",
      details: ["Plastik food-grade BPA-free", "Vacuum seal untuk kesegaran", "Labeling lengkap (expired, batch)", "Pengemasan di clean room"],
    },
    {
      step: 8,
      icon: Truck,
      title: "Cold Chain Distribution",
      description: "Distribusi dengan sistem rantai dingin terpercaya",
      details: ["Suhu penyimpanan 0-4°C", "Cold storage sebelum distribusi", "Armada refrigerated trucks", "GPS tracking real-time"],
    },
  ];

  const labTests = [
    {
      category: "Mikrobiologi",
      icon: Microscope,
      tests: [
        { name: "Total Plate Count", standard: "< 10⁵ CFU/g", result: "Pass" },
        { name: "E. Coli", standard: "Negative", result: "Pass" },
        { name: "Salmonella", standard: "Negative", result: "Pass" },
        { name: "Staphylococcus aureus", standard: "< 10² CFU/g", result: "Pass" },
      ],
    },
    {
      category: "Kimia",
      icon: FlaskConical,
      tests: [
        { name: "Protein", standard: "> 18%", result: "20.5%" },
        { name: "Kadar Air", standard: "< 65%", result: "58%" },
        { name: "Abu", standard: "< 2%", result: "1.2%" },
        { name: "Lemak", standard: "8-15%", result: "11%" },
      ],
    },
    {
      category: "Fisik",
      icon: Eye,
      tests: [
        { name: "Warna", standard: "Putih bersih", result: "Pass" },
        { name: "Tekstur", standard: "Kompak", result: "Pass" },
        { name: "Aroma", standard: "Khas tempe", result: "Pass" },
        { name: "Rasa", standard: "Gurih alami", result: "Pass" },
      ],
    },
    {
      category: "Kontaminan",
      icon: ShieldCheck,
      tests: [
        { name: "Pestisida Residu", standard: "< 0.01 ppm", result: "ND" },
        { name: "Logam Berat", standard: "< 0.5 ppm", result: "ND" },
        { name: "Mycotoxin", standard: "< 5 ppb", result: "ND" },
        { name: "Antibiotik", standard: "Negative", result: "ND" },
      ],
    },
  ];

  const qualityCommitments = [
    {
      icon: Shield,
      title: "Keamanan Pangan Prioritas",
      description: "Setiap produk melewati quality control berlapis untuk memastikan keamanan konsumen",
      stats: "100% Batch Tested",
    },
    {
      icon: Leaf,
      title: "Bahan Alami Berkualitas",
      description: "Hanya menggunakan kedelai pilihan tanpa bahan pengawet, pewarna, atau perasa buatan",
      stats: "0% Additives",
    },
    {
      icon: Factory,
      title: "Fasilitas Modern & Higienis",
      description: "Pabrik dengan teknologi modern dan standar kebersihan tinggi",
      stats: "ISO Certified Facility",
    },
    {
      icon: Users,
      title: "Tim Ahli Berpengalaman",
      description: "Diproduksi oleh tenaga terlatih dengan pengalaman puluhan tahun",
      stats: "25+ Years Experience",
    },
    {
      icon: Microscope,
      title: "Laboratorium In-house",
      description: "Laboratorium sendiri dengan peralatan canggih untuk testing komprehensif",
      stats: "Daily Quality Tests",
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      description: "Selalu berinovasi dan meningkatkan standar kualitas produk",
      stats: "R&D Investment",
    },
  ];

  const awards = [
    {
      year: "2024",
      title: "Best Tempeh Producer",
      issuer: "Indonesian Food Excellence Awards",
      description: "Penghargaan sebagai produsen tempe terbaik Indonesia",
    },
    {
      year: "2023",
      title: "Export Quality Champion",
      issuer: "Ministry of Trade Indonesia",
      description: "Penghargaan kualitas produk export ke pasar internasional",
    },
    {
      year: "2023",
      title: "Halal Excellence Award",
      issuer: "Indonesian Halal Council",
      description: "Konsistensi dalam menjaga standar halal produk",
    },
    {
      year: "2022",
      title: "Food Safety Innovation",
      issuer: "BPOM Innovation Forum",
      description: "Inovasi sistem keamanan pangan yang terintegrasi",
    },
  ];

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
            <span className="text-primary-foreground font-medium">Kualitas & Sertifikasi</span>
          </div>

          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              <BadgeCheck className="w-3 h-3 mr-1" />
              Certified Quality
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kualitas Premium dengan Standar Internasional</h1>
            <p className="text-lg text-primary-foreground/90 mb-8">Komitmen kami pada kualitas terbaik tercermin dalam setiap sertifikasi dan proses produksi yang ketat. Keamanan dan kepuasan pelanggan adalah prioritas utama kami.</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary">
                <FileText className="w-5 h-5 mr-2" />
                Lihat Sertifikat
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Download className="w-5 h-5 mr-2" />
                Download Dokumen
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Trust Badges */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 -mt-20">
          {[
            { icon: Award, label: "Halal MUI" },
            { icon: Shield, label: "BPOM" },
            { icon: FileText, label: "ISO 22000" },
            { icon: ClipboardCheck, label: "HACCP" },
            { icon: Leaf, label: "Organic" },
            { icon: Star, label: "SNI" },
          ].map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{badge.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Main Tabs */}
        <section>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-2 lg:grid-cols-4 h-auto gap-2">
              <TabsTrigger value="quality" className="py-3">
                <Shield className="w-4 h-4 mr-2" />
                Standar Kualitas
              </TabsTrigger>
              <TabsTrigger value="certifications" className="py-3">
                <Award className="w-4 h-4 mr-2" />
                Sertifikasi
              </TabsTrigger>
              <TabsTrigger value="process" className="py-3">
                <Factory className="w-4 h-4 mr-2" />
                Proses Produksi
              </TabsTrigger>
              <TabsTrigger value="lab" className="py-3">
                <Microscope className="w-4 h-4 mr-2" />
                Lab Testing
              </TabsTrigger>
            </TabsList>

            {/* Quality Standards Tab */}
            <TabsContent value="quality" className="space-y-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Komitmen Kualitas Kami</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Setiap aspek produksi dirancang untuk menghasilkan tempe berkualitas tertinggi</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {qualityCommitments.map((commitment, index) => {
                  const IconComponent = commitment.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                          <IconComponent className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{commitment.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{commitment.description}</p>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {commitment.stats}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Quality Metrics */}
              <Card className="bg-linear-to-br from-primary/5 to-background">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Metrik Kualitas</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      { label: "Rejection Rate", value: "< 0.1%", icon: Target },
                      { label: "Customer Satisfaction", value: "98.5%", icon: Heart },
                      { label: "Return Rate", value: "< 0.5%", icon: TrendingUp },
                      { label: "On-Time Quality Check", value: "100%", icon: Clock },
                    ].map((metric, index) => {
                      const IconComponent = metric.icon;
                      return (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                          <p className="text-sm text-muted-foreground">{metric.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Sertifikasi Resmi</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Produk kami telah tersertifikasi oleh lembaga nasional dan internasional terpercaya</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {certifications.map((cert) => {
                  const IconComponent = cert.icon;
                  return (
                    <Card key={cert.id} className="hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-16 h-16 rounded-2xl ${cert.color} flex items-center justify-center shrink-0`}>
                            <IconComponent className="w-8 h-8" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-xl font-bold text-foreground">{cert.name}</h3>
                              {cert.verified && (
                                <Badge variant="default" className="shrink-0">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-primary font-medium mb-1">{cert.issuer}</p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Certificate No:</span>
                            <span className="font-mono text-foreground">{cert.number}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Valid Until:</span>
                            <span className="font-medium text-foreground">{cert.validUntil}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Scope:</span>
                            <span className="text-foreground">{cert.scope}</span>
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          <FileCheck className="w-4 h-4 mr-2" />
                          View Certificate
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Awards */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Penghargaan & Prestasi</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {awards.map((award, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mx-auto mb-4">
                          <Award className="w-8 h-8 text-amber-600" />
                        </div>
                        <Badge variant="outline" className="mb-2">
                          {award.year}
                        </Badge>
                        <h4 className="font-bold text-foreground mb-1">{award.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{award.issuer}</p>
                        <p className="text-xs text-muted-foreground">{award.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Production Process Tab */}
            <TabsContent value="process" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Proses Produksi Berkualitas</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">8 tahap proses produksi dengan kontrol kualitas ketat di setiap langkah</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {qualityProcess.map((process) => {
                  const IconComponent = process.icon;
                  return (
                    <Card key={process.step} className="hover:shadow-lg transition-all hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">{process.step}</div>
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-bold text-foreground mb-2">{process.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{process.description}</p>
                        <ul className="space-y-1">
                          {process.details.slice(0, 2).map((detail, idx) => (
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

              {/* Facility Info */}
              <Card className="bg-linear-to-r from-primary/5 to-background">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-3">
                        <Building2 className="w-3 h-3 mr-1" />
                        Production Facility
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Fasilitas Produksi Modern</h3>
                      <p className="text-muted-foreground mb-4">Pabrik kami dilengkapi dengan teknologi terkini dan memenuhi standar GMP (Good Manufacturing Practice) untuk memastikan kualitas konsisten setiap batch produksi.</p>
                      <ul className="space-y-2">
                        {["Clean room dengan kontrol suhu & humidity", "Sistem air bersih bertingkat", "Peralatan produksi stainless steel", "Automated quality monitoring", "Waste management system"].map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-full md:w-1/3">
                      <div className="aspect-square rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Factory className="w-32 h-32 text-primary/40" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lab Testing Tab */}
            <TabsContent value="lab" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">Pengujian Laboratorium</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Setiap batch produk melewati serangkaian tes laboratorium komprehensif</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {labTests.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          Uji {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {category.tests.map((test, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-foreground">{test.name}</p>
                                <p className="text-xs text-muted-foreground">Standard: {test.standard}</p>
                              </div>
                              <Badge variant={test.result === "Pass" || test.result === "ND" ? "default" : "secondary"}>{test.result}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Lab Facility */}
              <Card className="bg-linear-to-br from-blue-50 to-background dark:from-blue-950/20">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <Badge variant="outline" className="mb-3">
                        <Microscope className="w-3 h-3 mr-1" />
                        Laboratory
                      </Badge>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Laboratorium In-House</h3>
                      <p className="text-muted-foreground mb-4">Dilengkapi dengan peralatan testing modern dan dioperasikan oleh tim analis bersertifikat untuk memastikan setiap produk memenuhi standar kualitas tertinggi.</p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Tests per Day", value: "50+" },
                          { label: "Lab Equipment", value: "20+" },
                          { label: "Certified Analysts", value: "8" },
                          { label: "Accuracy Rate", value: "99.9%" },
                        ].map((stat, index) => (
                          <div key={index} className="text-center p-3 rounded-lg bg-white dark:bg-background">
                            <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="aspect-square rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-950/30 dark:to-blue-950/10 flex items-center justify-center">
                        <Microscope className="w-32 h-32 text-blue-600/40" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testing Frequency */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    frequency: "Setiap Batch",
                    icon: CheckCircle2,
                    tests: ["Visual inspection", "Aroma check", "Texture test", "Weight verification"],
                  },
                  {
                    frequency: "Harian",
                    icon: Clock,
                    tests: ["Microbiological sampling", "pH testing", "Temperature monitoring", "Humidity check"],
                  },
                  {
                    frequency: "Mingguan",
                    icon: FileCheck,
                    tests: ["Complete lab analysis", "Nutritional testing", "Shelf life study", "Packaging integrity"],
                  },
                ].map((schedule, index) => {
                  const IconComponent = schedule.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-bold text-foreground">{schedule.frequency}</h4>
                        </div>
                        <ul className="space-y-2">
                          {schedule.tests.map((test, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                              <span className="text-sm text-muted-foreground">{test}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Traceability */}
        <section>
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-3">
                    <Lock className="w-3 h-3 mr-1" />
                    Traceability System
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Sistem Ketertelusuran Produk</h3>
                  <p className="text-muted-foreground mb-4">Setiap produk memiliki kode batch unik yang memungkinkan kami melacak seluruh proses produksi, dari bahan baku hingga distribusi ke konsumen.</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Batch Tracking",
                        description: "Unique batch number untuk setiap produksi",
                        icon: FileText,
                      },
                      {
                        title: "QR Code System",
                        description: "Scan untuk info lengkap produk",
                        icon: Target,
                      },
                      {
                        title: "Digital Records",
                        description: "Database terintegrasi untuk audit trail",
                        icon: BookOpen,
                      },
                    ].map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-accent/50">
                          <IconComponent className="w-5 h-5 text-primary shrink-0 mt-1" />
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h4>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Customer Assurance */}
        <section>
          <Card className="bg-linear-to-r from-emerald-50 to-background dark:from-emerald-950/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-4">
                  <Heart className="w-3 h-3 mr-1" />
                  Customer Assurance
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">Jaminan untuk Pelanggan</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: "100% Halal",
                    description: "Tersertifikasi MUI untuk ketenangan konsumen Muslim",
                  },
                  {
                    icon: Leaf,
                    title: "Tanpa Pengawet",
                    description: "Tidak menggunakan bahan pengawet buatan",
                  },
                  {
                    icon: UserCheck,
                    title: "Safe for All",
                    description: "Aman untuk semua kalangan termasuk anak-anak",
                  },
                  {
                    icon: Zap,
                    title: "Fresh Guaranteed",
                    description: "Dijamin kesegaran dengan cold chain distribution",
                  },
                ].map((assurance, index) => {
                  const IconComponent = assurance.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2">{assurance.title}</h4>
                      <p className="text-sm text-muted-foreground">{assurance.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Document Downloads */}
        <section>
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <Download className="w-3 h-3 mr-1" />
              Documents
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Download Dokumen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Akses dokumen sertifikasi dan laporan kualitas produk kami</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Sertifikat Halal MUI",
                size: "2.4 MB",
                type: "PDF",
                description: "Sertifikat halal lengkap dari MUI",
              },
              {
                title: "ISO 22000 Certificate",
                size: "1.8 MB",
                type: "PDF",
                description: "Sertifikat sistem manajemen keamanan pangan",
              },
              {
                title: "Lab Test Results",
                size: "3.2 MB",
                type: "PDF",
                description: "Hasil uji laboratorium terbaru",
              },
              {
                title: "BPOM Registration",
                size: "1.5 MB",
                type: "PDF",
                description: "Dokumen registrasi BPOM RI",
              },
              {
                title: "HACCP Certificate",
                size: "2.1 MB",
                type: "PDF",
                description: "Sertifikat HACCP compliance",
              },
              {
                title: "Product Specification",
                size: "4.5 MB",
                type: "PDF",
                description: "Spesifikasi teknis produk lengkap",
              },
            ].map((doc, index) => (
              <Card key={index} className="hover:shadow-lg transition-all group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{doc.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{doc.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Quality Team */}
        <section>
          <Card className="bg-linear-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10" />
            <CardContent className="p-12 relative">
              <div className="max-w-3xl mx-auto text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-3">Ada Pertanyaan tentang Kualitas Produk?</h2>
                <p className="text-lg text-primary-foreground/90 mb-8">Tim Quality Assurance kami siap menjawab pertanyaan dan memberikan informasi detail tentang standar kualitas produk</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" variant="secondary" onClick={() => router.push("/contact")}>
                    <Mail className="w-5 h-5 mr-2" />
                    Hubungi Quality Team
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={() => router.push("/products")}>
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Lihat Produk Kami
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Info Banner */}
        <section>
          <Card className="border-2 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Komitmen Transparansi</h4>
                  <p className="text-sm text-muted-foreground">
                    Kami berkomitmen untuk transparan dalam setiap aspek produksi. Semua sertifikasi dan dokumen kualitas kami dapat diverifikasi langsung ke lembaga penerbit. Jika Anda memiliki keraguan atau pertanyaan, jangan ragu untuk
                    menghubungi tim kami. Kepuasan dan kepercayaan pelanggan adalah prioritas utama kami.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
