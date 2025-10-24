"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link2, Copy, QrCode, Share2, ExternalLink, Plus, Search, Filter, Eye, MousePointerClick, ShoppingBag, DollarSign, Calendar, Trash2, Edit, Download, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AffiliateReferralLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [newLink, setNewLink] = useState({
    name: "",
    productId: "",
    customSlug: "",
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockLinks = [
        {
          id: "1",
          name: "Link Promosi Utama",
          url: "https://example.com/ref/ABC123",
          shortUrl: "example.com/ABC123",
          clicks: 1250,
          orders: 45,
          revenue: 15750000,
          commission: 1575000,
          conversionRate: 3.6,
          status: "active",
          createdAt: "2024-10-01",
          lastClick: "2024-10-24",
        },
        {
          id: "2",
          name: "Instagram Bio Link",
          url: "https://example.com/ref/INSTA456",
          shortUrl: "example.com/INSTA456",
          clicks: 890,
          orders: 28,
          revenue: 9240000,
          commission: 924000,
          conversionRate: 3.1,
          status: "active",
          createdAt: "2024-09-15",
          lastClick: "2024-10-23",
        },
        {
          id: "3",
          name: "YouTube Video Description",
          url: "https://example.com/ref/YT789",
          shortUrl: "example.com/YT789",
          clicks: 2340,
          orders: 87,
          revenue: 28710000,
          commission: 2871000,
          conversionRate: 3.7,
          status: "active",
          createdAt: "2024-08-20",
          lastClick: "2024-10-24",
        },
        {
          id: "4",
          name: "Facebook Ads Campaign",
          url: "https://example.com/ref/FB321",
          shortUrl: "example.com/FB321",
          clicks: 450,
          orders: 12,
          revenue: 3960000,
          commission: 396000,
          conversionRate: 2.7,
          status: "paused",
          createdAt: "2024-10-10",
          lastClick: "2024-10-15",
        },
      ];
      setLinks(mockLinks);
      setLoading(false);
    }, 1000);
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateLink = () => {
    // Simulate link creation
    const newLinkData = {
      id: Date.now().toString(),
      name: newLink.name,
      url: `https://example.com/ref/${newLink.customSlug || Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      shortUrl: `example.com/${newLink.customSlug || Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      clicks: 0,
      orders: 0,
      revenue: 0,
      commission: 0,
      conversionRate: 0,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      lastClick: "-",
    };

    setLinks([newLinkData, ...links]);
    setShowCreateModal(false);
    setNewLink({ name: "", productId: "", customSlug: "" });
  };

  const handleDeleteLink = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus link ini?")) {
      setLinks(links.filter((link) => link.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setLinks(links.map((link) => (link.id === id ? { ...link, status: link.status === "active" ? "paused" : "active" } : link)));
  };

  const generateQRCode = (url) => {
    // Simulate QR code generation
    alert(`QR Code akan diunduh untuk: ${url}`);
  };

  const filteredLinks = links.filter((link) => {
    const matchesSearch = link.name.toLowerCase().includes(searchQuery.toLowerCase()) || link.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || link.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate totals
  const totals = links.reduce(
    (acc, link) => ({
      clicks: acc.clicks + link.clicks,
      orders: acc.orders + link.orders,
      revenue: acc.revenue + link.revenue,
      commission: acc.commission + link.commission,
    }),
    { clicks: 0, orders: 0, revenue: 0, commission: 0 }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Memuat referral links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Referral Links</h2>
          <p className="text-muted-foreground mt-1">Kelola dan pantau performa link referral Anda</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Buat Link Baru
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Klik</p>
                <p className="text-2xl font-bold">{totals.clicks.toLocaleString("id-ID")}</p>
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <MousePointerClick className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Pesanan</p>
                <p className="text-2xl font-bold">{totals.orders.toLocaleString("id-ID")}</p>
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Penjualan</p>
                <p className="text-2xl font-bold">Rp {(totals.revenue / 1000000).toFixed(1)}Jt</p>
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Komisi</p>
                <p className="text-2xl font-bold">Rp {(totals.commission / 1000).toFixed(0)}K</p>
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Link2 className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari link berdasarkan nama atau URL..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="paused">Dijeda</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchLinks}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links List */}
      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Link2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada link ditemukan</h3>
              <p className="text-muted-foreground mb-4">{searchQuery || filterStatus !== "all" ? "Coba ubah filter atau kata kunci pencarian" : "Mulai dengan membuat link referral pertama Anda"}</p>
              {!searchQuery && filterStatus === "all" && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Link Baru
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredLinks.map((link) => (
            <Card key={link.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Link Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{link.name}</h3>
                          <Badge variant={link.status === "active" ? "default" : "secondary"}>{link.status === "active" ? "Aktif" : "Dijeda"}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Link2 className="w-4 h-4" />
                          <span className="font-mono">{link.shortUrl}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleCopyLink(link.url)} className="h-6 px-2">
                            <Copy className="w-3 h-3" />
                            {copiedLink === link.url && <span className="ml-1 text-green-600">Tersalin!</span>}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Klik</p>
                        <p className="text-lg font-semibold">{link.clicks.toLocaleString("id-ID")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Pesanan</p>
                        <p className="text-lg font-semibold">{link.orders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Penjualan</p>
                        <p className="text-lg font-semibold">Rp {(link.revenue / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Komisi</p>
                        <p className="text-lg font-semibold">Rp {(link.commission / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Conversion</p>
                        <p className="text-lg font-semibold">{link.conversionRate}%</p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Dibuat: {new Date(link.createdAt).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Klik terakhir: {link.lastClick === "-" ? "-" : new Date(link.lastClick).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(link.url, "_blank")}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Buka
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => generateQRCode(link.url)}>
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(link.id)}>
                      {link.status === "active" ? "Jeda" : "Aktifkan"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteLink(link.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Buat Link Referral Baru</CardTitle>
              <CardDescription>Buat link unik untuk promosi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="linkName">Nama Link *</Label>
                <Input id="linkName" placeholder="Contoh: Instagram Bio Link" value={newLink.name} onChange={(e) => setNewLink({ ...newLink, name: e.target.value })} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="productId">Produk (Opsional)</Label>
                <Select value={newLink.productId} onValueChange={(value) => setNewLink({ ...newLink, productId: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih produk spesifik atau semua produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Produk</SelectItem>
                    <SelectItem value="prod1">Produk A</SelectItem>
                    <SelectItem value="prod2">Produk B</SelectItem>
                    <SelectItem value="prod3">Produk C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customSlug">Custom Slug (Opsional)</Label>
                <Input id="customSlug" placeholder="custom-slug" value={newLink.customSlug} onChange={(e) => setNewLink({ ...newLink, customSlug: e.target.value.toUpperCase() })} className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">Kosongkan untuk slug otomatis. Hanya huruf dan angka.</p>
              </div>

              {newLink.name && (
                <Alert>
                  <Link2 className="w-4 h-4" />
                  <AlertDescription>
                    Link preview: <span className="font-mono text-sm">example.com/{newLink.customSlug || "AUTO123"}</span>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewLink({ name: "", productId: "", customSlug: "" });
                  }}
                >
                  Batal
                </Button>
                <Button className="flex-1" onClick={handleCreateLink} disabled={!newLink.name}>
                  Buat Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
