"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Building2, Percent, Truck, CreditCard, Bell, MessageCircle, Check, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    affiliateCommissionRate: 5,
    minimumPayout: 100000,
    payoutSchedule: "bi-weekly",
    freeShippingThreshold: 500000,
    domesticShippingRate: 50000,
    internationalShippingRate: 150000,
    bankName: "",
    accountNumber: "",
    accountName: "",
    emailNotifications: true,
    whatsappNotifications: true,
    orderNotifications: true,
    affiliateNotifications: true,
    whatsappNumber: "",
    whatsappMessage: "",
  });

  const [activeTab, setActiveTab] = useState("business");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Panggil fetchSettings saat komponen pertama kali dimuat
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      if (data.success) {
        setSettings((prev) => ({ ...prev, ...data.data }));
        toast.success("Pengaturan berhasil dimuat");
      } else {
        toast.error("Gagal memuat pengaturan");
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Terjadi kesalahan saat memuat pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await response.json();
      if (data.success) {
        if (data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
        toast.success("Pengaturan telah berhasil diperbarui");
      } else {
        toast.error("Gagal menyimpan pengaturan");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Terjadi kesalahan saat menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  const tabs = [
    { id: "business", label: "Informasi Bisnis", icon: Building2 },
    { id: "commission", label: "Komisi Affiliate", icon: Percent },
    { id: "shipping", label: "Pengiriman", icon: Truck },
    { id: "payment", label: "Pembayaran", icon: CreditCard },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Pengaturan Sistem</h1>
                <p className="text-muted-foreground">Kelola konfigurasi aplikasi dan preferensi bisnis Anda</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="p-3">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                          </div>
                          {isActive && <ChevronRight className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* Business Info Tab */}
              {activeTab === "business" && (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Informasi Bisnis
                    </CardTitle>
                    <CardDescription>Kelola informasi dasar dan identitas bisnis Anda</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Nama Bisnis</label>
                          <Input value={settings.businessName} onChange={(e) => handleChange("businessName", e.target.value)} placeholder="PT. Nama Perusahaan" className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Email Bisnis</label>
                          <Input type="email" value={settings.businessEmail} onChange={(e) => handleChange("businessEmail", e.target.value)} placeholder="info@perusahaan.com" className="h-11" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Nomor Telepon</label>
                        <Input value={settings.businessPhone} onChange={(e) => handleChange("businessPhone", e.target.value)} placeholder="+62 812-3456-7890" className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Alamat Lengkap</label>
                        <textarea
                          value={settings.businessAddress}
                          onChange={(e) => handleChange("businessAddress", e.target.value)}
                          placeholder="Jl. Contoh No. 123, Jakarta"
                          className="w-full min-h-24 px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving} className="min-w-32">
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Commission Tab */}
              {activeTab === "commission" && (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Percent className="h-5 w-5 text-primary" />
                      Pengaturan Komisi Affiliate
                    </CardTitle>
                    <CardDescription>Atur persentase komisi dan ketentuan pembayaran untuk affiliate</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Persentase Komisi</label>
                          <div className="relative">
                            <Input type="number" value={settings.affiliateCommissionRate} onChange={(e) => handleChange("affiliateCommissionRate", parseFloat(e.target.value))} min="0" max="100" className="h-11 pr-8" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Komisi per penjualan: {settings.affiliateCommissionRate}%</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Minimum Penarikan</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                            <Input type="number" value={settings.minimumPayout} onChange={(e) => handleChange("minimumPayout", parseFloat(e.target.value))} min="0" className="h-11 pl-10" />
                          </div>
                          <p className="text-xs text-muted-foreground">Minimal Rp {parseInt(settings.minimumPayout).toLocaleString("id-ID")}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Jadwal Pembayaran</label>
                        <select
                          value={settings.payoutSchedule}
                          onChange={(e) => handleChange("payoutSchedule", e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="weekly">Mingguan</option>
                          <option value="bi-weekly">Dua Minggu Sekali</option>
                          <option value="monthly">Bulanan</option>
                        </select>
                      </div>

                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Percent className="h-4 w-4 text-primary" />
                          Simulasi Komisi
                        </h4>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Penjualan: <span className="font-medium text-foreground">Rp 1.000.000</span>
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-muted-foreground">Komisi Affiliate:</span>
                            <span className="text-2xl font-bold text-primary">Rp {((1000000 * settings.affiliateCommissionRate) / 100).toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving} className="min-w-32">
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Tab */}
              {activeTab === "shipping" && (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Pengaturan Pengiriman
                    </CardTitle>
                    <CardDescription>Kelola biaya dan ketentuan pengiriman produk</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Minimum Gratis Ongkir</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                          <Input type="number" value={settings.freeShippingThreshold} onChange={(e) => handleChange("freeShippingThreshold", parseFloat(e.target.value))} min="0" className="h-11 pl-10" />
                        </div>
                        <p className="text-xs text-muted-foreground">Gratis ongkir untuk pembelian ≥ Rp {parseInt(settings.freeShippingThreshold).toLocaleString("id-ID")}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Tarif Domestik</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                            <Input type="number" value={settings.domesticShippingRate} onChange={(e) => handleChange("domesticShippingRate", parseFloat(e.target.value))} min="0" className="h-11 pl-10" />
                          </div>
                          <p className="text-xs text-muted-foreground">Pengiriman dalam negeri</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Tarif Internasional</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                            <Input type="number" value={settings.internationalShippingRate} onChange={(e) => handleChange("internationalShippingRate", parseFloat(e.target.value))} min="0" className="h-11 pl-10" />
                          </div>
                          <p className="text-xs text-muted-foreground">Pengiriman luar negeri</p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving} className="min-w-32">
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Tab */}
              {activeTab === "payment" && (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Informasi Pembayaran
                    </CardTitle>
                    <CardDescription>Rekening bank untuk menerima pembayaran dari pelanggan</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Nama Bank</label>
                        <Input value={settings.bankName} onChange={(e) => handleChange("bankName", e.target.value)} placeholder="Bank Mandiri" className="h-11" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Nomor Rekening</label>
                          <Input value={settings.accountNumber} onChange={(e) => handleChange("accountNumber", e.target.value)} placeholder="1234567890" className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Nama Pemilik</label>
                          <Input value={settings.accountName} onChange={(e) => handleChange("accountName", e.target.value)} placeholder="PT Nama Perusahaan" className="h-11" />
                        </div>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4">
                        <p className="text-sm text-amber-900 dark:text-amber-100">
                          <strong className="font-semibold">Catatan:</strong> Informasi ini akan ditampilkan kepada pelanggan saat melakukan pembayaran transfer bank.
                        </p>
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving} className="min-w-32">
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Pengaturan Notifikasi
                    </CardTitle>
                    <CardDescription>Pilih jenis notifikasi yang ingin Anda terima</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { key: "emailNotifications", title: "Email", desc: "Terima notifikasi melalui email" },
                        { key: "whatsappNotifications", title: "WhatsApp", desc: "Terima notifikasi melalui WhatsApp" },
                        { key: "orderNotifications", title: "Pesanan Baru", desc: "Notifikasi saat ada pesanan baru" },
                        { key: "affiliateNotifications", title: "Affiliate Baru", desc: "Notifikasi saat ada pendaftaran affiliate" },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                          </div>
                          <div className="relative inline-block w-12 h-6 ml-4">
                            <input type="checkbox" checked={settings[item.key]} onChange={(e) => handleChange(item.key, e.target.checked)} className="sr-only peer" />
                            <div className="w-12 h-6 bg-muted peer-checked:bg-primary rounded-full peer transition-colors"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                          </div>
                        </label>
                      ))}

                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving} className="min-w-32">
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* WhatsApp Tab */}
              {activeTab === "whatsapp" && (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      Integrasi WhatsApp
                    </CardTitle>
                    <CardDescription>Atur kontak WhatsApp untuk komunikasi pelanggan</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Nomor WhatsApp</label>
                        <Input value={settings.whatsappNumber} onChange={(e) => handleChange("whatsappNumber", e.target.value)} placeholder="+6281234567890" className="h-11" />
                        <p className="text-xs text-muted-foreground">Format: +62XXXXXXXXXX (tanpa spasi atau tanda hubung)</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Pesan Default</label>
                        <textarea
                          value={settings.whatsappMessage}
                          onChange={(e) => handleChange("whatsappMessage", e.target.value)}
                          placeholder="Halo, saya tertarik dengan produk Anda..."
                          className="w-full min-h-28 px-3 py-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <p className="text-xs text-muted-foreground">Pesan otomatis saat pelanggan menghubungi via WhatsApp</p>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm">Preview Link WhatsApp</h4>
                        <p className="text-xs text-green-800 dark:text-green-200 break-all font-mono">
                          https://wa.me/{settings.whatsappNumber.replace(/[^0-9]/g, "")}?text={encodeURIComponent(settings.whatsappMessage)}
                        </p>
                      </div>

                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving} className="min-w-32">
                          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
