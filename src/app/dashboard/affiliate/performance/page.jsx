"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Download, RefreshCw, Eye, ShoppingBag, DollarSign, Target } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AffiliatePerformance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");

  useEffect(() => {
    fetchPerformance();
  }, [selectedPeriod]);

  const fetchPerformance = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`/api/affiliate/performance?period=${selectedPeriod}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error fetching performance:", err);
      setError("Gagal memuat data performa");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchPerformance(true);
  };

  const handleExport = () => {
    if (!data) return;

    // Create CSV content
    let csv = "Metric,Value\n";
    csv += `Period,${selectedPeriod}\n`;
    csv += `Total Clicks,${data.overview.current.clicks}\n`;
    csv += `Total Orders,${data.overview.current.orders}\n`;
    csv += `Total Sales,${data.overview.current.sales}\n`;
    csv += `Total Commission,${data.overview.current.commission}\n`;
    csv += `Conversion Rate,${data.overview.current.conversionRate}%\n\n`;

    csv += "Month,Clicks,Orders,Sales,Commission\n";
    data.monthlyData.forEach((month) => {
      csv += `${month.month},${month.clicks},${month.orders},${month.sales},${month.commission}\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `affiliate-performance-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatGrowth = (value) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data performa...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchPerformance()}>Coba Lagi</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analisis Performa</h2>
          <p className="text-gray-600 mt-1">Pantau detail performa affiliate Anda</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">Bulan Ini</SelectItem>
              <SelectItem value="lastMonth">Bulan Lalu</SelectItem>
              <SelectItem value="last3Months">3 Bulan Terakhir</SelectItem>
              <SelectItem value="last6Months">6 Bulan Terakhir</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              {formatGrowth(data.overview.growth.clicks)}
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Klik</p>
            <p className="text-3xl font-bold text-gray-900">{data.overview.current.clicks.toLocaleString("id-ID")}</p>
            <p className="text-xs text-gray-500 mt-2">vs {data.overview.previous.clicks.toLocaleString("id-ID")} periode sebelumnya</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              {formatGrowth(data.overview.growth.orders)}
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
            <p className="text-3xl font-bold text-gray-900">{data.overview.current.orders.toLocaleString("id-ID")}</p>
            <p className="text-xs text-gray-500 mt-2">vs {data.overview.previous.orders} periode sebelumnya</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              {formatGrowth(data.overview.growth.commission)}
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Komisi</p>
            <p className="text-3xl font-bold text-gray-900">Rp {(data.overview.current.commission / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500 mt-2">vs Rp {(data.overview.previous.commission / 1000).toFixed(0)}K sebelumnya</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
              {formatGrowth(data.overview.growth.conversionRate)}
            </div>
            <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-gray-900">{data.overview.current.conversionRate}%</p>
            <p className="text-xs text-gray-500 mt-2">vs {data.overview.previous.conversionRate}% sebelumnya</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Performa Bulanan</CardTitle>
            <CardDescription>Perkembangan klik, pesanan, dan komisi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: "#6b7280" }} />
                <YAxis fontSize={12} tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => {
                    if (name === "commission" || name === "sales") {
                      return [`Rp ${value.toLocaleString("id-ID")}`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} name="Klik" dot={{ fill: "#3b82f6", r: 4 }} />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Pesanan" dot={{ fill: "#10b981", r: 4 }} />
                <Line type="monotone" dataKey="commission" stroke="#8b5cf6" strokeWidth={2} name="Komisi (Rp)" dot={{ fill: "#8b5cf6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Perbandingan Bulanan</CardTitle>
            <CardDescription>Komparasi penjualan dan komisi per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: "#6b7280" }} />
                <YAxis fontSize={12} tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="Penjualan" radius={[8, 8, 0, 0]} />
                <Bar dataKey="commission" fill="#10b981" name="Komisi" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
            <CardDescription>Top 10 produk dengan penjualan terbaik dari referral Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topProducts.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Belum ada data produk</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 text-white font-bold ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-gray-300"}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          {product.orders} pesanan • {product.quantity} unit
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-green-600">Rp {product.commission.toLocaleString("id-ID")}</p>
                      <p className="text-xs text-gray-500">dari Rp {product.sales.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sumber Traffic</CardTitle>
            <CardDescription>Distribusi asal klik</CardDescription>
          </CardHeader>
          <CardContent>
            {data.trafficSources.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Belum ada data traffic</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data.trafficSources} cx="50%" cy="50%" labelLine={false} label={({ percentage }) => `${percentage}%`} outerRadius={80} fill="#8884d8" dataKey="percentage">
                      {data.trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {data.trafficSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="font-medium text-gray-700">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{source.clicks}</span>
                        <span className="text-gray-500 text-xs ml-1">klik</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Sumber Traffic</CardTitle>
          <CardDescription>Breakdown lengkap asal klik dan konversi per platform</CardDescription>
        </CardHeader>
        <CardContent>
          {data.trafficSources.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Belum ada data traffic</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.trafficSources.map((source, index) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <div>
                        <span className="font-semibold text-gray-900">{source.source}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {source.orders} pesanan
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{source.clicks}</span>
                      <span className="text-sm text-gray-600 ml-1">klik</span>
                      <span className="text-sm text-gray-500 ml-2">({source.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${source.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Conversion: {source.clicks > 0 ? ((source.orders / source.clicks) * 100).toFixed(2) : 0}%</span>
                    <span>
                      {source.orders} dari {source.clicks} klik
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle>Ringkasan Performa</CardTitle>
          <CardDescription>Insight dan rekomendasi untuk meningkatkan performa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Best Performing Source */}
            {data.trafficSources.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Sumber Terbaik</p>
                    <p className="text-lg font-bold text-blue-900">{data.trafficSources[0].source}</p>
                    <p className="text-xs text-gray-600">
                      {data.trafficSources[0].clicks} klik • {data.trafficSources[0].orders} pesanan
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Best Product */}
            {data.topProducts.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Produk Terlaris</p>
                    <p className="text-lg font-bold text-green-900 truncate max-w-[200px]">{data.topProducts[0].name}</p>
                    <p className="text-xs text-gray-600">
                      {data.topProducts[0].orders} pesanan • Rp {data.topProducts[0].commission.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Status */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Status Performa</p>
                  <p className="text-lg font-bold text-purple-900">{data.overview.growth.commission > 0 ? "Meningkat" : "Perlu Ditingkatkan"}</p>
                  <p className="text-xs text-gray-600">{data.overview.growth.commission > 0 ? `+${data.overview.growth.commission.toFixed(1)}% vs periode lalu` : "Tingkatkan promosi Anda"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-gray-900">💡 Rekomendasi:</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {parseFloat(data.overview.current.conversionRate) < 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-amber-900 mb-1">Tingkatkan Conversion Rate</p>
                  <p className="text-xs text-amber-700">Conversion rate Anda saat ini {data.overview.current.conversionRate}%. Coba targetkan audience yang lebih spesifik.</p>
                </div>
              )}

              {data.trafficSources.length < 3 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 mb-1">Diversifikasi Traffic</p>
                  <p className="text-xs text-blue-700">Bagikan link referral di lebih banyak platform untuk meningkatkan jangkauan.</p>
                </div>
              )}

              {data.overview.growth.clicks < 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-900 mb-1">Klik Menurun</p>
                  <p className="text-xs text-red-700">Klik menurun {Math.abs(data.overview.growth.clicks).toFixed(1)}%. Tingkatkan aktivitas promosi Anda.</p>
                </div>
              )}

              {data.overview.growth.commission > 20 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-900 mb-1">🎉 Performa Excellent!</p>
                  <p className="text-xs text-green-700">Komisi naik {data.overview.growth.commission.toFixed(1)}%! Pertahankan strategi promosi Anda.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
