"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, LogIn, UserPlus, LayoutDashboard, ShoppingBag, Settings, Users, BarChart3, Heart, Star, Target, Award, DollarSign, Tag, Download, CreditCard, MessageCircle, ChevronDown, Package, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserMenu = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user;
  const isLoading = status === "loading";

  const getUserMenuItems = (role) => {
    const roleSpecificItems = {
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
        { name: "Marketing Materials", href: "/dashboard/affiliate/materials", icon: Download },
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

    return roleSpecificItems[role] || [];
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  if (isLoading) {
    return (
      <div className="w-9 h-9 flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
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
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-2 sm:px-3">
          <div className="w-7 h-7 bg-linear-to-br from-primary to-primary/70 rounded-full flex items-center justify-center ring-2 ring-primary/20">
            <span className="text-primary-foreground font-semibold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
          </div>
          <span className="hidden sm:inline text-sm font-medium">{user.name?.split(" ")[0]}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground font-normal truncate">{user.email}</p>
            {user.role && (
              <Badge variant="secondary" className="mt-1.5 text-xs">
                {user.role}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {getUserMenuItems(user.role).map((item) => (
          <DropdownMenuItem key={item.name} onClick={() => router.push(item.href)} className="cursor-pointer">
            <item.icon className="w-4 h-4 mr-2" />
            {item.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
