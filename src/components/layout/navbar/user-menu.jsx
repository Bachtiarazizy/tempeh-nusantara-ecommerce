"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, LogIn, UserPlus, LayoutDashboard, ShoppingBag, Settings, Users, Package, Tag, BarChart3, DollarSign, Target, Award, Download, CreditCard, Star, MessageCircle, ChevronDown, User, Heart } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// User Menu Items Configuration - dipisah agar mudah di-maintain
const ROLE_MENU_ITEMS = {
  ADMIN: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Products", href: "/dashboard/products", icon: Package },
    { name: "Manage Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Manage Affiliates", href: "/dashboard/affiliates", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  AFFILIATE: [
    { name: "Dashboard", href: "/dashboard/affiliate", icon: LayoutDashboard },
    { name: "Referral Link", href: "/dashboard/affiliate/link", icon: Tag },
    { name: "My Performance", href: "/dashboard/affiliate/performance", icon: BarChart3 },
    { name: "Earnings", href: "/dashboard/affiliate/earnings", icon: DollarSign },
    { name: "Goals Progress", href: "/dashboard/affiliate/goals", icon: Target },
    { name: "My Ranking", href: "/dashboard/affiliate/ranking", icon: Award },
    { name: "Profile Settings", href: "/dashboard/affiliate/profile", icon: User },
    { name: "Marketing materials", href: "/dashboard/affiliate/materials", icon: Download },
  ],
  BUYER: [
    { name: "Dashboard", href: "/buyer/dashboard", icon: LayoutDashboard },
    { name: "My Orders", href: "/buyer/orders", icon: ShoppingBag },
    { name: "My Wishlist", href: "/buyer/wishlist", icon: Heart },
    { name: "My Reviews", href: "/buyer/reviews", icon: Star },
    { name: "My Address", href: "/buyer/addresses", icon: Target },
    { name: "Payment Methods", href: "/buyer/payments", icon: CreditCard },
    { name: "Notifications", href: "/buyer/notifications", icon: MessageCircle },
    { name: "Profile Settings", href: "/buyer/profile", icon: Settings },
  ],
};

// Cache key untuk localStorage
const USER_CACHE_KEY = "user_cache";
const CACHE_EXPIRY_KEY = "user_cache_expiry";
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// Helper: Get cached user dengan expiry check
const getCachedUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (!cached || !expiry) return null;

    // Check if cache expired
    if (Date.now() > parseInt(expiry)) {
      localStorage.removeItem(USER_CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
      return null;
    }

    return JSON.parse(cached);
  } catch (error) {
    console.error("Error reading user cache:", error);
    return null;
  }
};

// Helper: Set cached user dengan expiry
const setCachedUser = (user) => {
  if (typeof window === "undefined") return;

  try {
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
    } else {
      localStorage.removeItem(USER_CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
    }
  } catch (error) {
    console.error("Error setting user cache:", error);
  }
};

// Memoized MenuItem Component untuk optimasi render
const MenuItem = memo(({ item, onClick }) => (
  <DropdownMenuItem onClick={() => onClick(item.href)} className="cursor-pointer">
    <item.icon className="w-4 h-4 mr-2" />
    {item.name}
  </DropdownMenuItem>
));

MenuItem.displayName = "MenuItem";

// Main UserMenu Component
const UserMenu = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // State untuk cached user - menggunakan lazy initialization
  const [cachedUser, setCachedUserState] = useState(() => getCachedUser());

  // Optimasi: Hanya update cache jika session berubah
  useEffect(() => {
    if (session?.user) {
      setCachedUser(session.user);
      setCachedUserState(session.user);
    } else if (status === "unauthenticated") {
      setCachedUser(null);
      setCachedUserState(null);
    }
  }, [session?.user, status]);

  // Memoized handler untuk navigasi
  const handleNavigate = useCallback(
    (href) => {
      router.push(href);
    },
    [router]
  );

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    setCachedUser(null);
    setCachedUserState(null);
    await signOut({ callbackUrl: "/", redirect: true });
  }, []);

  // Determine user dengan prioritas: session > cache
  const user = session?.user || cachedUser;
  const isLoading = status === "loading" && !cachedUser;

  // Get menu items berdasarkan role
  const menuItems = user?.role ? ROLE_MENU_ITEMS[user.role] || [] : [];

  // Loading State
  if (isLoading) {
    return (
      <div className="w-9 h-9 flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Authenticated State
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 gap-2 px-2 sm:px-3">
            <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center ring-2 ring-primary/20">
              <span className="text-primary-foreground font-semibold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">{user.name?.split(" ")[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* User Info Header */}
          <DropdownMenuLabel>
            <div>
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground font-normal truncate">{user.email}</p>
              {user.role && (
                <Badge variant="secondary" className="mt-1.5 text-xs">
                  {user.role}
                </Badge>
              )}
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Dynamic Menu Items based on Role */}
          {menuItems.map((item) => (
            <MenuItem key={item.href} item={item} onClick={handleNavigate} />
          ))}

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Unauthenticated State - Login/Register Buttons
  return (
    <div className="flex items-center gap-1.5">
      <Button variant="ghost" size="sm" className="h-9 text-sm" onClick={() => router.push("/login")}>
        <LogIn className="w-4 h-4 mr-1.5" />
        <span className="hidden sm:inline">Login</span>
      </Button>
      <Button size="sm" className="h-9 text-sm hidden sm:flex" onClick={() => router.push("/register")}>
        <UserPlus className="w-4 h-4 mr-1.5" />
        Daftar
      </Button>
    </div>
  );
};

export default memo(UserMenu);
