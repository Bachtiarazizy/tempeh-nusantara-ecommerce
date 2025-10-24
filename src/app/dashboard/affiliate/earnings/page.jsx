"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Download, RefreshCw, Calendar, CreditCard, Clock, CheckCircle2, XCircle, AlertCircle, ArrowUpRight, ArrowDownRight, FileText, Banknote } from "lucide-react";

export default function AffiliateEarnings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data - replace with actual API call
  useEffect(() => {
    fetchEarnings();
  }, [selectedPeriod]);

  const fetchEarnings = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = {
        balance: {
          available: 5750000,
          pending: 2340000,
          total: 8090000,
          lastPayout: 3500000,
          nextPayout: 5750000,
          nextPayoutDate: "2024-11-01",
        },
        summary: {
          thisMonth: 5750000,
          lastMonth: 4890000,
          growth: 17.6,
          totalLifetime: 45600000,
          averagePerMonth: 3800000,
        },
        monthlyEarnings: [
          { month: "Mei", earnings: 2450000, orders: 32, commission: 2450000 },
          { month: "Jun", earnings: 3120000, orders: 41, commission: 3120000 },
          { month: "Jul", earnings: 3890000, orders: 48, commission: 3890000 },
          { month: "Agu", earnings: 4230000, orders: 56, commission: 4230000 },
          { month: "Sep", earnings: 4890000, orders: 62, commission: 4890000 },
          { month: "Okt", earnings: 5750000, orders: 73, commission: 5750000 },
        ],
        transactions: [
          {
            id: "TRX001",
            type: "commission",
            description: "Komisi dari 15 pesanan",
            amount: 1250000,
            status: "completed",
            date: "2024-10-24",
            orderId: "ORD-2024-1024",
          },
          {
            id: "TRX002",
            type: "commission",
            description: "Komisi dari 8 pesanan",
            amount: 680000,
            status: "completed",
            date: "2024-10-23",
            orderId: "ORD-2024-1023",
          },
          {
            id: "TRX003",
            type: "payout",
            description: "Penarikan ke Bank BCA",
            amount: -3500000,
            status: "completed",
            date: "2024-10-20",
            payoutMethod: "Bank Transfer",
          },
          {
            id: "TRX004",
            type: "commission",
            description: "Komisi dari 12 pesanan",
            amount: 990000,
            status: "pending",
            date: "2024-10-22",
            orderId: "ORD-2024-1022",
          },
          {
            id: "TRX005",
            type: "commission",
            description: "Komisi dari 20 pesanan",
            amount: 1650000,
            status: "completed",
            date: "2024-10-21",
            orderId: "ORD-2024-1021",
          },
        ],
        payoutHistory: [
          {
            id: "PAY001",
            amount: 3500000,
            status: "completed",
            date: "2024-10-20",
            method: "Bank BCA - 1234567890",
            processedDate: "2024-10-21",
            fee: 0,
          },
          {
            id: "PAY002",
            amount: 4200000,
            status: "completed",
            date: "2024-09-20",
            method: "Bank BCA - 1234567890",
            processedDate: "2024-09-21",
            fee: 0,
          },
          {
            id: "PAY003",
            amount: 2800000,
            status: "completed",
            date: "2024-08-20",
            method: "Bank Mandiri - 9876543210",
            processedDate: "2024-08-21",
            fee: 0,
          },
        ],
        commissionBreakdown: [
          { category: "Produk A", amount: 2340000, percentage: 40.7, orders: 28 },
          { category: "Produk B", amount: 1725000, percentage: 30.0, orders: 21 },
          { category: "Produk C", amount: 1035000, percentage: 18.0, orders: 15 },
          { category: "Produk D", amount: 650000, percentage: 11.3, orders: 9 },
        ],
      };
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleRequestPayout = () => {
    alert("Request penarikan akan diproses. Minimum penarikan: Rp 100.000");
  };

  const handleExport = () => {
    if (!data) return;

    let csv = "Type,Description,Amount,Status,Date\n";
    data.transactions.forEach((trx) => {
      csv += `${trx.type},${trx.description},${trx.amount},${trx.status},${trx.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: { variant: "default", icon: CheckCircle2, text: "Selesai" },
      pending: { variant: "secondary", icon: Clock, text: "Pending" },
      failed: { variant: "destructive", icon: XCircle, text: "Gagal" },
      processing: { variant: "secondary", icon: AlertCircle, text: "Diproses" },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Memuat data earnings...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Earnings</h2>
          <p className="text-muted-foreground mt-1">Kelola dan pantau penghasilan affiliate Anda</p>
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
              <SelectItem value="thisYear">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => fetchEarnings()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Tersedia</p>
                <p className="text-3xl font-bold">Rp {data.balance.available.toLocaleString("id-ID")}</p>
                <p className="text-xs text-muted-foreground mt-2">Siap ditarik</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <Button className="w-full" onClick={handleRequestPayout}>
              <Banknote className="w-4 h-4 mr-2" />
              Request Penarikan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Pending</p>
                <p className="text-3xl font-bold">Rp {data.balance.pending.toLocaleString("id-ID")}</p>
                <p className="text-xs text-muted-foreground mt-2">Menunggu verifikasi</p>
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earning</p>
                <p className="text-3xl font-bold">Rp {data.balance.total.toLocaleString("id-ID")}</p>
                <p className="text-xs text-muted-foreground mt-2">Bulan ini</p>
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bulan Ini</p>
                <p className="text-2xl font-bold">Rp {(data.summary.thisMonth / 1000).toFixed(0)}K</p>
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${data.summary.growth >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                {data.summary.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(data.summary.growth).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">vs Rp {(data.summary.lastMonth / 1000).toFixed(0)}K bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Lifetime</p>
            <p className="text-2xl font-bold">Rp {(data.summary.totalLifetime / 1000000).toFixed(1)}Jt</p>
            <p className="text-xs text-muted-foreground mt-2">Sejak bergabung</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Rata-rata/Bulan</p>
            <p className="text-2xl font-bold">Rp {(data.summary.averagePerMonth / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground mt-2">6 bulan terakhir</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Penarikan Berikutnya</p>
            <p className="text-2xl font-bold">Rp {(data.balance.nextPayout / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground mt-2">
              <Calendar className="w-3 h-3 inline mr-1" />
              {new Date(data.balance.nextPayoutDate).toLocaleDateString("id-ID")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Penghasilan</CardTitle>
            <CardDescription>Perkembangan earnings 6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthlyEarnings}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: "currentColor" }} className="text-muted-foreground" />
                <YAxis fontSize={12} tick={{ fill: "currentColor" }} className="text-muted-foreground" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}Jt`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => [`Rp ${value.toLocaleString("id-ID")}`, "Earnings"]}
                />
                <Area type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Commission Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Breakdown Komisi</CardTitle>
            <CardDescription>Distribusi komisi per kategori produk</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.commissionBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" fontSize={12} tick={{ fill: "currentColor" }} className="text-muted-foreground" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="category" fontSize={12} tick={{ fill: "currentColor" }} className="text-muted-foreground" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value) => [`Rp ${value.toLocaleString("id-ID")}`, "Komisi"]}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Transactions and Payout History */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Transaksi Terbaru</TabsTrigger>
          <TabsTrigger value="payouts">Riwayat Penarikan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaksi Terbaru</CardTitle>
              <CardDescription>Riwayat komisi dan penarikan terbaru</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === "commission" ? "bg-green-100 dark:bg-green-900/20" : "bg-blue-100 dark:bg-blue-900/20"}`}>
                        {transaction.type === "commission" ? <ArrowDownRight className="w-5 h-5 text-green-600 dark:text-green-500" /> : <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{transaction.description}</p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(transaction.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          {transaction.orderId && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {transaction.orderId}
                            </span>
                          )}
                          {transaction.payoutMethod && (
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              {transaction.payoutMethod}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.amount > 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                        {transaction.amount > 0 ? "+" : ""}Rp {Math.abs(transaction.amount).toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-muted-foreground">{transaction.type === "commission" ? "Komisi" : "Penarikan"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Penarikan</CardTitle>
              <CardDescription>Daftar semua penarikan yang telah dilakukan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.payoutHistory.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{payout.method}</p>
                          {getStatusBadge(payout.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Request: {new Date(payout.date).toLocaleDateString("id-ID")}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Diproses: {new Date(payout.processedDate).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">Rp {payout.amount.toLocaleString("id-ID")}</p>
                      <p className="text-xs text-muted-foreground">Fee: Rp {payout.fee.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                ))}
              </div>

              {data.payoutHistory.length === 0 && (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada riwayat penarikan</h3>
                  <p className="text-muted-foreground mb-4">Mulai tarik penghasilan Anda ketika saldo mencapai minimum</p>
                  <Button onClick={handleRequestPayout}>
                    <Banknote className="w-4 h-4 mr-2" />
                    Request Penarikan Pertama
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Informasi Penting</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Minimum penarikan adalah Rp 100.000</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Penarikan akan diproses dalam 1-3 hari kerja</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Komisi akan tersedia setelah pesanan dikonfirmasi diterima (biasanya 7-14 hari)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Tidak ada biaya admin untuk penarikan</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
