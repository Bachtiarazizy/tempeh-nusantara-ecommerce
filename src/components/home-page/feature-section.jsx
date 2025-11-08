import React from "react";
import { Card, CardContent } from "../ui/card";
import { Award, DollarSign, Shield, Truck } from "lucide-react";

export const FeatureSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Kualitas Terjamin",
      description: "Sertifikasi Halal MUI, BPOM, dan ISO 9001:2015",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: Truck,
      title: "Pengiriman Cepat",
      description: "Free ongkir untuk pembelian >100K, 1-3 hari sampai",
      color: "bg-green-500/10 text-green-500",
    },
    {
      icon: Award,
      title: "Export Quality",
      description: "Standar internasional, diekspor ke 100+ negara",
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      icon: DollarSign,
      title: "Harga Terbaik",
      description: "Harga pabrik langsung, diskon hingga 40%",
      color: "bg-purple-500/10 text-purple-500",
    },
  ];
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
