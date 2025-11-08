import React from "react";
import { Badge } from "../ui/badge";
import { ArrowRight, Award, BarChart3, DollarSign, Sparkles, Target, Users } from "lucide-react";
import { Button } from "../ui/button";

export const AffliateCtaSsection = () => {
  const affiliateBenefits = [
    {
      icon: DollarSign,
      title: "Komisi hingga 25%",
      description: "Dapatkan komisi menarik dari setiap penjualan",
    },
    {
      icon: Target,
      title: "Goal-Based Rewards",
      description: "Bonus tambahan saat capai target bulanan",
    },
    {
      icon: BarChart3,
      title: "Dashboard Real-time",
      description: "Pantau performa dan earnings langsung",
    },
    {
      icon: Award,
      title: "Leaderboard Ranking",
      description: "Kompetisi sehat dengan reward menarik",
    },
  ];
  return (
    <section className="py-20 bg-linear-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <Badge className="bg-white/20 text-white border-0 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Affiliate Program
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Hasilkan Hingga 25% Komisi!</h2>
            <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">Bergabunglah dengan ribuan affiliate kami dan dapatkan penghasilan pasif. Sistem tracking real-time, payout cepat, dan support penuh dari tim kami.</p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" variant="secondary" className="h-12 px-8 gap-2">
                <Users className="w-5 h-5" />
                Daftar Sekarang Gratis
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 border-white text-white hover:bg-white/10">
                Pelajari Lebih Lanjut
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold mb-1">5,000+</p>
                <p className="text-sm text-primary-foreground/80">Active Affiliates</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">$2M+</p>
                <p className="text-sm text-primary-foreground/80">Total Earnings</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">25%</p>
                <p className="text-sm text-primary-foreground/80">Max Commission</p>
              </div>
            </div>
          </div>

          {/* Right Benefits */}
          <div className="grid sm:grid-cols-2 gap-4">
            {affiliateBenefits.map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-primary-foreground/80">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
