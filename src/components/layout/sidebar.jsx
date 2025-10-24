"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Tag, BarChart3, DollarSign, Target, Award, User, Download, LogOut, X, Heart, MapPin, CreditCard, Bell, Star, Gift, Share2, Truck } from "lucide-react";

// Icon mapping
const iconMap = {
  "layout-dashboard": LayoutDashboard,
  package: Package,
  "shopping-bag": ShoppingBag,
  users: Users,
  settings: Settings,
  tag: Tag,
  "bar-chart-3": BarChart3,
  "dollar-sign": DollarSign,
  target: Target,
  award: Award,
  user: User,
  download: Download,
  heart: Heart,
  "map-pin": MapPin,
  "credit-card": CreditCard,
  bell: Bell,
  star: Star,
  gift: Gift,
  "share-2": Share2,
  truck: Truck,
};

// Menu configuration by role
const getMenuByRole = (role) => {
  const menus = {
    ADMIN: {
      title: "Admin Panel",
      subtitle: "Management Dashboard",
      color: "primary",
      icon: LayoutDashboard,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
          icon: "layout-dashboard",
          description: "Overview & Analytics",
        },
        {
          id: "products",
          label: "Manage Products",
          href: "/dashboard/products",
          icon: "package",
          description: "Product catalog",
        },
        {
          id: "orders",
          label: "Manage Orders",
          href: "/dashboard/orders",
          icon: "shopping-bag",
          description: "Order management",
        },
        {
          id: "affiliates",
          label: "Manage Affiliates",
          href: "/dashboard/affiliates",
          icon: "users",
          description: "Affiliate partners",
        },
        {
          id: "settings",
          label: "Settings",
          href: "/dashboard/settings",
          icon: "settings",
          description: "System configuration",
        },
      ],
    },
    AFFILIATE: {
      title: "Affiliate Dashboard",
      subtitle: "Partner Program",
      color: "blue",
      icon: Share2,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/dashboard/affiliate",
          icon: "layout-dashboard",
          description: "Overview & Statistics",
        },
        {
          id: "referral-link",
          label: "Referral Link",
          href: "/dashboard/affiliate/link",
          icon: "tag",
          description: "Share & Earn",
          badge: "Share",
        },
        {
          id: "performance",
          label: "My Performance",
          href: "/dashboard/affiliate/performance",
          icon: "bar-chart-3",
          description: "Track your sales",
        },
        {
          id: "earnings",
          label: "Earnings",
          href: "/dashboard/affiliate/earnings",
          icon: "dollar-sign",
          description: "Income & Payouts",
          badge: "Money",
        },
        {
          id: "goals",
          label: "Goals Progress",
          href: "/dashboard/affiliate/goals",
          icon: "target",
          description: "Track your targets",
        },
        {
          id: "ranking",
          label: "My Ranking",
          href: "/dashboard/affiliate/ranking",
          icon: "award",
          description: "Leaderboard position",
        },
        {
          id: "materials",
          label: "Marketing Materials",
          href: "/dashboard/affiliate/materials",
          icon: "download",
          description: "Download resources",
        },
        {
          id: "profile",
          label: "Profile Settings",
          href: "/dashboard/affiliate/profile",
          icon: "user",
          description: "Manage your account",
        },
      ],
    },
    BUYER: {
      title: "My Account",
      subtitle: "Shopping Dashboard",
      color: "emerald",
      icon: ShoppingBag,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          href: "/buyer",
          icon: "layout-dashboard",
          description: "Overview & Activity",
        },
        {
          id: "orders",
          label: "My Orders",
          href: "/buyer/orders",
          icon: "shopping-bag",
          description: "Track your orders",
          badge: "New",
        },
        {
          id: "wishlist",
          label: "Wishlist",
          href: "/buyer/wishlist",
          icon: "heart",
          description: "Saved products",
        },
        {
          id: "addresses",
          label: "Addresses",
          href: "/buyer/addresses",
          icon: "map-pin",
          description: "Shipping addresses",
        },
        {
          id: "payments",
          label: "Payment Methods",
          href: "/buyer/payments",
          icon: "credit-card",
          description: "Saved payments",
        },
        {
          id: "notifications",
          label: "Notifications",
          href: "/buyer/notifications",
          icon: "bell",
          description: "Updates & promos",
        },
        {
          id: "reviews",
          label: "My Reviews",
          href: "/buyer/reviews",
          icon: "star",
          description: "Product reviews",
        },
        {
          id: "profile",
          label: "Profile Settings",
          href: "/buyer/profile",
          icon: "settings",
          description: "Manage account",
        },
      ],
    },
  };

  return menus[role] || menus.BUYER;
};

