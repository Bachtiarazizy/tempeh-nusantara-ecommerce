"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Eye, ShoppingBag, DollarSign, Target, Copy, Check, ExternalLink, Calendar } from "lucide-react";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels = {
  PENDING: "Pending",
  PAID: "Dibayar",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  DELIVERED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function AffiliateDashboard() {
  const [data, setData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [period, setPeriod] = useState("30d");

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboard();
  }, []);

  // Fetch stats when period changes
  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/affiliate/dashboard");
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch(`/api/affiliate/stats?period=${period}`);
      const result = await response.json();

      if (result.success) {
        setStatsData(result.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!data) return;
    const link = `${window.location.origin}/?ref=${data.user.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    if (!data) return;
    const link = `${window.location.origin}/?ref=${data.user.referralCode}`;
    const message = `Halo! Yuk belanja produk berkualitas dengan diskon spesial melalui link referral saya: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchDashboard}>Coba Lagi</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const progressPercentage = (data.stats.monthlyOrders / data.stats.monthlyGoal) * 100;
  const isGoalReached = progressPercentage >= 100;
  const isNearGoal = progressPercentage >= 80 && progressPercentage < 100;

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-primary to-purple-600 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white opacity-5 rounded-full"></div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl lg:text-4xl font-bold">Halo, {data.user.name}! 👋</h1>
                {data.stats.currentRank && data.stats.currentRank <= 10 && <Badge className="bg-yellow-400 text-yellow-900 text-lg px-3 py-1">🏆 Rank #{data.stats.currentRank}</Badge>}
              </div>
              <p className="text-blue-100 mb-2">
                Bergabung sejak{" "}
                {new Date(data.user.joinDate).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {data.user.status}
                </Badge>
                <span className="text-blue-100">•</span>
                <span className="text-blue-100">Komisi Rate: {data.stats.commissionRate}%</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 min-w-[280px]">
              <p className="text-blue-100 text-sm mb-2">Total Komisi Bulan Ini</p>
              <p className="text-4xl font-bold mb-1">Rp {data.stats.monthlyCommission.toLocaleString("id-ID")}</p>
              <p className="text-blue-100 text-sm">dari {data.stats.monthlyOrders} pesanan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Total Klik</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{data.stats.totalClicks.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-blue-600">{data.stats.monthlyClicks}</span>
                  <span className="text-gray-500">bulan ini</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{data.stats.totalOrders.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-green-600">{data.stats.monthlyOrders}</span>
                  <span className="text-gray-500">bulan ini</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Total Komisi</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">Rp {(data.stats.totalCommission / 1000000).toFixed(1)}M</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-500">sepanjang waktu</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{data.stats.conversionRate}%</p>
                <div className="flex items-center gap-1 text-sm">
                  {data.stats.conversionRate > 1 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Bagus!</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Tingkatkan!</span>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goal Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress Target Bulanan</CardTitle>
            <CardDescription>Target: {data.stats.monthlyGoal} pesanan per bulan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Progress Bulan Ini</span>
                <span className="text-sm text-gray-600">
                  {data.stats.monthlyOrders}/{data.stats.monthlyGoal} pesanan
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className={`h-4 rounded-full transition-all duration-700 ${isGoalReached ? "bg-green-500" : isNearGoal ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">{Math.round(progressPercentage)}%</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{Math.round(progressPercentage)}% tercapai</span>
                <span className="text-gray-600">{Math.max(0, data.stats.monthlyGoal - data.stats.monthlyOrders)} lagi untuk target</span>
              </div>
            </div>

            {isGoalReached && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <p className="font-semibold text-green-900 mb-1">Selamat! Target bulanan tercapai!</p>
                    <p className="text-sm text-green-700">Anda berhak mendapat bonus pencapaian target bulan ini!</p>
                  </div>
                </div>
              </div>
            )}

            {isNearGoal && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Hampir tercapai!</p>
                    <p className="text-sm text-amber-700">Tinggal sedikit lagi untuk mendapatkan bonus target!</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commission Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Komisi</CardTitle>
            <CardDescription>Status pembayaran komisi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-green-700">Terbayar</p>
                    <p className="text-2xl font-bold text-green-900">Rp {data.stats.paidCommission.toLocaleString("id-ID")}</p>
                  </div>
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-amber-700">Pending</p>
                    <p className="text-2xl font-bold text-amber-900">Rp {data.stats.pendingCommission.toLocaleString("id-ID")}</p>
                  </div>
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Info:</strong> Komisi dibayar setiap tanggal 1 dan 15 setiap bulan setelah pesanan dikonfirmasi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Section */}
      <Card>
        <CardHeader>
          <CardTitle>Link Referral Anda</CardTitle>
          <CardDescription>Bagikan link ini untuk mendapatkan komisi {data.stats.commissionRate}% dari setiap pembelian</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={`${window.location.origin}/?ref=${data.user.referralCode}`} readOnly className="flex-1 font-mono text-sm bg-gray-50" />
            <Button onClick={copyReferralLink} variant={copied ? "default" : "outline"}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={shareToWhatsApp} className="bg-green-600 hover:bg-green-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-900 text-sm mb-2">💡 Tips Promosi</p>
              <p className="text-xs text-blue-700">Bagikan di WhatsApp, Instagram Story, atau website pribadi untuk hasil maksimal!</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-900 text-sm mb-2">📱 Kode Referral</p>
              <p className="text-lg font-mono font-bold text-green-700">{data.user.referralCode}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="font-semibold text-purple-900 text-sm mb-2">🎯 Komisi Rate</p>
              <p className="text-lg font-bold text-purple-700">{data.stats.commissionRate}% per transaksi</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Chart */}
      {statsData && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Analytics & Performa</CardTitle>
                <CardDescription>Statistik klik, pesanan, dan komisi periode {period}</CardDescription>
              </div>
              <div className="flex gap-2">
                {["7d", "30d", "90d"].map((p) => (
                  <Button key={p} variant={period === p ? "default" : "outline"} size="sm" onClick={() => setPeriod(p)} disabled={statsLoading}>
                    {p === "7d" && "7 Hari"}
                    {p === "30d" && "30 Hari"}
                    {p === "90d" && "90 Hari"}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-blue-700 mb-1">Total Klik</p>
                    <p className="text-2xl font-bold text-blue-900">{statsData.summary.totalClicks}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-green-700 mb-1">Total Order</p>
                    <p className="text-2xl font-bold text-green-900">{statsData.summary.totalOrders}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs text-purple-700 mb-1">Total Komisi</p>
                    <p className="text-xl font-bold text-purple-900">Rp {(statsData.summary.totalCommission / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <p className="text-xs text-amber-700 mb-1">Avg. Order</p>
                    <p className="text-xl font-bold text-amber-900">Rp {(statsData.summary.avgOrderValue / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={statsData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="date"
                      fontSize={12}
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("id-ID", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis fontSize={12} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "commission" || name === "sales") {
                          return [`Rp ${value.toLocaleString("id-ID")}`, name];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString("id-ID")}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} name="Klik" />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Pesanan" />
                    <Line type="monotone" dataKey="commission" stroke="#8b5cf6" strokeWidth={2} name="Komisi" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <CardDescription>{data.recentOrders.length} pesanan terakhir dari referral Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Belum ada pesanan</p>
                  <p className="text-sm text-gray-500 mt-1">Bagikan link referral Anda untuk mendapatkan pesanan pertama!</p>
                </div>
              ) : (
                data.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                        <Badge className={statusColors[order.status]} variant="secondary">
                          {statusLabels[order.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-gray-900">Rp {order.total.toLocaleString("id-ID")}</p>
                      <p className="text-sm text-green-600 font-medium">+Rp {order.commission.toLocaleString("id-ID")}</p>
                      <p className="text-xs text-gray-500">komisi</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {data.recentOrders.length > 0 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  Lihat Semua Pesanan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Top 10 affiliate bulan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.leaderboard.slice(0, 10).map((affiliate) => (
                <div key={affiliate.rank} className={`flex items-center justify-between p-3 rounded-lg ${affiliate.isCurrentUser ? "bg-blue-50 border-2 border-blue-300" : "bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        affiliate.rank === 1 ? "bg-yellow-500" : affiliate.rank === 2 ? "bg-gray-400" : affiliate.rank === 3 ? "bg-amber-600" : "bg-gray-300"
                      }`}
                    >
                      {affiliate.rank}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${affiliate.isCurrentUser ? "text-blue-900" : "text-gray-900"}`}>
                        {affiliate.name}
                        {affiliate.isCurrentUser && <span className="text-blue-600 ml-1">(Anda)</span>}
                      </p>
                      <p className="text-xs text-gray-600">{affiliate.orders} pesanan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">Rp {(affiliate.commission / 1000).toFixed(0)}K</p>
                    {affiliate.rank <= 3 && (
                      <span className="text-lg">
                        {affiliate.rank === 1 && "👑"}
                        {affiliate.rank === 2 && "🥈"}
                        {affiliate.rank === 3 && "🥉"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
