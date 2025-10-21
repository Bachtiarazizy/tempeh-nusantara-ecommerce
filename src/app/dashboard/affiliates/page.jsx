"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, TrendingUp, DollarSign, Award, Search, Download, X, Mail, Eye, Edit, CheckCircle, XCircle, Clock } from "lucide-react";

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const statusLabels = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING: "Pending",
};

export default function AffiliateManagement() {
  const [affiliates, setAffiliates] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    totalOrders: 0,
    totalCommission: 0,
    pendingPayout: 0,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/admin/affiliates?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch affiliates");
      }

      const result = await response.json();

      if (result.success) {
        setAffiliates(result.data);
        setPagination(result.pagination);
        setStats(result.stats);
        setLeaderboard(result.leaderboard || []);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching affiliates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, [page, limit, filterStatus, searchQuery]);

  const updateAffiliateStatus = async (affiliateId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/affiliates/${affiliateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update affiliate status");
      }

      await fetchAffiliates();
      setSelectedAffiliate(null);
      toast.success("Status berhasil diupdate!");
    } catch (err) {
      console.error("Error updating affiliate:", err);
      toast.error("Gagal mengupdate status affiliate");
    }
  };

  const updateMonthlyGoal = async (affiliateId, newGoal) => {
    try {
      const response = await fetch(`/api/admin/affiliates/${affiliateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monthlyGoal: parseInt(newGoal) }),
      });

      if (!response.ok) {
        throw new Error("Failed to update monthly goal");
      }

      await fetchAffiliates();
      toast.success("Target bulanan berhasil diupdate!");
    } catch (err) {
      console.error("Error updating goal:", err);
      toast.error("Gagal mengupdate target bulanan");
    }
  };

  const fetchAffiliateDetail = async (affiliateId) => {
    try {
      const response = await fetch(`/api/admin/affiliates/${affiliateId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch affiliate detail");
      }

      const result = await response.json();

      if (result.success) {
        setSelectedAffiliate(result.data);
      }
    } catch (err) {
      console.error("Error fetching affiliate detail:", err);
      toast.error("Gagal memuat detail affiliate");
    }
  };

  if (loading && affiliates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data affiliate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-destructive mb-4 font-medium">Error: {error}</p>
            <Button onClick={fetchAffiliates} className="w-full">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Manajemen Affiliate</h1>
        <p className="text-muted-foreground text-sm md:text-base">Kelola affiliate, set goals, dan pantau performa secara real-time</p>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Affiliate</p>
            <p className="text-xl md:text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Inactive</p>
            <p className="text-xl md:text-2xl font-bold text-muted-foreground">{stats.inactive}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-xl md:text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Komisi</p>
            <p className="text-base md:text-lg font-bold text-primary">Rp {(stats.totalCommission / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Pending Payout</p>
            <p className="text-base md:text-lg font-bold text-amber-600">Rp {(stats.pendingPayout / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search - Responsive */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau kode referral..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => {
                  setFilterStatus("all");
                  setPage(1);
                }}
              >
                Semua
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "active" ? "default" : "outline"}
                onClick={() => {
                  setFilterStatus("active");
                  setPage(1);
                }}
              >
                Active
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => {
                  setFilterStatus("pending");
                  setPage(1);
                }}
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const url = `/api/admin/affiliates/export?${new URLSearchParams({
                    ...(filterStatus !== "all" && { status: filterStatus }),
                  })}`;
                  window.open(url, "_blank");
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Section - Responsive */}
      {leaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <CardTitle>Leaderboard Top Performers</CardTitle>
            </div>
            <CardDescription>Top 5 affiliate dengan performa terbaik bulan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((aff, index) => (
                <div key={aff.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                      index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-gray-300"
                    }`}
                  >
                    {aff.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{aff.user?.name || "N/A"}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{aff.totalOrders} pesanan</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm md:text-base">Rp {aff.totalCommission.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground hidden md:block">Total komisi</p>
                  </div>
                  {index < 3 && (
                    <div className="text-xl md:text-2xl flex-shrink-0">
                      {index === 0 && "👑"}
                      {index === 1 && "🥈"}
                      {index === 2 && "🥉"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Affiliates Table - Responsive */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Affiliate</CardTitle>
          <CardDescription>
            Menampilkan {affiliates.length} dari {pagination.total} affiliate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Affiliate</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Kode Referral</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Orders</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Komisi</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Progress Goal</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((aff) => (
                  <tr key={aff.id} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="py-4 px-4">
                      {aff.rank ? <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">{aff.rank}</div> : <span className="text-muted-foreground">-</span>}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{aff.user?.name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{aff.user?.email || "N/A"}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="px-2 py-1 bg-accent rounded text-sm">{aff.referralCode}</code>
                    </td>
                    <td className="py-4 px-4 font-medium">{aff.totalOrders || 0}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">Rp {(aff.totalCommission || 0).toLocaleString()}</p>
                        {aff.pendingCommission > 0 && <p className="text-xs text-amber-600">Pending: Rp {aff.pendingCommission.toLocaleString()}</p>}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-32">
                        <p className="text-sm mb-1 text-muted-foreground">
                          {aff.totalOrders || 0}/{aff.monthlyGoal || 0}
                        </p>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(((aff.totalOrders || 0) / (aff.monthlyGoal || 1)) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={statusColors[aff.status]}>{statusLabels[aff.status]}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline" onClick={() => fetchAffiliateDetail(aff.id)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {affiliates.map((aff) => (
              <Card key={aff.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {aff.rank ? (
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">{aff.rank}</div>
                      ) : (
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{aff.user?.name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{aff.user?.email || "N/A"}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[aff.status]}>{statusLabels[aff.status]}</Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Kode:</span>
                      <code className="px-2 py-0.5 bg-accent rounded text-xs">{aff.referralCode}</code>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orders:</span>
                      <span className="font-medium">{aff.totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Komisi:</span>
                      <span className="font-medium">Rp {(aff.totalCommission || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Progress: {aff.totalOrders || 0}/{aff.monthlyGoal || 0}
                    </p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(((aff.totalOrders || 0) / (aff.monthlyGoal || 1)) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" onClick={() => fetchAffiliateDetail(aff.id)} className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                ← Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}>
                Selanjutnya →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Detail Modal - Responsive */}
      {selectedAffiliate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b sticky top-0 bg-card z-10">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-xl md:text-2xl">{selectedAffiliate.user?.name || "N/A"}</CardTitle>
                  <CardDescription>
                    Bergabung:{" "}
                    {new Date(selectedAffiliate.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedAffiliate(null)} className="flex-shrink-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Informasi Kontak
                </h3>
                <div className="bg-accent/50 p-4 rounded-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedAffiliate.user?.email || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm text-muted-foreground">Telepon:</span>
                    <span className="font-medium">{selectedAffiliate.user?.phone || "N/A"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm text-muted-foreground">Kode Referral:</span>
                    <code className="font-mono bg-primary/10 text-primary px-3 py-1 rounded">{selectedAffiliate.referralCode}</code>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Link Referral:</span>
                    <code className="text-xs md:text-sm text-primary bg-primary/5 px-3 py-2 rounded break-all">https://tempenusantara.com/?ref={selectedAffiliate.referralCode}</code>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Statistik Performa
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">Total Klik</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{selectedAffiliate.totalClicks || 0}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300">{selectedAffiliate.totalOrders || 0}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                    <p className="text-sm text-purple-700 dark:text-purple-400 mb-1">Total Penjualan</p>
                    <p className="text-lg md:text-xl font-bold text-purple-900 dark:text-purple-300">Rp {(selectedAffiliate.totalSales || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg">
                    <p className="text-sm text-amber-700 dark:text-amber-400 mb-1">Total Komisi</p>
                    <p className="text-lg md:text-xl font-bold text-amber-900 dark:text-amber-300">Rp {(selectedAffiliate.totalCommission || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Commission Status */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Status Komisi
                </h3>
                <div className="bg-accent/50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Komisi Terbayar:</span>
                    <span className="font-semibold text-green-600 text-lg">Rp {(selectedAffiliate.paidCommission || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Komisi Pending:</span>
                    <span className="font-semibold text-amber-600 text-lg">Rp {(selectedAffiliate.pendingCommission || 0).toLocaleString()}</span>
                  </div>
                  {selectedAffiliate.pendingCommission > 0 && (
                    <Button size="sm" className="w-full mt-2">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Proses Pembayaran
                    </Button>
                  )}
                </div>
              </div>

              {/* Monthly Goal */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Target Bulanan
                </h3>
                <div className="bg-accent/50 p-4 rounded-lg space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label className="text-sm text-muted-foreground whitespace-nowrap">Target order/bulan:</label>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Input type="number" defaultValue={selectedAffiliate.monthlyGoal || 0} className="w-24" id={`goal-${selectedAffiliate.id}`} />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById(`goal-${selectedAffiliate.id}`);
                          updateMonthlyGoal(selectedAffiliate.id, input.value);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-muted-foreground">
                        Progress: {selectedAffiliate.totalOrders || 0}/{selectedAffiliate.monthlyGoal || 0}
                      </p>
                      <p className="text-sm font-semibold text-primary">{Math.round(((selectedAffiliate.totalOrders || 0) / (selectedAffiliate.monthlyGoal || 1)) * 100)}%</p>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{
                          width: `${Math.min(((selectedAffiliate.totalOrders || 0) / (selectedAffiliate.monthlyGoal || 1)) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              {selectedAffiliate.orders && selectedAffiliate.orders.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Order Terbaru</h3>
                  <div className="bg-accent/50 rounded-lg divide-y">
                    {selectedAffiliate.orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4">
                        <div className="flex-1">
                          <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.name || "N/A"}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-primary">Rp {order.total.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Aksi</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAffiliate.status === "PENDING" && (
                    <Button onClick={() => updateAffiliateStatus(selectedAffiliate.id, "ACTIVE")}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Affiliate
                    </Button>
                  )}
                  {selectedAffiliate.status === "ACTIVE" && (
                    <Button variant="outline" onClick={() => updateAffiliateStatus(selectedAffiliate.id, "INACTIVE")}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Nonaktifkan
                    </Button>
                  )}
                  {selectedAffiliate.status === "INACTIVE" && (
                    <Button onClick={() => updateAffiliateStatus(selectedAffiliate.id, "ACTIVE")}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aktifkan Kembali
                    </Button>
                  )}
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Kirim Email
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Semua Orders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