// Get color classes by role
const getColorClasses = (role, isActive = false) => {
  const colors = {
    ADMIN: {
      gradient: "from-primary to-primary/70",
      bg: isActive ? "bg-primary" : "hover:bg-primary/10",
      text: isActive ? "text-primary-foreground" : "text-primary",
      border: "border-primary/20",
      ring: "ring-primary/10",
      shadow: "shadow-primary/20",
    },
    AFFILIATE: {
      gradient: "from-blue-500 to-blue-600",
      bg: isActive ? "bg-blue-500" : "hover:bg-blue-500/10",
      text: isActive ? "text-white" : "text-blue-600",
      border: "border-blue-500/20",
      ring: "ring-blue-500/10",
      shadow: "shadow-blue-500/20",
    },
    BUYER: {
      gradient: "from-emerald-500 to-emerald-600",
      bg: isActive ? "bg-emerald-500" : "hover:bg-emerald-500/10",
      text: isActive ? "text-white" : "text-emerald-600",
      border: "border-emerald-500/20",
      ring: "ring-emerald-500/10",
      shadow: "shadow-emerald-500/20",
    },
  };

  return colors[role] || colors.BUYER;
};

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;
  const menuConfig = getMenuByRole(user?.role);
  const colors = getColorClasses(user?.role);
  const HeaderIcon = menuConfig.icon;

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || Package;
  };

  // Loading state
  if (status === "loading") {
    return (
      <aside className="fixed left-0 top-0 h-full w-72 bg-card border-r border-border z-50">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      </aside>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={() => setIsOpen(false)} aria-hidden="true" />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 
          transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`px-6 py-3 border-b border-border bg-linear-to-r ${colors.bg.replace("hover:", "")} ${colors.bg.includes("bg-") ? "bg-opacity-5" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-linear-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <HeaderIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground text-sm">{menuConfig.title}</h2>
                  <p className="text-xs text-muted-foreground">{menuConfig.subtitle}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors" aria-label="Close sidebar">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Profile Card */}

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuConfig.items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = getIconComponent(item.icon);
                const itemColors = getColorClasses(user.role, isActive);

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        router.push(item.href);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 px-3 py-3 text-left rounded-xl
                        transition-all duration-200 group relative overflow-hidden
                        ${isActive ? `${itemColors.bg} ${itemColors.text} shadow-lg ${itemColors.shadow}` : `text-foreground ${itemColors.bg}`}`}
                    >
                      {/* Active indicator */}
                      {isActive && <div className={`absolute left-0 top-0 bottom-0 w-1 ${isActive && user.role === "ADMIN" ? "bg-primary-foreground" : "bg-white"} rounded-r-full`} />}

                      <div className={`p-2 rounded-lg transition-all ${isActive ? (user.role === "ADMIN" ? "bg-primary-foreground/20" : "bg-white/20") : `${itemColors.bg.replace("hover:", "")} bg-opacity-10`}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.label}</span>
                          {item.badge && (
                            <Badge variant={isActive ? "secondary" : "outline"} className="text-xs px-1.5 py-0 h-5">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 ${isActive ? (user.role === "ADMIN" ? "text-primary-foreground/70" : "text-white/70") : "text-muted-foreground"}`}>{item.description}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 
                hover:text-destructive border-border/50 hover:border-destructive/30 
                transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
