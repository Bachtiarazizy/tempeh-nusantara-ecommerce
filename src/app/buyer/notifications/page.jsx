"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  BellOff,
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Gift,
  Tag,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Settings,
  Filter,
  Check,
  X,
  Mail,
  Smartphone,
  Volume2,
  Eye,
  EyeOff,
  Archive,
  Star,
  Heart,
  Truck,
  DollarSign,
  Percent,
  RefreshCw,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    email: {
      orders: true,
      promotions: true,
      updates: true,
      messages: false,
    },
    push: {
      orders: true,
      promotions: false,
      updates: true,
      messages: true,
    },
    inApp: {
      orders: true,
      promotions: true,
      updates: true,
      messages: true,
    },
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockNotifications = [
        {
          id: "NOTIF001",
          type: "order",
          title: "Pesanan Telah Dikirim",
          message: "Pesanan #ORD-2024-1024 sedang dalam perjalanan. Estimasi tiba: 2 hari",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: false,
          actionUrl: "/orders/ORD-2024-1024",
          metadata: {
            orderId: "ORD-2024-1024",
            trackingNumber: "JNE123456789",
          },
        },
        {
          id: "NOTIF002",
          type: "promotion",
          title: "Flash Sale Hari Ini! 🔥",
          message: "Diskon hingga 70% untuk kategori Fashion. Buruan sebelum kehabisan!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: false,
          actionUrl: "/flash-sale",
          metadata: {
            discount: "70%",
            category: "Fashion",
          },
        },
        {
          id: "NOTIF003",
          type: "payment",
          title: "Pembayaran Berhasil",
          message: "Pembayaran untuk pesanan #ORD-2024-1023 sebesar Rp 450.000 telah berhasil",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          read: true,
          actionUrl: "/orders/ORD-2024-1023",
          metadata: {
            amount: 450000,
            orderId: "ORD-2024-1023",
          },
        },
        {
          id: "NOTIF004",
          type: "order",
          title: "Pesanan Telah Sampai",
          message: "Pesanan #ORD-2024-1020 telah sampai. Jangan lupa berikan ulasan!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          read: true,
          actionUrl: "/orders/ORD-2024-1020/review",
          metadata: {
            orderId: "ORD-2024-1020",
          },
        },
        {
          id: "NOTIF005",
          type: "earning",
          title: "Komisi Baru Diterima",
          message: "Anda mendapat komisi Rp 125.000 dari 5 pesanan hari ini",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          read: false,
          actionUrl: "/affiliate/earnings",
          metadata: {
            amount: 125000,
            orders: 5,
          },
        },
        {
          id: "NOTIF006",
          type: "promo",
          title: "Kode Voucher Eksklusif untuk Anda",
          message: "Gunakan kode WELCOME50 untuk diskon Rp 50.000. Berlaku hingga akhir bulan!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          read: false,
          actionUrl: "/vouchers",
          metadata: {
            code: "WELCOME50",
            discount: 50000,
          },
        },
        {
          id: "NOTIF007",
          type: "message",
          title: "Pesan Baru dari Penjual",
          message: "Toko XYZ mengirim pesan terkait pesanan Anda",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
          read: true,
          actionUrl: "/messages",
          metadata: {
            seller: "Toko XYZ",
          },
        },
        {
          id: "NOTIF008",
          type: "system",
          title: "Update Aplikasi Tersedia",
          message: "Versi 2.5.0 telah tersedia dengan fitur-fitur baru dan perbaikan bug",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          read: true,
          actionUrl: null,
          metadata: {
            version: "2.5.0",
          },
        },
        {
          id: "NOTIF009",
          type: "wishlist",
          title: "Produk Wishlist Turun Harga",
          message: "Sepatu Nike Air Max yang Anda simpan turun harga 30%!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          read: false,
          actionUrl: "/wishlist",
          metadata: {
            product: "Sepatu Nike Air Max",
            discount: "30%",
          },
        },
        {
          id: "NOTIF010",
          type: "order",
          title: "Pesanan Menunggu Pembayaran",
          message: "Segera selesaikan pembayaran untuk pesanan #ORD-2024-1025 sebelum kedaluwarsa",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
          read: true,
          actionUrl: "/orders/ORD-2024-1025",
          metadata: {
            orderId: "ORD-2024-1025",
            expiresIn: "2 jam",
          },
        },
      ];
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: { icon: Package, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
      payment: { icon: CreditCard, color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
      promotion: { icon: Tag, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
      earning: { icon: DollarSign, color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
      promo: { icon: Percent, color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" },
      message: { icon: MessageSquare, color: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400" },
      system: { icon: AlertCircle, color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" },
      wishlist: { icon: Heart, color: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400" },
    };
    return icons[type] || icons.system;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return time.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleDeleteAll = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua notifikasi?")) {
      setNotifications([]);
    }
  };

  const handleSettingChange = (channel, type, value) => {
    setSettings((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: value,
      },
    }));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedTab === "unread" && notif.read) return false;
    if (filterType !== "all" && notif.type !== filterType) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Memuat notifikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">Notifikasi</h2>
            {unreadCount > 0 && (
              <Badge variant="default" className="h-6 px-2">
                {unreadCount} Baru
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">Kelola dan pantau semua notifikasi Anda</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Tandai Semua Dibaca
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Notifikasi</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Belum Dibaca</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hari Ini</p>
                <p className="text-2xl font-bold">
                  {
                    notifications.filter((n) => {
                      const diff = Date.now() - new Date(n.timestamp).getTime();
                      return diff < 86400000;
                    }).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="unread">
                  Belum Dibaca
                  {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">{unreadCount}</span>}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="order">Pesanan</SelectItem>
                  <SelectItem value="payment">Pembayaran</SelectItem>
                  <SelectItem value="promotion">Promosi</SelectItem>
                  <SelectItem value="earning">Komisi</SelectItem>
                  <SelectItem value="promo">Voucher</SelectItem>
                  <SelectItem value="message">Pesan</SelectItem>
                  <SelectItem value="wishlist">Wishlist</SelectItem>
                  <SelectItem value="system">Sistem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BellOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tidak ada notifikasi</h3>
            <p className="text-muted-foreground text-center mb-6">{selectedTab === "unread" ? "Semua notifikasi sudah dibaca" : "Belum ada notifikasi untuk ditampilkan"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const iconConfig = getNotificationIcon(notification.type);
            const Icon = iconConfig.icon;

            return (
              <Card key={notification.id} className={`transition-all hover:shadow-md cursor-pointer ${!notification.read ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconConfig.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-base">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="default" className="shrink-0">
                            Baru
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} title="Tandai sudah dibaca">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(notification.id)} className="text-destructive hover:text-destructive" title="Hapus notifikasi">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {notification.actionUrl && (
                    <div className="mt-3 pt-3 border-t">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        Lihat Detail
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete All Button */}
      {notifications.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleDeleteAll} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus Semua Notifikasi
          </Button>
        </div>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pengaturan Notifikasi</DialogTitle>
            <DialogDescription>Atur preferensi notifikasi untuk setiap channel</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Notifikasi Email</h3>
              </div>
              <div className="space-y-3 pl-7">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-orders">Update Pesanan</Label>
                    <p className="text-sm text-muted-foreground">Status pesanan dan pengiriman</p>
                  </div>
                  <Switch id="email-orders" checked={settings.email.orders} onCheckedChange={(value) => handleSettingChange("email", "orders", value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-promotions">Promosi & Penawaran</Label>
                    <p className="text-sm text-muted-foreground">Diskon, voucher, dan promo spesial</p>
                  </div>
                  <Switch id="email-promotions" checked={settings.email.promotions} onCheckedChange={(value) => handleSettingChange("email", "promotions", value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-updates">Update Platform</Label>
                    <p className="text-sm text-muted-foreground">Fitur baru dan pengumuman</p>
                  </div>
                  <Switch id="email-updates" checked={settings.email.updates} onCheckedChange={(value) => handleSettingChange("email", "updates", value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-messages">Pesan</Label>
                    <p className="text-sm text-muted-foreground">Pesan dari penjual dan admin</p>
                  </div>
                  <Switch id="email-messages" checked={settings.email.messages} onCheckedChange={(value) => handleSettingChange("email", "messages", value)} />
                </div>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Push Notification</h3>
              </div>
              <div className="space-y-3 pl-7">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-orders">Update Pesanan</Label>
                    <p className="text-sm text-muted-foreground">Status pesanan dan pengiriman</p>
                  </div>
                  <Switch id="push-orders" checked={settings.push.orders} onCheckedChange={(value) => handleSettingChange("push", "orders", value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-promotions">Promosi & Penawaran</Label>
                    <p className="text-sm text-muted-foreground">Diskon, voucher, dan promo spesial</p>
                  </div>
                  <Switch id="push-promotions" checked={settings.push.promotions} onCheckedChange={(value) => handleSettingChange("push", "promotions", value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-updates">Update Platform</Label>
                    <p className="text-sm text-muted-foreground">Fitur baru dan pengumuman</p>
                  </div>
                  <Switch id="push-updates" checked={settings.push.updates} onCheckedChange={(value) => handleSettingChange("push", "updates", value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-messages">Pesan</Label>
                    <p className="text-sm text-muted-foreground">Pesan dari penjual dan admin</p>
                  </div>
                  <Switch id="push-messages" checked={settings.push.messages} onCheckedChange={(value) => handleSettingChange("push", "messages", value)} />
                </div>
              </div>
            </div>

            {/* In-App Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Notifikasi In-App</h3>
              </div>
              <div className="space-y-3 pl-7">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inapp-orders">Update Pesanan</Label>
                    <p className="text-sm text-muted-foreground">Status pesanan dan pengiriman</p>
                  </div>
                  <Switch id="inapp-orders" checked={settings.inApp.orders} onCheckedChange={(value) => handleSettingChange("inApp", "orders", value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inapp-promotions">Promosi & Penawaran</Label>
                    <p className="text-sm text-muted-foreground">Diskon, voucher, dan promo spesial</p>
                  </div>
                  <Switch id="inapp-promotions" checked={settings.inApp.promotions} onCheckedChange={(value) => handleSettingChange("inApp", "promotions", value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inapp-updates">Update Platform</Label>
                    <p className="text-sm text-muted-foreground">Fitur baru dan pengumuman</p>
                  </div>
                  <Switch id="inapp-updates" checked={settings.inApp.updates} onCheckedChange={(value) => handleSettingChange("inApp", "updates", value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inapp-messages">Pesan</Label>
                    <p className="text-sm text-muted-foreground">Pesan dari penjual dan admin</p>
                  </div>
                  <Switch id="inapp-messages" checked={settings.inApp.messages} onCheckedChange={(value) => handleSettingChange("inApp", "messages", value)} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Simpan Pengaturan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
