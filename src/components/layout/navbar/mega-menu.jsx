"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronDown, Layers, Gift, Package, TrendingUp, Star, Tag, BookOpen, MessageCircle, Award, UserPlus, DollarSign, LayoutDashboard, BarChart3, Target } from "lucide-react";
import { useState, useCallback, memo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mega Menu Configuration - Centralized
const MEGA_MENU_CONFIG = {
  products: {
    sections: [
      {
        title: "Kategori Premium",
        items: [
          { name: "Tempe Premium Export", href: "/products/premium", icon: Layers, badge: "Export" },
          { name: "Tempe Organik", href: "/products/organic", icon: Layers, badge: "Organic" },
          { name: "Tempe Tradisional", href: "/products/traditional", icon: Layers },
          { name: "Paket Bulk Order", href: "/products/bulk", icon: Gift, badge: "Hemat" },
        ],
      },
      {
        title: "Belanja Cepat",
        items: [
          { name: "Semua Produk", href: "/products", icon: Package },
          { name: "Best Sellers", href: "/products?sort=best-sellers", icon: TrendingUp },
          { name: "Produk Baru", href: "/products?sort=newest", icon: Star },
          { name: "Promo Spesial", href: "/products?filter=on-sale", icon: Tag, badge: "Sale" },
        ],
      },
      {
        title: "Informasi Produk",
        items: [
          { name: "Cara Order", href: "/how-to-order", icon: BookOpen },
          { name: "Bulk Order via WA", href: "https://wa.me/YOUR_NUMBER", icon: MessageCircle, external: true },
          { name: "Export Info", href: "/export", icon: Package },
          { name: "Kualitas & Sertifikat", href: "/quality", icon: Award },
        ],
      },
    ],
  },
  affiliate: {
    sections: [
      {
        title: "Mulai Jadi Affiliate",
        items: [
          { name: "Daftar Sekarang", href: "/affiliate/register", icon: UserPlus, badge: "Gratis" },
          { name: "Cara Kerja Program", href: "/affiliate/how-it-works", icon: BookOpen },
          { name: "Komisi & Benefit", href: "/affiliate/commission", icon: DollarSign },
          { name: "Syarat & Ketentuan", href: "/affiliate/terms", icon: BookOpen },
        ],
      },
      {
        title: "Dashboard Affiliate",
        items: [
          { name: "Login Dashboard", href: "/dashboard/affiliate", icon: LayoutDashboard },
          { name: "Leaderboard Ranking", href: "/affiliate/leaderboard", icon: Award, badge: "Live" },
          { name: "Lacak Performa", href: "/dashboard/affiliate/performance", icon: BarChart3 },
          { name: "Earnings & Payout", href: "/dashboard/affiliate/earnings", icon: DollarSign },
        ],
      },
      {
        title: "Tools & Support",
        items: [
          { name: "Marketing Materials", href: "/affiliate/materials", icon: Package },
          { name: "Goals & Target", href: "/dashboard/affiliate/goals", icon: Target },
          { name: "Tips Jualan", href: "/affiliate/tips", icon: BookOpen },
          { name: "FAQ & Bantuan", href: "/affiliate/faq", icon: MessageCircle },
        ],
      },
    ],
  },
};

// Main Navigation Items Configuration
export const MAIN_NAVIGATION = [
  { name: "Products", href: "/products", hasMegaMenu: true, megaMenuKey: "products" },
  { name: "Affiliate Program", href: "/affiliate", hasMegaMenu: true, megaMenuKey: "affiliate" },
  { name: "Blog", href: "/blog" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

// Memoized MenuItem Component
const MegaMenuItem = memo(({ item, onClick }) => (
  <li>
    <a
      href={item.href}
      onClick={(e) => {
        if (!item.external) {
          e.preventDefault();
          onClick(item.href);
        }
      }}
      className="flex items-start gap-2 text-sm hover:bg-accent p-2 rounded-lg transition-colors group"
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
    >
      {item.icon && <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground group-hover:text-primary">{item.name}</span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
              {item.badge}
            </Badge>
          )}
        </div>
      </div>
    </a>
  </li>
));

MegaMenuItem.displayName = "MegaMenuItem";

// Memoized Section Component
const MegaMenuSection = memo(({ section, onItemClick }) => (
  <div>
    <h3 className="font-semibold text-sm text-foreground mb-3 pb-2 border-b">{section.title}</h3>
    <ul className="space-y-1">
      {section.items.map((item) => (
        <MegaMenuItem key={item.href} item={item} onClick={onItemClick} />
      ))}
    </ul>
  </div>
));

MegaMenuSection.displayName = "MegaMenuSection";

// Single Navigation Item with MegaMenu
const NavigationItem = memo(({ item, isActive, onMouseEnter, onMouseLeave, onNavigate }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (!item.hasMegaMenu) {
      router.push(item.href);
    }
  }, [item.hasMegaMenu, item.href, router]);

  const megaMenuConfig = item.hasMegaMenu ? MEGA_MENU_CONFIG[item.megaMenuKey] : null;

  return (
    <div className="relative" onMouseEnter={() => onMouseEnter(item.megaMenuKey)} onMouseLeave={onMouseLeave}>
      <button onClick={handleClick} className="text-foreground hover:text-primary hover:bg-accent px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
        {item.name}
        {item.hasMegaMenu && <ChevronDown className={`w-4 h-4 transition-transform ${isActive ? "rotate-180" : ""}`} />}
      </button>

      {/* Mega Menu Dropdown */}
      {item.hasMegaMenu && isActive && megaMenuConfig && (
        <div className="absolute left-0 top-full pt-2 w-screen max-w-4xl -ml-20 z-50">
          <div className="bg-card border rounded-lg shadow-xl p-6">
            <div className="grid grid-cols-3 gap-8">
              {megaMenuConfig.sections.map((section) => (
                <MegaMenuSection key={section.title} section={section} onItemClick={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

NavigationItem.displayName = "NavigationItem";

// Main MegaMenu Component
const MegaMenu = () => {
  const router = useRouter();
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Optimized mouse enter handler dengan debounce
  const handleMouseEnter = useCallback((menuKey) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMegaMenu(menuKey);
  }, []);

  // Optimized mouse leave handler dengan delay
  const handleMouseLeave = useCallback(() => {
    // Delay close untuk better UX (prevent accidental close)
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  }, []);

  // Memoized navigation handler
  const handleNavigate = useCallback(
    (href) => {
      setActiveMegaMenu(null); // Close menu on navigate
      router.push(href);
    },
    [router]
  );

  return (
    <div className="border-t border-border bg-muted/20 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 h-12">
          {/* Home Link */}
          <a href="/" className="text-foreground hover:text-primary hover:bg-accent px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Home
          </a>

          {/* Navigation Items with MegaMenu */}
          {MAIN_NAVIGATION.map((item) => (
            <NavigationItem key={item.name} item={item} isActive={activeMegaMenu === item.megaMenuKey} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onNavigate={handleNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(MegaMenu);
