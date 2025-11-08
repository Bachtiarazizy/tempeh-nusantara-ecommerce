import React from "react";
import { Badge } from "../ui/badge";
import { ChevronRight } from "lucide-react";

export const HowItWorkSection = () => {
  const processSteps = [
    {
      number: "01",
      title: "Pilih Produk",
      description: "Browse katalog lengkap produk premium kami",
    },
    {
      number: "02",
      title: "Tambah ke Keranjang",
      description: "Pilih varian dan jumlah yang diinginkan",
    },
    {
      number: "03",
      title: "Checkout Aman",
      description: "Pembayaran mudah dengan berbagai metode",
    },
    {
      number: "04",
      title: "Terima Pesanan",
      description: "Pengiriman cepat langsung ke alamat Anda",
    },
  ];
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Cara Belanja</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Mudah & Cepat</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Proses pemesanan yang simpel dalam 4 langkah mudah</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 relative">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                  {index < processSteps.length - 1 && <ChevronRight className="w-6 h-6 text-primary/30 absolute -right-8 top-5 hidden md:block" />}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
