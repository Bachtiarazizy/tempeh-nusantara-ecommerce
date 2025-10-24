"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  User,
  Menu,
  Search,
  Package,
  Plus,
  Minus,
  X,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  ShoppingBag,
  Settings,
  Users,
  BarChart3,
  Gift,
  Layers,
  Star,
  TrendingUp,
  Tag,
  MessageCircle,
  BookOpen,
  Award,
  DollarSign,
  Target,
  Heart,
  ChevronDown,
  Download,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "../shared/cart-context";
import Image from "next/image";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const { items, totalItems, uniqueProducts, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Mock wishlist data - ganti dengan data real dari context/API
  const [wishlistItems, setWishlistItems] = useState([]);

  const user = session?.user;
  const isLoading = status === "loading";

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // MVP-Focused Mega Menus
  const megaMenus = {
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
            { name: "Bulk Order via WA", href: "https://wa.me/YOUR_NUMBER", icon: MessageCircle },
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

  // Main Navigation
  const mainNavigation = [
    { name: "Products", href: "/products", hasMegaMenu: true, megaMenuKey: "products" },
    { name: "Affiliate Program", href: "/affiliate", hasMegaMenu: true, megaMenuKey: "affiliate" },
    { name: "Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const getDashboardRoute = (role) => {
    const routes = {
      ADMIN: "/dashboard",
      AFFILIATE: "/dashboard/affiliate",
      BUYER: "/buyer",
    };
    return routes[role] || "/buyer";
  };

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

    return [...(roleSpecificItems[role] || [])];
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== itemId));
  };

  const CartItem = ({ item }) => (
    <div className="flex items-start gap-3 py-4 border-b last:border-0">
      <div className="shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        {item.image ? <img src={item.image} alt={item.productName} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{item.productName || item.name}</h4>
        {(item.variant || item.weight) && (
          <div className="mt-1 space-y-0.5">
            {item.variant && <p className="text-xs text-muted-foreground">Varian: {item.variant}</p>}
            {item.weight && <p className="text-xs text-muted-foreground">Ukuran: {item.weight}</p>}
          </div>
        )}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</p>
          {item.quantity > 1 && <p className="text-xs text-muted-foreground">Total: {formatPrice(item.price * item.quantity)}</p>}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1 bg-muted rounded-lg">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
            <Minus className="w-3.5 h-3.5" />
          </Button>
          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => removeFromCart(item.cartItemId)}>
          <X className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs">Hapus</span>
        </Button>
      </div>
    </div>
  );

  const WishlistItem = ({ item }) => (
    <div className="flex items-start gap-3 py-4 border-b last:border-0">
      <div className="shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
        <p className="text-sm font-semibold text-foreground mt-2">{formatPrice(item.price)}</p>
        {item.inStock ? (
          <Badge variant="outline" className="mt-2 text-xs text-emerald-600 border-emerald-600">
            Tersedia
          </Badge>
        ) : (
          <Badge variant="outline" className="mt-2 text-xs text-red-600 border-red-600">
            Stok Habis
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button size="sm" className="h-8 text-xs" disabled={!item.inStock}>
          <ShoppingCart className="w-3.5 h-3.5 mr-1" />
          Beli
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:bg-destructive/10" onClick={() => removeFromWishlist(item.id)}>
          <X className="w-3.5 h-3.5 mr-1" />
          Hapus
        </Button>
      </div>
    </div>
  );

  return (
    <nav className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      {/* MAIN BAR - Logo, Search, Navigation, Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/" className="flex items-center">
              <Image src="/logo.png" width={120} height={40} alt="Tempe Nusantara" priority className="h-10 w-auto" />
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full bg-muted/50">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Cari produk tempe premium..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/search?q=${e.currentTarget.value}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Search Icon - Mobile */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => router.push("/search")}>
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist */}
            <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlistItems.length > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">{wishlistItems.length}</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Wishlist Saya
                  </SheetTitle>
                  <SheetDescription>{wishlistItems.length} produk tersimpan</SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col mt-6">
                  {wishlistItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium text-center">Wishlist kosong</p>
                      <p className="text-sm text-muted-foreground text-center mt-1">Simpan produk favorit Anda di sini</p>
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setIsWishlistOpen(false);
                          router.push("/products");
                        }}
                      >
                        Mulai Belanja
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto">
                      {wishlistItems.map((item) => (
                        <WishlistItem key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Cart - FIXED: Hanya 1 cart button */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">{totalItems > 99 ? "99+" : totalItems}</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Keranjang Belanja
                  </SheetTitle>
                  <SheetDescription>
                    {uniqueProducts} produk • {totalItems} total item
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col mt-6">
                  {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium text-center">Keranjang kosong</p>
                      <p className="text-sm text-muted-foreground text-center mt-1">Tambahkan produk untuk memulai</p>
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push("/products");
                        }}
                      >
                        Mulai Belanja
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto -mx-6 px-6">
                        {items.map((item) => (
                          <CartItem key={item.cartItemId} item={item} />
                        ))}
                      </div>

                      <div className="border-t pt-4 mt-4 bg-card">
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal ({totalItems} item):</span>
                            <span className="font-medium">{formatPrice(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pengiriman:</span>
                            <span className={totalPrice > 100000 ? "text-emerald-600 font-medium" : ""}>{totalPrice > 100000 ? "GRATIS ✓" : formatPrice(15000)}</span>
                          </div>
                          {totalPrice < 100000 && <p className="text-xs text-muted-foreground">Belanja {formatPrice(100000 - totalPrice)} lagi untuk gratis ongkir!</p>}
                        </div>

                        <div className="flex justify-between items-center mb-4 pt-3 border-t">
                          <span className="text-base font-semibold text-foreground">Total:</span>
                          <span className="text-xl font-bold text-primary">{formatPrice(totalPrice + (totalPrice > 100000 ? 0 : 15000))}</span>
                        </div>

                        <div className="space-y-2">
                          <Button className="w-full h-11" size="lg" onClick={handleProceedToCheckout}>
                            Checkout Sekarang
                          </Button>
                          <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>
                            Lanjut Belanja
                          </Button>
                          {items.length > 0 && (
                            <Button variant="ghost" className="w-full text-xs text-destructive hover:bg-destructive/10" onClick={clearCart}>
                              Kosongkan Keranjang
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* User Menu / Login */}
            {isLoading ? (
              <div className="w-9 h-9 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2 px-2 sm:px-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center ring-2 ring-primary/20">
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
            ) : (
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
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <nav className="space-y-1">
                      <a href="/" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors">
                        Home
                      </a>
                      {mainNavigation.map((item) => (
                        <a key={item.name} href={item.href} className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors">
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR - Main Navigation with Mega Menu */}
      <div className="border-t border-border bg-muted/20 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-12">
            <a href="/" className="text-foreground hover:text-primary hover:bg-accent px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Home
            </a>
            {mainNavigation.map((item) => (
              <div key={item.name} className="relative" onMouseEnter={() => item.hasMegaMenu && setActiveMegaMenu(item.megaMenuKey)} onMouseLeave={() => setActiveMegaMenu(null)}>
                <button onClick={() => !item.hasMegaMenu && router.push(item.href)} className="text-foreground hover:text-primary hover:bg-accent px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                  {item.name}
                  {item.hasMegaMenu && <ChevronDown className={`w-4 h-4 transition-transform ${activeMegaMenu === item.megaMenuKey ? "rotate-180" : ""}`} />}
                </button>

                {/* Mega Menu - FIXED: Menggunakan megaMenuKey */}
                {item.hasMegaMenu && activeMegaMenu === item.megaMenuKey && (
                  <div className="absolute left-0 top-full pt-2 w-screen max-w-4xl -ml-20 z-50">
                    <div className="bg-card border rounded-lg shadow-xl p-6">
                      <div className="grid grid-cols-3 gap-8">
                        {megaMenus[item.megaMenuKey]?.sections.map((section) => (
                          <div key={section.title}>
                            <h3 className="font-semibold text-sm text-foreground mb-3 pb-2 border-b">{section.title}</h3>
                            <ul className="space-y-1">
                              {section.items.map((subItem) => (
                                <li key={subItem.name}>
                                  <a
                                    href={subItem.href}
                                    className="flex items-start gap-2 text-sm hover:bg-accent p-2 rounded-lg transition-colors group"
                                    target={subItem.href.startsWith("http") ? "_blank" : undefined}
                                    rel={subItem.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                  >
                                    {subItem.icon && <subItem.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0" />}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-foreground group-hover:text-primary">{subItem.name}</span>
                                        {subItem.badge && (
                                          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                                            {subItem.badge}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
