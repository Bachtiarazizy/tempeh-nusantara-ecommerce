"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  DollarSign,
  ShoppingBag,
  MousePointerClick,
  Percent,
  RefreshCw,
  Trophy,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Flag,
  BarChart3,
  TrendingDown,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend, PolarAngleAxis } from "recharts";

export default function AffiliateGoalProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [newGoal, setNewGoal] = useState({
    type: "earnings",
    target: "",
    deadline: "",
    title: "",
  });

  useEffect(() => {
    fetchGoals();
  }, [selectedPeriod]);

  const fetchGoals = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = {
        overview: {
          activeGoals: 4,
          completedGoals: 12,
          totalProgress: 68,
          onTrackGoals: 3,
        },
        currentGoals: [
          {
            id: "1",
            title: "Target Earnings Bulan Ini",
            type: "earnings",
            target: 10000000,
            current: 5750000,
            progress: 57.5,
            deadline: "2024-10-31",
            status: "on-track",
            daysLeft: 7,
            trend: "up",
            icon: DollarSign,
            unit: "Rp",
            color: "from-green-400 to-emerald-600",
          },
          {
            id: "2",
            title: "100 Pesanan Target",
            type: "orders",
            target: 100,
            current: 73,
            progress: 73,
            deadline: "2024-10-31",
            status: "on-track",
            daysLeft: 7,
            trend: "up",
            icon: ShoppingBag,
            unit: "",
            color: "from-blue-400 to-blue-600",
          },
          {
            id: "3",
            title: "2000 Klik Bulan Ini",
            type: "clicks",
            target: 2000,
            current: 1580,
            progress: 79,
            deadline: "2024-10-31",
            status: "on-track",
            daysLeft: 7,
            trend: "up",
            icon: MousePointerClick,
            unit: "",
            color: "from-purple-400 to-purple-600",
          },
          {
            id: "4",
            title: "Conversion Rate 5%",
            type: "conversion",
            target: 5.0,
            current: 4.6,
            progress: 92,
            deadline: "2024-10-31",
            status: "at-risk",
            daysLeft: 7,
            trend: "stable",
            icon: Percent,
            unit: "%",
            color: "from-amber-400 to-orange-600",
          },
        ],
        completedGoals: [
          {
            id: "5",
            title: "50 Pesanan September",
            type: "orders",
            target: 50,
            achieved: 62,
            completedDate: "2024-09-28",
            overachieved: true,
            icon: ShoppingBag,
          },
          {
            id: "6",
            title: "Target 5Jt September",
            type: "earnings",
            target: 5000000,
            achieved: 4890000,
            completedDate: "2024-09-30",
            overachieved: false,
            icon: DollarSign,
          },
          {
            id: "7",
            title: "1500 Klik September",
            type: "clicks",
            target: 1500,
            achieved: 1680,
            completedDate: "2024-09-27",
            overachieved: true,
            icon: MousePointerClick,
          },
        ],
        milestones: [
          { name: "Bronze", target: 1000000, achieved: true, date: "2024-07-15" },
          { name: "Silver", target: 5000000, achieved: true, date: "2024-09-10" },
          { name: "Gold", target: 10000000, achieved: false, date: null },
          { name: "Platinum", target: 25000000, achieved: false, date: null },
          { name: "Diamond", target: 50000000, achieved: false, date: null },
        ],
        progressHistory: [
          { date: "Week 1", earnings: 1200000, orders: 18, clicks: 320 },
          { date: "Week 2", earnings: 2450000, orders: 32, clicks: 580 },
          { date: "Week 3", earnings: 3890000, orders: 51, clicks: 920 },
          { date: "Week 4", earnings: 5750000, orders: 73, clicks: 1580 },
        ],
        insights: [
          {
            type: "success",
            title: "Great Progress!",
            message: "Anda sudah mencapai 73% dari target pesanan bulan ini. Pertahankan momentum!",
            icon: TrendingUp,
          },
          {
            type: "warning",
            title: "Perhatian Conversion Rate",
            message: "Conversion rate masih 0.4% di bawah target. Fokus pada quality traffic.",
            icon: AlertCircle,
          },
          {
            type: "info",
            title: "7 Hari Tersisa",
            message: "Masih ada 7 hari untuk mencapai semua target bulan ini. Keep pushing!",
            icon: Clock,
          },
        ],
        recommendations: [
          "Tingkatkan promosi di platform dengan conversion rate tertinggi",
          "Fokus pada produk dengan komisi terbaik untuk maksimalkan earnings",
          "Optimalkan jam posting untuk meningkatkan engagement",
          "Buat konten berkualitas untuk meningkatkan conversion rate",
        ],
      };
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      alert("Mohon lengkapi semua field");
      return;
    }

    const goalData = {
      id: Date.now().toString(),
      title: newGoal.title,
      type: newGoal.type,
      target: parseFloat(newGoal.target),
      current: 0,
      progress: 0,
      deadline: newGoal.deadline,
      status: "on-track",
      daysLeft: Math.ceil((new Date(newGoal.deadline) - new Date()) / (1000 * 60 * 60 * 24)),
      trend: "stable",
      icon: newGoal.type === "earnings" ? DollarSign : newGoal.type === "orders" ? ShoppingBag : newGoal.type === "clicks" ? MousePointerClick : Percent,
      unit: newGoal.type === "earnings" ? "Rp" : newGoal.type === "conversion" ? "%" : "",
      color: "from-blue-400 to-blue-600",
    };

    setData({
      ...data,
      currentGoals: [goalData, ...data.currentGoals],
    });

    setShowCreateModal(false);
    setNewGoal({ type: "earnings", target: "", deadline: "", title: "" });
  };

  const handleDeleteGoal = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus goal ini?")) {
      setData({
        ...data,
        currentGoals: data.currentGoals.filter((goal) => goal.id !== id),
      });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      "on-track": { variant: "default", text: "On Track", class: "bg-green-500" },
      "at-risk": { variant: "secondary", text: "At Risk", class: "bg-amber-500" },
      behind: { variant: "destructive", text: "Behind", class: "bg-red-500" },
    };
    const config = variants[status] || variants["on-track"];
    return <Badge className={config.class}>{config.text}</Badge>;
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-500" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-500" />;
    return <ChevronRight className="w-4 h-4 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Memuat goal progress...</p>
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
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            Goal Progress
          </h2>
          <p className="text-muted-foreground mt-1">Tetapkan dan pantau target Anda</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">Bulan Ini</SelectItem>
              <SelectItem value="thisQuarter">Quarter Ini</SelectItem>
              <SelectItem value="thisYear">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchGoals}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Buat Goal
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Goal Aktif</p>
                <p className="text-3xl font-bold">{data.overview.activeGoals}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Goal Selesai</p>
                <p className="text-3xl font-bold">{data.overview.completedGoals}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progress Rata-rata</p>
                <p className="text-3xl font-bold">{data.overview.totalProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">On Track</p>
                <p className="text-3xl font-bold">
                  {data.overview.onTrackGoals}/{data.overview.activeGoals}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        {data.insights.map((insight, index) => {
          const Icon = insight.icon;
          const bgColors = {
            success: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800",
            warning: "bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
            info: "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
          };
          const iconColors = {
            success: "text-green-600 dark:text-green-500",
            warning: "text-amber-600 dark:text-amber-500",
            info: "text-blue-600 dark:text-blue-500",
          };
          return (
            <Card key={index} className={`border-2 ${bgColors[insight.type]}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-background`}>
                    <Icon className={`w-5 h-5 ${iconColors[insight.type]}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Goals */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Flag className="w-5 h-5" />
          Goal Aktif
        </h3>
        <div className="grid lg:grid-cols-2 gap-4">
          {data.currentGoals.map((goal) => {
            const Icon = goal.icon;
            return (
              <Card key={goal.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-12 h-12 bg-gradient-to-br ${goal.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{goal.title}</h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(goal.status)}
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {goal.daysLeft} hari tersisa
                          </span>
                          {getTrendIcon(goal.trend)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold">{goal.unit === "Rp" ? `${goal.unit} ${goal.current.toLocaleString("id-ID")}` : `${goal.current}${goal.unit}`}</p>
                        <p className="text-sm text-muted-foreground">Target: {goal.unit === "Rp" ? `${goal.unit} ${goal.target.toLocaleString("id-ID")}` : `${goal.target}${goal.unit}`}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">{goal.progress.toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">Progress</p>
                      </div>
                    </div>

                    <Progress value={goal.progress} className="h-3" />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sisa: {goal.unit === "Rp" ? `${goal.unit} ${(goal.target - goal.current).toLocaleString("id-ID")}` : `${(goal.target - goal.current).toFixed(1)}${goal.unit}`}</span>
                      <span className="text-muted-foreground">Deadline: {new Date(goal.deadline).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Progress Mingguan</CardTitle>
          <CardDescription>Perkembangan goal Anda dalam 4 minggu terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.progressHistory}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" fontSize={12} tick={{ fill: "currentColor" }} className="text-muted-foreground" />
              <YAxis fontSize={12} tick={{ fill: "currentColor" }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" name="Earnings" />
              <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrders)" name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="completed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="completed">Goal Selesai</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
        </TabsList>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Goal yang Telah Diselesaikan</CardTitle>
              <CardDescription>Riwayat pencapaian goal Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.completedGoals.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-green-600 dark:text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{goal.title}</h4>
                            {goal.overachieved && (
                              <Badge className="bg-amber-500">
                                <Trophy className="w-3 h-3 mr-1" />
                                Overachieved!
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Target: {goal.target} • Achieved: {goal.achieved}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">{new Date(goal.completedDate).toLocaleDateString("id-ID")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Milestones Lifetime</CardTitle>
              <CardDescription>Pencapaian besar dalam perjalanan affiliate Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 border-2 rounded-lg ${milestone.achieved ? "border-primary bg-primary/5" : "border-border opacity-60"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${milestone.achieved ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{milestone.achieved ? "✓" : "🔒"}</div>
                      <div>
                        <h4 className="font-bold text-lg">{milestone.name} Milestone</h4>
                        <p className="text-sm text-muted-foreground">Target: Rp {milestone.target.toLocaleString("id-ID")} total earnings</p>
                        {milestone.achieved && milestone.date && <p className="text-xs text-primary font-medium mt-1">Achieved on {new Date(milestone.date).toLocaleDateString("id-ID")}</p>}
                      </div>
                    </div>
                    {milestone.achieved ? (
                      <Award className="w-8 h-8 text-primary" />
                    ) : (
                      <div className="text-muted-foreground">
                        <Sparkles className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Rekomendasi untuk Mencapai Goal</CardTitle>
              <CardDescription>Tips dan strategi untuk memaksimalkan performa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm flex-1">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Buat Goal Baru</CardTitle>
              <CardDescription>Tetapkan target dan deadline untuk goal Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goalTitle">Judul Goal *</Label>
                <Input id="goalTitle" placeholder="Contoh: Target 100 Pesanan" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="goalType">Tipe Goal *</Label>
                <Select value={newGoal.type} onValueChange={(value) => setNewGoal({ ...newGoal, type: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="earnings">Earnings (Rp)</SelectItem>
                    <SelectItem value="orders">Orders (Jumlah)</SelectItem>
                    <SelectItem value="clicks">Clicks (Jumlah)</SelectItem>
                    <SelectItem value="conversion">Conversion Rate (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goalTarget">Target {newGoal.type === "earnings" ? "(Rp)" : newGoal.type === "conversion" ? "(%)" : "(Jumlah)"} *</Label>
                <Input
                  id="goalTarget"
                  type="number"
                  placeholder={newGoal.type === "earnings" ? "10000000" : newGoal.type === "conversion" ? "5.0" : "100"}
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="goalDeadline">Deadline *</Label>
                <Input id="goalDeadline" type="date" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} className="mt-1" min={new Date().toISOString().split("T")[0]} />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewGoal({ type: "earnings", target: "", deadline: "", title: "" });
                  }}
                >
                  Batal
                </Button>
                <Button className="flex-1" onClick={handleCreateGoal} disabled={!newGoal.title || !newGoal.target || !newGoal.deadline}>
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
