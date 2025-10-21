"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send, Package, Users, TrendingUp, BookOpen, CreditCard, Truck, Shield, Award } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);

    try {
      // Simulate newsletter subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (error) {
      alert("There was an error subscribing. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Blog", href: "/blog" },
  ];

  const businessLinks = [
    { name: "Wholesale Orders", href: "/wholesale" },
    { name: "Bulk Pricing", href: "/bulk-pricing" },
    { name: "Export Services", href: "/export" },
    { name: "Partnership", href: "/partnership" },
    { name: "Distributor Program", href: "/distributor" },
  ];

  const affiliateLinks = [
    { name: "Become an Affiliate", href: "/affiliate/register" },
    { name: "Affiliate Login", href: "/affiliate/login" },
    { name: "Affiliate Dashboard", href: "/affiliate/dashboard" },
    { name: "Leaderboard", href: "/affiliate/leaderboard" },
    { name: "Commission Structure", href: "/affiliate/commission" },
  ];

  const supportLinks = [
    { name: "Order Tracking", href: "/track-order" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Refunds", href: "/returns" },
    { name: "Payment Methods", href: "/payment" },
    { name: "Customer Support", href: "/support" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Affiliate Terms", href: "/affiliate-terms" },
  ];

  return (
    <footer className="bg-primary text-white">
      {/* Features/Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-white/50">
          <div className="text-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h5 className="font-semibold mb-1 text-sm">Global Shipping</h5>
            <p className="text-white/60 text-xs">Reliable global delivery</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h5 className="font-semibold mb-1 text-sm">Premium Quality</h5>
            <p className="text-white/60 text-xs">Traditional Indonesian methods</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h5 className="font-semibold mb-1 text-sm">Affiliate Program</h5>
            <p className="text-white/60 text-xs">Earn with our ranking system</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h5 className="font-semibold mb-1 text-sm">Secure Payments</h5>
            <p className="text-white/60 text-xs">Multiple payment options</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Image src="/logo.png" alt="logo tempeh nusantara" width={70} height={70} />
            </div>

            <p className="text-white/90 text-sm mb-6 leading-relaxed">Premium Indonesian tempeh for global markets. Crafted with traditional methods using the finest ingredients.</p>

            {/* Contact Info */}
            <div className="space-y-2.5">
              <div className="flex items-center text-white/80">
                <Mail className="w-4 h-4 mr-2.5 text-white shrink-0" />
                <a href="mailto:info@tempenusantara.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs">
                  info@tempenusantara.com
                </a>
              </div>
              <div className="flex items-center text-white/80">
                <Phone className="w-4 h-4 mr-2.5 text-white shrink-0" />
                <a href="https://wa.me/6281299998340" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs">
                  +62 (812) 9999-8340
                </a>
              </div>
              <div className="flex items-center text-white/80">
                <MapPin className="w-4 h-4 mr-2.5 text-white shrink-0" />
                <span className="text-xs">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/70 text-xs hover:text-secondary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Business</h4>
            <ul className="space-y-2">
              {businessLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/70 text-xs hover:text-secondary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Affiliate Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Affiliate</h4>
            <ul className="space-y-2">
              {affiliateLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/70 text-xs hover:text-secondary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/70 text-xs hover:text-secondary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {legalLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-white hover:text-secondary transition-colors text-xs">
                  {link.name}
                </a>
              ))}
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-white text-xs">Follow us:</span>
              <a href="https://facebook.com" className="text-white hover:text-secondary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" className="text-white hover:text-secondary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" className="text-white hover:text-secondary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" className="text-white hover:text-secondary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          {/* <div className="text-center mt-6">
            <p className="text-gray-600 text-xs">© 2024 Tempeh Nusantara. All rights reserved.</p>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
