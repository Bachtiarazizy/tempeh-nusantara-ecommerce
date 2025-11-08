import { ArrowRight, Check, Globe, Heart, Play, ShoppingCart, Sparkles, Star, Users } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export const HeroSection = () => {
  const heroStats = [
    { value: "50K+", label: "Pelanggan Setia", icon: Users },
    { value: "100+", label: "Negara Export", icon: Globe },
    { value: "4.9/5", label: "Rating Produk", icon: Star },
    { value: "99%", label: "Kepuasan", icon: Heart },
  ];

  return (
    <section className="relative bg-linear-to-br from-primary/5 via-background to-primary/5 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              #1 Produsen Tempe Premium Indonesia
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Tempe Premium
                <span className="block text-primary">Export Quality</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">Kualitas internasional dengan cita rasa tradisional Indonesia. Dipercaya oleh ribuan pelanggan di 100+ negara.</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-12 px-8 text-base group">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Belanja Sekarang
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                <Play className="w-5 h-5 mr-2" />
                Lihat Video
              </Button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
              {heroStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-4/5 bg-linear-to-br from-primary/20 to-blue-500/20 flex items-center justify-center relative overflow-hidden">
                <Image src="/images/tempeh-premium.png" alt="Tempe Premium Nusantara" fill className="object-cover" priority />
              </div>

              {/* Floating Cards */}
              <div className="absolute top-8 -left-4 bg-card border shadow-lg rounded-lg p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">2,847 Orders</p>
                    <p className="text-xs text-muted-foreground">Hari ini</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 -right-4 bg-card border shadow-lg rounded-lg p-4 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">4.9/5 Rating</p>
                    <p className="text-xs text-muted-foreground">12,341 reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
