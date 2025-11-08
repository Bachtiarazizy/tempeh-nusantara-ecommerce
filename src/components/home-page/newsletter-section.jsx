"use client";

import { ArrowRight, Zap } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-card rounded-2xl p-12 shadow-xl border">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Zap className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Dapatkan Penawaran Eksklusif</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Berlangganan newsletter kami dan dapatkan diskon 15% untuk pembelian pertama, plus update produk terbaru dan promo spesial.</p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <Button size="lg" className="gap-2 whitespace-nowrap">
              Berlangganan
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Dengan berlangganan, Anda menyetujui{" "}
            <a href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </a>{" "}
            kami
          </p>
        </div>
      </div>
    </section>
  );
};
