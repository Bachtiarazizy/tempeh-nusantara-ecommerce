import { Layers, Package, Gift, TrendingUp, Star, Tag, BookOpen, MessageCircle, Award, UserPlus, DollarSign, LayoutDashboard, BarChart3, Target } from "lucide-react";

// Main Navigation Items
export const mainNavigation = [
  {
    name: "Products",
    href: "/products",
    hasMegaMenu: true,
    megaMenuKey: "products",
  },
  {
    name: "Affiliate Program",
    href: "/affiliate",
    hasMegaMenu: true,
    megaMenuKey: "affiliate",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "About Us",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

// Mega Menu Configurations
export const megaMenus = {
  products: {
    sections: [
      {
        title: "Kategori Premium",
        items: [
          {
            name: "Tempe Premium Export",
            href: "/products?category=premium",
            icon: Layers,
            badge: "Export",
          },
          {
            name: "Tempe Organik",
            href: "/products?category=organic",
            icon: Layers,
            badge: "Organic",
          },
          {
            name: "Tempe Tradisional",
            href: "/products?category=traditional",
            icon: Layers,
          },
          {
            name: "Paket Bulk Order",
            href: "/products?category=bulk",
            icon: Gift,
            badge: "Hemat",
          },
        ],
      },
      {
        title: "Belanja Cepat",
        items: [
          {
            name: "Semua Produk",
            href: "/products",
            icon: Package,
          },
          {
            name: "Best Sellers",
            href: "/products?sort=best-sellers",
            icon: TrendingUp,
          },
          {
            name: "Produk Baru",
            href: "/products?sort=newest",
            icon: Star,
          },
          {
            name: "Promo Spesial",
            href: "/products?filter=on-sale",
            icon: Tag,
            badge: "Sale",
          },
        ],
      },
      {
        title: "Informasi Produk",
        items: [
          {
            name: "Cara Order",
            href: "/how-to-order",
            icon: BookOpen,
          },
          {
            name: "Bulk Order via WA",
            href: "https://wa.me/YOUR_NUMBER",
            icon: MessageCircle,
          },
          {
            name: "Export Info",
            href: "/export",
            icon: Package,
          },
          {
            name: "Kualitas & Sertifikat",
            href: "/quality",
            icon: Award,
          },
        ],
      },
    ],
  },
  affiliate: {
    sections: [
      {
        title: "Mulai Jadi Affiliate",
        items: [
          {
            name: "Daftar Sekarang",
            href: "/affiliate/register",
            icon: UserPlus,
            badge: "Gratis",
          },
          {
            name: "Cara Kerja Program",
            href: "/affiliate/how-it-works",
            icon: BookOpen,
          },
          {
            name: "Komisi & Benefit",
            href: "/affiliate/commission",
            icon: DollarSign,
          },
          {
            name: "Syarat & Ketentuan",
            href: "/affiliate/terms",
            icon: BookOpen,
          },
        ],
      },
      {
        title: "Dashboard Affiliate",
        items: [
          {
            name: "Login Dashboard",
            href: "/dashboard/affiliate",
            icon: LayoutDashboard,
          },
          {
            name: "Leaderboard Ranking",
            href: "/affiliate/leaderboard",
            icon: Award,
            badge: "Live",
          },
          {
            name: "Lacak Performa",
            href: "/dashboard/affiliate/performance",
            icon: BarChart3,
          },
          {
            name: "Earnings & Payout",
            href: "/dashboard/affiliate/earnings",
            icon: DollarSign,
          },
        ],
      },
      {
        title: "Tools & Support",
        items: [
          {
            name: "Marketing Materials",
            href: "/affiliate/materials",
            icon: Package,
          },
          {
            name: "Goals & Target",
            href: "/dashboard/affiliate/goals",
            icon: Target,
          },
          {
            name: "Tips Jualan",
            href: "/affiliate/tips",
            icon: BookOpen,
          },
          {
            name: "FAQ & Bantuan",
            href: "/affiliate/faq",
            icon: MessageCircle,
          },
        ],
      },
    ],
  },
};
