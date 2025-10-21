"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Copy, Check, TrendingUp, AlertCircle, User, Building2, Shield, Link2, Eye, ShoppingCart, DollarSign, Clock, Target, Award, Mail, Phone, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AffiliateProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Data states
  const [affiliateData, setAffiliateData] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [bankData, setBankData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Redirect if not authenticated or not affiliate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.role !== "AFFILIATE") {
      router.push("/");
    }
  }, [status, session, router]);

  // Fetch affiliate data
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "AFFILIATE") {
      fetchAffiliateData();
    }
  }, [status, session]);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/affiliate/profile");

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setAffiliateData(data.affiliate);
      setProfileData({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
      });
      setBankData({
        bankName: data.affiliate.bankName || "",
        accountNumber: data.affiliate.accountNumber || "",
        accountName: data.affiliate.accountName || "",
      });
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/affiliate/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update");
      }

      alert("✅ Profil berhasil diperbarui!");
      await fetchAffiliateData();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBank = async () => {
    if (!bankData.bankName || !bankData.accountNumber || !bankData.accountName) {
      alert("⚠️ Semua field bank harus diisi!");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/affiliate/bank", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bankData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update");
      }

      alert("✅ Data bank berhasil diperbarui!");
      await fetchAffiliateData();
    } catch (error) {
      console.error("Error updating bank:", error);
      alert("❌ " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("⚠️ Password baru tidak cocok!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert("⚠️ Password minimal 8 karakter!");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change password");
      }

      alert("✅ Password berhasil diubah!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      alert("❌ " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/?ref=${affiliateData?.referralCode}`;
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { label: "Aktif", variant: "default" },
      PENDING: { label: "Menunggu", variant: "secondary" },
      INACTIVE: { label: "Nonaktif", variant: "outline" },
      SUSPENDED: { label: "Ditangguhkan", variant: "destructive" },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "bank", label: "Rekening Bank", icon: Building2 },
    { id: "password", label: "Keamanan", icon: Shield },
    { id: "referral", label: "Referral", icon: Link2 },
  ];

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!affiliateData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Data affiliate tidak ditemukan</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 py-8 px-4">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Affiliate</h1>
        <p className="text-muted-foreground mt-2">Kelola informasi akun dan pengaturan affiliate Anda</p>
      </div>

      {/* Profile Header Card */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{profileData.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>Member sejak {formatDate(affiliateData.joinedAt)}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>
                    Kode: <span className="font-mono font-semibold text-foreground">{affiliateData.referralCode}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getStatusBadge(affiliateData.status)}
                  {affiliateData.rank && (
                    <Badge variant="secondary" className="gap-1">
                      <Award className="w-3 h-3" />
                      Rank #{affiliateData.rank}
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {affiliateData.commissionRate}% Komisi
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Klik</p>
                <p className="text-3xl font-bold">{affiliateData.totalClicks.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Pesanan</p>
                <p className="text-3xl font-bold">{affiliateData.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Konversi: {((affiliateData.totalOrders / (affiliateData.totalClicks || 1)) * 100).toFixed(2)}%</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Komisi</p>
                <p className="text-2xl font-bold">{formatCurrency(affiliateData.totalCommission)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{formatCurrency(affiliateData.pendingCommission)}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goal Progress */}
      {affiliateData.monthlyGoal > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Target Bulanan
                </CardTitle>
                <CardDescription>
                  {affiliateData.monthlyOrdersCount || 0} dari {affiliateData.monthlyGoal} pesanan tercapai
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{Math.round(((affiliateData.monthlyOrdersCount || 0) / affiliateData.monthlyGoal) * 100)}%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(((affiliateData.monthlyOrdersCount || 0) / affiliateData.monthlyGoal) * 100, 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs Navigation */}
      <Card>
        <CardContent className="p-2">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button key={tab.id} variant={activeTab === tab.id ? "default" : "ghost"} onClick={() => setActiveTab(tab.id)} className="whitespace-nowrap">
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>Update informasi pribadi Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} placeholder="Nama lengkap Anda" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} placeholder="email@example.com" className="pl-10" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nomor Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+62 812-3456-7890" className="pl-10" />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button onClick={handleUpdateProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bank Tab */}
      {activeTab === "bank" && (
        <Card>
          <CardHeader>
            <CardTitle>Informasi Rekening Bank</CardTitle>
            <CardDescription>Data rekening untuk pencairan komisi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-muted-foreground/20 bg-muted/50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Informasi Penting</p>
                  <p className="text-sm text-muted-foreground">Pastikan data rekening benar. Komisi akan ditransfer ke rekening ini setiap tanggal 1 dan 15.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Nama Bank <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  value={bankData.bankName}
                  onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Pilih Bank</option>
                  <option value="BCA">BCA</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="BNI">BNI</option>
                  <option value="BRI">BRI</option>
                  <option value="CIMB Niaga">CIMB Niaga</option>
                  <option value="Bank Syariah Indonesia">Bank Syariah Indonesia</option>
                  <option value="Bank Permata">Bank Permata</option>
                  <option value="Bank Danamon">Bank Danamon</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Nomor Rekening <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input value={bankData.accountNumber} onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value.replace(/\D/g, "") })} placeholder="1234567890" maxLength={20} className="pl-10 font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Nama Pemilik Rekening <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input value={bankData.accountName} onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })} placeholder="Sesuai buku rekening" className="pl-10" />
                </div>
                <p className="text-xs text-muted-foreground">Harus sesuai dengan KTP</p>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button onClick={handleUpdateBank} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Data Bank"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <Card>
          <CardHeader>
            <CardTitle>Keamanan Akun</CardTitle>
            <CardDescription>Ubah password untuk keamanan akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password Saat Ini <span className="text-destructive">*</span>
              </label>
              <Input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} placeholder="Masukkan password saat ini" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password Baru <span className="text-destructive">*</span>
                </label>
                <Input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder="Minimal 8 karakter" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Konfirmasi Password <span className="text-destructive">*</span>
                </label>
                <Input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} placeholder="Ketik ulang password" />
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Tips Password Aman
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Minimal 8 karakter
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Kombinasi huruf besar dan kecil
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Gunakan angka dan simbol (!@#$%)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  Jangan gunakan informasi pribadi
                </li>
              </ul>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button onClick={handleChangePassword} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengubah...
                  </>
                ) : (
                  "Ubah Password"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referral Tab */}
      {activeTab === "referral" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Referral Anda</CardTitle>
              <CardDescription>Bagikan link ini untuk mendapatkan komisi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kode Referral</label>
                <div className="flex gap-2">
                  <Input value={affiliateData.referralCode} readOnly className="font-mono text-lg font-bold" />
                  <Button variant="outline" onClick={copyReferralLink}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link Lengkap</label>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-blue-600 break-all font-mono">{`${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${affiliateData.referralCode}`}</p>
                </div>
              </div>

              <Button onClick={copyReferralLink} className="w-full">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link Referral
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Referral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Klik</p>
                  <p className="text-3xl font-bold text-blue-600">{affiliateData.totalClicks}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Konversi</p>
                  <p className="text-3xl font-bold text-purple-600">{affiliateData.totalOrders}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Penjualan</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(affiliateData.totalSales)}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Komisi</p>
                  <p className="text-2xl font-bold text-amber-600">{formatCurrency(affiliateData.totalCommission)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Card */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-purple-900 mb-2 text-lg">💬 Butuh Bantuan?</h3>
          <p className="text-sm text-purple-800 mb-4">Jika Anda mengalami masalah atau memiliki pertanyaan, tim support kami siap membantu Anda.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@tempenusantara.com">📧 Email Support</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer">
                💬 WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/faq">❓ FAQ</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
