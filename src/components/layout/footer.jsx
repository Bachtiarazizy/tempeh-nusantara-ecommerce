import { Facebook, Instagram, Twitter, Youtube, Linkedin, Mail, Phone, MapPin, Send, CreditCard, Truck, Shield, Award, Globe, ChevronRight, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: {
      title: "Perusahaan",
      links: [
        { name: "Tentang Kami", href: "/about" },
        { name: "Blog & Artikel", href: "/blog" },
        { name: "Karir", href: "/careers" },
        { name: "Press & Media", href: "/press" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Investor Relations", href: "/investors" },
      ],
    },
    products: {
      title: "Produk",
      links: [
        { name: "Semua Produk", href: "/products" },
        { name: "Tempe Premium Export", href: "/products/premium" },
        { name: "Tempe Organik", href: "/products/organic" },
        { name: "Tempe Tradisional", href: "/products/traditional" },
        { name: "Paket Bulk Order", href: "/products/bulk" },
        { name: "Best Sellers", href: "/products?sort=best-sellers" },
      ],
    },
    support: {
      title: "Dukungan",
      links: [
        { name: "Pusat Bantuan", href: "/help" },
        { name: "Cara Pemesanan", href: "/how-to-order" },
        { name: "Lacak Pesanan", href: "/track-order" },
        { name: "Kebijakan Pengembalian", href: "/returns" },
        { name: "Pengiriman & Ongkir", href: "/shipping" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    affiliate: {
      title: "Affiliate Program",
      links: [
        { name: "Daftar Affiliate", href: "/affiliate/register" },
        { name: "Cara Kerja", href: "/affiliate/how-it-works" },
        { name: "Komisi & Benefit", href: "/affiliate/commission" },
        { name: "Dashboard Affiliate", href: "/dashboard/affiliate" },
        { name: "Leaderboard", href: "/affiliate/leaderboard" },
        { name: "Marketing Materials", href: "/affiliate/materials" },
      ],
    },
    legal: {
      title: "Legal & Kebijakan",
      links: [
        { name: "Syarat & Ketentuan", href: "/terms" },
        { name: "Kebijakan Privasi", href: "/privacy" },
        { name: "Kebijakan Cookie", href: "/cookies" },
        { name: "Keamanan Data", href: "/security" },
        { name: "Lisensi & Sertifikat", href: "/licenses" },
      ],
    },
  };

  const trustBadges = [
    { icon: Shield, text: "Pembayaran Aman", subtext: "SSL Encrypted" },
    { icon: Truck, text: "Pengiriman Cepat", subtext: "1-3 Hari Kerja" },
    { icon: Award, text: "Produk Berkualitas", subtext: "Sertifikat Halal" },
    { icon: Clock, text: "Support 24/7", subtext: "Siap Membantu" },
  ];

  const paymentMethods = [
    { name: "Visa", logo: "/payments/visa.svg" },
    { name: "Mastercard", logo: "/payments/mastercard.svg" },
    { name: "BCA", logo: "/payments/bca.svg" },
    { name: "Mandiri", logo: "/payments/mandiri.svg" },
    { name: "BNI", logo: "/payments/bni.svg" },
    { name: "GoPay", logo: "/payments/gopay.svg" },
    { name: "OVO", logo: "/payments/ovo.svg" },
    { name: "DANA", logo: "/payments/dana.svg" },
  ];

  const shippingPartners = [
    { name: "JNE", logo: "/shipping/jne.svg" },
    { name: "J&T", logo: "/shipping/jnt.svg" },
    { name: "SiCepat", logo: "/shipping/sicepat.svg" },
    { name: "Ninja Xpress", logo: "/shipping/ninja.svg" },
    { name: "AnterAja", logo: "/shipping/anteraja.svg" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-sky-500" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube", color: "hover:text-red-600" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-blue-700" },
  ];

  return (
    <footer className="bg-card border-t">
      {/* Trust Badges Section */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <badge.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{badge.text}</p>
                  <p className="text-xs text-muted-foreground">{badge.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Company Info & Newsletter - 4 columns */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Image src="/logo.png" width={140} height={46} alt="Tempe Nusantara" className="h-10 w-auto mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">Produsen tempe premium terpercaya dengan standar kualitas internasional. Melayani kebutuhan retail, bulk order, dan ekspor ke berbagai negara.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                  <span>Jl. Industri No. 123, Jakarta Selatan 12345, Indonesia</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 shrink-0 text-primary" />
                  <a href="tel:+6281234567890" className="hover:text-primary transition-colors">
                    +62 812-3456-7890
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 shrink-0 text-primary" />
                  <a href="mailto:info@tempenusantara.com" className="hover:text-primary transition-colors">
                    info@tempenusantara.com
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-muted/50 rounded-lg p-4 border">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Newsletter
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Dapatkan promo eksklusif & update produk terbaru</p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Email Anda" className="h-9 text-sm" />
                <Button size="sm" className="shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">Ikuti Kami</p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-all ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Grid - 8 columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {Object.entries(footerLinks).map(([key, section]) => (
                <div key={key}>
                  <h3 className="font-semibold text-sm mb-4 text-foreground">{section.title}</h3>
                  <ul className="space-y-2.5">
                    {section.links.map((link, index) => (
                      <li key={index}>
                        <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                          <span>{link.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment & Shipping Methods */}

        {/* Certifications & Awards */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="gap-1.5">
              <Award className="w-3.5 h-3.5" />
              ISO 9001:2015
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Halal MUI
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Export Certified
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Award className="w-3.5 h-3.5" />
              BPOM Certified
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              <p>© {currentYear} Tempe Nusantara. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
              <a href="/sitemap" className="text-muted-foreground hover:text-primary transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group"
        aria-label="Chat WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-semibold animate-pulse">1</span>
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat dengan kami
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-gray-900"></div>
        </div>
      </a>
    </footer>
  );
};

export default Footer;
