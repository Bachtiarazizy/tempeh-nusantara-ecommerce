"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, TrendingUp, Crown, Award, Target, Zap, Star, ChevronUp, ChevronDown, Minus, RefreshCw, Users, DollarSign, ShoppingBag, MousePointerClick, Gift, Sparkles, CheckCircle2 } from "lucide-react";

export default function AffiliateLeaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [selectedCategory, setSelectedCategory] = useState("earnings");

  // Mock data - replace with actual API call
  useEffect(() => {
    fetchLeaderboard();
  }, [selectedPeriod, selectedCategory]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = {
        myStats: {
          rank: 8,
          previousRank: 12,
          name: "Anda",
          avatar: null,
          earnings: 5750000,
          orders: 73,
          clicks: 1580,
          conversionRate: 4.6,
          points: 8450,
          badge: "Gold",
          progress: 65, // Progress to next rank
          nextRankPoints: 10000,
        },
        topPerformers: [
          {
            rank: 1,
            name: "Ahmad Ramadhan",
            avatar: null,
            earnings: 15750000,
            orders: 198,
            clicks: 4320,
            conversionRate: 4.6,
            points: 22500,
            badge: "Diamond",
            change: 0,
          },
          {
            rank: 2,
            name: "Siti Nurhaliza",
            avatar: null,
            earnings: 13240000,
            orders: 176,
            clicks: 3890,
            conversionRate: 4.5,
            points: 19800,
            badge: "Diamond",
            change: 1,
          },
          {
            rank: 3,
            name: "Budi Santoso",
            avatar: null,
            earnings: 11890000,
            orders: 165,
            clicks: 3650,
            conversionRate: 4.5,
            points: 18200,
            badge: "Platinum",
            change: -1,
          },
          {
            rank: 4,
            name: "Dewi Kartika",
            avatar: null,
            earnings: 10340000,
            orders: 142,
            clicks: 3120,
            conversionRate: 4.6,
            points: 16100,
            badge: "Platinum",
            change: 2,
          },
          {
            rank: 5,
            name: "Eko Prasetyo",
            avatar: null,
            earnings: 9650000,
            orders: 128,
            clicks: 2890,
            conversionRate: 4.4,
            points: 14800,
            badge: "Platinum",
            change: 0,
          },
          {
            rank: 6,
            name: "Fitri Handayani",
            avatar: null,
            earnings: 8920000,
            orders: 115,
            clicks: 2650,
            conversionRate: 4.3,
            points: 13500,
            badge: "Gold",
            change: -2,
          },
          {
            rank: 7,
            name: "Hendra Wijaya",
            avatar: null,
            earnings: 7430000,
            orders: 98,
            clicks: 2210,
            conversionRate: 4.4,
            points: 11200,
            badge: "Gold",
            change: 1,
          },
          {
            rank: 8,
            name: "Anda",
            avatar: null,
            earnings: 5750000,
            orders: 73,
            clicks: 1580,
            conversionRate: 4.6,
            points: 8450,
            badge: "Gold",
            change: 4,
            isCurrentUser: true,
          },
          {
            rank: 9,
            name: "Indah Permatasari",
            avatar: null,
            earnings: 5120000,
            orders: 68,
            clicks: 1450,
            conversionRate: 4.7,
            points: 7800,
            badge: "Gold",
            change: -1,
          },
          {
            rank: 10,
            name: "Joko Widodo",
            avatar: null,
            earnings: 4890000,
            orders: 62,
            clicks: 1390,
            conversionRate: 4.5,
            points: 7200,
            badge: "Silver",
            change: 0,
          },
        ],
        badges: [
          {
            name: "Diamond",
            icon: "💎",
            minPoints: 20000,
            color: "from-cyan-400 to-blue-500",
            benefits: ["20% bonus komisi", "Priority support", "Exclusive products"],
          },
          {
            name: "Platinum",
            icon: "⭐",
            minPoints: 15000,
            color: "from-gray-300 to-gray-400",
            benefits: ["15% bonus komisi", "Priority support", "Early access"],
          },
          {
            name: "Gold",
            icon: "🥇",
            minPoints: 8000,
            color: "from-yellow-400 to-yellow-600",
            benefits: ["10% bonus komisi", "Special events", "Badge display"],
          },
          {
            name: "Silver",
            icon: "🥈",
            minPoints: 5000,
            color: "from-gray-400 to-gray-500",
            benefits: ["5% bonus komisi", "Community access"],
          },
          {
            name: "Bronze",
            icon: "🥉",
            minPoints: 0,
            color: "from-orange-400 to-orange-600",
            benefits: ["Standard benefits"],
          },
        ],
        achievements: [
          { id: 1, name: "First Sale", icon: "🎯", unlocked: true, description: "Dapatkan penjualan pertama" },
          { id: 2, name: "10 Sales Streak", icon: "🔥", unlocked: true, description: "10 penjualan berturut-turut" },
          { id: 3, name: "Top 10", icon: "🏆", unlocked: true, description: "Masuk ke 10 besar" },
          { id: 4, name: "100 Orders", icon: "💯", unlocked: false, description: "Total 100 pesanan" },
          { id: 5, name: "Conversion Master", icon: "🎖️", unlocked: false, description: "Conversion rate >5%" },
          { id: 6, name: "1M Revenue", icon: "💰", unlocked: false, description: "Total penjualan 1 juta" },
        ],
        prizes: [
          {
            rank: "1-3",
            prize: "iPhone 15 Pro",
            description: "Plus bonus Rp 5.000.000",
          },
          {
            rank: "4-10",
            prize: "iPad Air",
            description: "Plus bonus Rp 2.000.000",
          },
          {
            rank: "11-25",
            prize: "AirPods Pro",
            description: "Plus bonus Rp 1.000.000",
          },
          {
            rank: "26-50",
            prize: "Apple Watch SE",
            description: "Plus bonus Rp 500.000",
          },
        ],
      };
      setData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankChange = (change) => {
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-500 text-sm">
          <ChevronUp className="w-4 h-4" />
          <span>{change}</span>
        </div>
      );
    }
    if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-500 text-sm">
          <ChevronDown className="w-4 h-4" />
          <span>{Math.abs(change)}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-muted-foreground text-sm">
        <Minus className="w-4 h-4" />
      </div>
    );
  };

  const getBadgeStyle = (badgeName) => {
    const badge = data?.badges.find((b) => b.name === badgeName);
    return badge ? badge.color : "from-gray-400 to-gray-500";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Memuat leaderboard...</p>
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
            <Trophy className="w-8 h-8 text-yellow-500" />
            Leaderboard
          </h2>
          <p className="text-muted-foreground mt-1">Bersaing dan raih hadiah menarik!</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">Bulan Ini</SelectItem>
              <SelectItem value="lastMonth">Bulan Lalu</SelectItem>
              <SelectItem value="thisQuarter">Quarter Ini</SelectItem>
              <SelectItem value="thisYear">Tahun Ini</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchLeaderboard}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* My Stats Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Rank & Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                  <AvatarImage src={data.myStats.avatar} />
                  <AvatarFallback className="text-xl font-bold">{getInitials(data.myStats.name)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg">#{data.myStats.rank}</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Peringkat Anda</h3>
                <div className="flex items-center gap-2">
                  <Badge className={`bg-gradient-to-r ${getBadgeStyle(data.myStats.badge)}`}>{data.myStats.badge}</Badge>
                  {data.myStats.change !== 0 && (
                    <span className={`text-sm font-medium ${data.myStats.change > 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                      {data.myStats.change > 0 ? "+" : ""}
                      {data.myStats.change} posisi
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Earnings</p>
                <p className="text-xl font-bold">Rp {(data.myStats.earnings / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pesanan</p>
                <p className="text-xl font-bold">{data.myStats.orders}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Klik</p>
                <p className="text-xl font-bold">{data.myStats.clicks.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Conversion</p>
                <p className="text-xl font-bold">{data.myStats.conversionRate}%</p>
              </div>
            </div>

            {/* Progress to Next Rank */}
            <div className="w-full lg:w-64">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Progress ke peringkat berikutnya</p>
                <span className="text-sm text-muted-foreground">
                  {data.myStats.points}/{data.myStats.nextRankPoints}
                </span>
              </div>
              <Progress value={data.myStats.progress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">{data.myStats.nextRankPoints - data.myStats.points} poin lagi!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="earnings">
            <DollarSign className="w-4 h-4 mr-2" />
            Earnings
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="clicks">
            <MousePointerClick className="w-4 h-4 mr-2" />
            Clicks
          </TabsTrigger>
          <TabsTrigger value="conversion">
            <Target className="w-4 h-4 mr-2" />
            Conversion
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {data.topPerformers.slice(0, 3).map((performer, index) => (
              <Card key={performer.rank} className={`relative overflow-hidden ${index === 0 ? "md:order-2 border-2 border-yellow-500" : index === 1 ? "md:order-1" : "md:order-3"}`}>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${index === 0 ? "from-yellow-400 to-yellow-600" : index === 1 ? "from-gray-300 to-gray-400" : "from-orange-400 to-orange-600"}`} />
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {index === 0 ? (
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <Crown className="w-10 h-10 text-white" />
                      </div>
                    ) : (
                      <Avatar className="w-20 h-20 border-4 border-background">
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback className="text-xl font-bold">{getInitials(performer.name)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{performer.name}</h3>
                  <Badge className={`bg-gradient-to-r ${getBadgeStyle(performer.badge)} mb-3`}>{performer.badge}</Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Earnings:</span>
                      <span className="font-semibold">Rp {(performer.earnings / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orders:</span>
                      <span className="font-semibold">{performer.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion:</span>
                      <span className="font-semibold">{performer.conversionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Daftar lengkap affiliate terbaik periode ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.topPerformers.map((performer) => (
                  <div key={performer.rank} className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${performer.isCurrentUser ? "bg-primary/10 border-2 border-primary" : "hover:bg-muted/50 border border-transparent"}`}>
                    {/* Rank */}
                    <div className="w-12 flex items-center justify-center">{getRankIcon(performer.rank)}</div>

                    {/* Avatar & Name */}
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={performer.avatar} />
                      <AvatarFallback>{getInitials(performer.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">
                          {performer.name}
                          {performer.isCurrentUser && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              You
                            </Badge>
                          )}
                        </h4>
                        <Badge className={`bg-gradient-to-r ${getBadgeStyle(performer.badge)} text-xs`}>{performer.badge}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{performer.points.toLocaleString("id-ID")} points</p>
                    </div>

                    {/* Stats */}
                    <div className="hidden lg:grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-sm font-semibold">Rp {(performer.earnings / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{performer.orders}</p>
                        <p className="text-xs text-muted-foreground">Orders</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{performer.clicks.toLocaleString("id-ID")}</p>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{performer.conversionRate}%</p>
                        <p className="text-xs text-muted-foreground">Conversion</p>
                      </div>
                    </div>

                    {/* Change */}
                    <div className="w-16 flex justify-end">{getRankChange(performer.change)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Badges & Achievements Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Badge System
            </CardTitle>
            <CardDescription>Tingkatkan performa untuk unlock badge lebih tinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.badges.map((badge) => (
                <div key={badge.name} className={`p-4 rounded-lg border-2 ${badge.name === data.myStats.badge ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{badge.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{badge.name}</h4>
                        {badge.name === data.myStats.badge && <Badge variant="secondary">Current</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{badge.minPoints.toLocaleString("id-ID")}+ points</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {badge.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Achievements
            </CardTitle>
            <CardDescription>Raih pencapaian dan dapatkan bonus poin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {data.achievements.map((achievement) => (
                <div key={achievement.id} className={`p-4 rounded-lg border-2 text-center transition-all ${achievement.unlocked ? "border-primary bg-primary/5" : "border-border opacity-50 grayscale"}`}>
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge className="mt-2 text-xs" variant="secondary">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prizes Section */}
      <Card className="border-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-amber-600" />
            Hadiah Leaderboard
          </CardTitle>
          <CardDescription>Hadiah menarik untuk top performers periode ini!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.prizes.map((prize, index) => (
              <div key={index} className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border-2 border-border">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{index === 0 ? "🏆" : index === 1 ? "🎁" : index === 2 ? "🎉" : "✨"}</div>
                  <Badge className="mb-2">{prize.rank}</Badge>
                  <h4 className="font-bold text-lg">{prize.prize}</h4>
                </div>
                <p className="text-sm text-muted-foreground text-center">{prize.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-background/50 rounded-lg border">
            <p className="text-sm text-center text-muted-foreground">
              <Zap className="w-4 h-4 inline mr-1" />
              Hadiah akan diberikan di akhir periode. Tetap semangat dan tingkatkan performa Anda!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
