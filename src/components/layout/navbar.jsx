"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  Heart,
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
  TrendingDown,
  DollarSign,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "../shared/cart-context";
import { useWishlist } from "../shared/wishlist-context";
import Image from "next/image";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const { items, totalItems, uniqueProducts, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;
  const isLoading = status === "loading";

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // MVP-Focused Mega Menu
  const megaMenus = {
    products: {
      title: "Products",
      sections: [
        {
          title: "Kategori Premium",
          description: "Tempe berkualitas tinggi untuk ekspor",
          items: [
            {
              name: "Tempe Premium Export",
              href: "/products/premium",
              description: "Kualitas terbaik untuk pasar internasional",
              icon: Layers,
              badge: "Export Ready",
            },
            {
              name: "Tempe Organik",
              href: "/products/organic",
              description: "100% bahan organik bersertifikat",
              icon: Layers,
              badge: "Organic",
            },
            {
              name: "Tempe Tradisional",
              href: "/products/traditional",
              description: "Cita rasa autentik Indonesia",
              icon: Layers,
            },
            {
              name: "Paket Bulk Order",
              href: "/products/bulk",
              description: "Hemat untuk pemesanan dalam jumlah besar",
              icon: Gift,
              badge: "Best Deal",
            },
          ],
        },
        {
          title: "Belanja Cepat",
          description: "Temukan produk favorit",
          items: [
            {
              name: "Semua Produk",
              href: "/products",
              icon: Package,
              description: "Lihat semua koleksi kami",
            },
            {
              name: "Best Sellers",
              href: "/products?sort=best-sellers",
              icon: TrendingUp,
              description: "Produk paling laris",
            },
            {
              name: "Produk Baru",
              href: "/products?sort=newest",
              icon: Star,
              description: "Koleksi terbaru",
            },
            {
              name: "Promo Spesial",
              href: "/products?filter=on-sale",
              icon: Tag,
              badge: "Sale",
              description: "Penawaran terbatas",
            },
          ],
        },
        {
          title: "Informasi",
          description: "Panduan & bantuan",
          items: [
            {
              name: "Cara Order",
              href: "/how-to-order",
              icon: BookOpen,
              description: "Panduan berbelanja",
            },
            {
              name: "Bulk Order",
              href: "/bulk-order",
              icon: MessageCircle,
              description: "Hubungi via WhatsApp",
            },
            {
              name: "Export Info",
              href: "/export",
              icon: Package,
              description: "Informasi ekspor tempe",
            },
            {
              name: "Kualitas & Sertifikat",
              href: "/quality",
              icon: Award,
              description: "Standar kualitas kami",
            },
          ],
        },
      ],
    },
    affiliate: {
      title: "Affiliate Program",
      sections: [
        {
          title: "Mulai Jadi Affiliate",
          description: "Dapatkan penghasilan tambahan",
          items: [
            {
              name: "Daftar Affiliate",
              href: "/affiliate/register",
              description: "Bergabung sebagai mitra penjualan",
              icon: UserPlus,
              badge: "Free",
            },
            {
              name: "Cara Kerja",
              href: "/affiliate/how-it-works",
              description: "Panduan lengkap program affiliate",
              icon: BookOpen,
            },
            {
              name: "Komisi & Benefit",
              href: "/affiliate/benefits",
              description: "Struktur komisi dan keuntungan",
              icon: DollarSign,
            },
          ],
        },
        {
          title: "Untuk Affiliate",
          description: "Tools & tracking",
          items: [
            {
              name: "Dashboard Affiliate",
              href: "/dashboard/affiliate",
              icon: LayoutDashboard,
              description: "Pantau performa Anda",
            },
            {
              name: "Leaderboard",
              href: "/affiliate/leaderboard",
              icon: Award,
              description: "Ranking top sellers",
              badge: "New",
            },
            {
              name: "Goals & Target",
              href: "/affiliate/goals",
              icon: Target,
              description: "Lacak pencapaian target",
            },
          ],
        },
        {
          title: "Dukungan",
          description: "Bantuan untuk affiliate",
          items: [
            {
              name: "Marketing Materials",
              href: "/affiliate/materials",
              icon: Package,
              description: "Download banner & konten",
            },
            {
              name: "Tips & Training",
              href: "/affiliate/training",
              icon: BookOpen,
              description: "Pelajari strategi jualan",
            },
            {
              name: "FAQ Affiliate",
              href: "/affiliate/faq",
              icon: MessageCircle,
              description: "Pertanyaan umum",
            },
          ],
        },
      ],
    },
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products", hasMegaMenu: true },
    { name: "Affiliate Program", href: "/affiliate", hasMegaMenu: true },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
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
    const commonItems = [
      { name: "Dashboard", href: getDashboardRoute(role), icon: LayoutDashboard },
      { name: "My Orders", href: "/buyer/orders", icon: ShoppingBag },
      { name: "Profile Settings", href: "/buyer/settings", icon: Settings },
    ];

    const roleSpecificItems = {
      ADMIN: [
        { name: "Manage Products", href: "/dashboard/products", icon: Package },
        { name: "Manage Orders", href: "/dashboard/orders", icon: ShoppingBag },
        { name: "Manage Affiliates", href: "/dashboard/affiliates", icon: Users },
        { name: "Set Goals & Targets", href: "/dashboard/goals", icon: Target },
        { name: "View Rankings", href: "/dashboard/rankings", icon: Award },
      ],
      AFFILIATE: [
        { name: "Referral Link", href: "/dashboard/affiliate/link", icon: Tag },
        { name: "My Performance", href: "/dashboard/affiliate/performance", icon: BarChart3 },
        { name: "Earnings", href: "/dashboard/affiliate/earnings", icon: DollarSign },
        { name: "Goals Progress", href: "/dashboard/affiliate/goals", icon: Target },
        { name: "My Ranking", href: "/dashboard/affiliate/ranking", icon: Award },
        { name: "Marketing Materials", href: "/dashboard/affiliate/materials", icon: Package },
      ],
      BUYER: [],
    };

    return [...commonItems, ...(roleSpecificItems[role] || [])];
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  const CartItem = ({ item }) => (
    <div className="flex items-start gap-3 py-4 border-b">
      <div className="shrink-0 w-14 h-14 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
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

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.cartItemId)}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <nav className="bg-card border-b sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/" className="flex items-center">
              <Image src="/logo.png" width={80} height={80} alt="Tempe Nusantara" priority />
            </a>
          </div>

          {/* Desktop Navigation with Mega Menu */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative" onMouseEnter={() => item.hasMegaMenu && setActiveMegaMenu(item.name.toLowerCase().replace(/\s+/g, "-"))} onMouseLeave={() => setActiveMegaMenu(null)}>
                  <a href={item.href} className="text-foreground hover:text-primary hover:bg-accent px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                    {item.name}
                    {item.hasMegaMenu && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </a>

                  {/* Mega Menu Dropdown */}
                  {item.hasMegaMenu && activeMegaMenu === item.name.toLowerCase().replace(/\s+/g, "-") && (
                    <div className="absolute left-0 top-full pt-2 w-screen max-w-5xl -ml-40">
                      <div className="bg-card border rounded-lg shadow-xl p-6">
                        <div className="grid grid-cols-3 gap-8">
                          {megaMenus[item.name.toLowerCase().replace(/\s+/g, "-")]?.sections.map((section) => (
                            <div key={section.title}>
                              <div className="mb-4">
                                <h3 className="font-semibold text-sm text-foreground">{section.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                              </div>
                              <ul className="space-y-1">
                                {section.items.map((subItem) => (
                                  <li key={subItem.name}>
                                    <a href={subItem.href} className="flex items-start gap-3 text-sm hover:bg-accent p-2 rounded-lg transition-colors group">
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
                                        {subItem.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{subItem.description}</p>}
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

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => router.push("/search")}>
              <Search className="w-5 h-5" />
            </Button>

            {/* Bulk Order CTA - WhatsApp */}
            <Button variant="ghost" size="sm" className="hidden md:flex gap-2" onClick={() => window.open("https://wa.me/YOUR_PHONE_NUMBER?text=Halo, saya ingin bertanya tentang bulk order", "_blank")}>
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Bulk Order</span>
            </Button>

            {/* Cart */}
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
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto">
                        {items.map((item) => (
                          <CartItem key={item.cartItemId} item={item} />
                        ))}
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal ({totalItems} item):</span>
                            <span className="font-medium">{formatPrice(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pengiriman:</span>
                            <span className={totalPrice > 100000 ? "text-emerald-600" : ""}>{totalPrice > 100000 ? "GRATIS" : formatPrice(15000)}</span>
                          </div>
                          {totalPrice <= 100000 && <p className="text-xs text-muted-foreground">Tambah {formatPrice(100000 - totalPrice)} lagi untuk gratis ongkir</p>}
                        </div>

                        <div className="flex justify-between items-center mb-4 pt-2 border-t">
                          <span className="text-base font-semibold text-foreground">Total:</span>
                          <span className="text-lg font-bold text-primary">{formatPrice(totalPrice + (totalPrice > 100000 ? 0 : 15000))}</span>
                        </div>

                        <div className="space-y-2">
                          <Button className="w-full" onClick={handleProceedToCheckout}>
                            Checkout
                          </Button>
                          <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>
                            Lanjut Belanja
                          </Button>
                          {items.length > 0 && (
                            <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10" onClick={clearCart}>
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

            {/* User Menu - Desktop */}
            {isLoading ? (
              <div className="hidden lg:flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden lg:flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground leading-tight">{user.name}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{user.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {getUserMenuItems(user.role).map((item) => (
                    <DropdownMenuItem key={item.name} onClick={() => router.push(item.href)}>
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" onClick={() => router.push("/register")}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center">
                      <Image src="/logo.png" width={50} height={50} alt="Logo" />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6">
                    {/* User Info Mobile */}
                    {user && (
                      <div className="mb-6 p-4 bg-accent rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <nav className="space-y-1">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </a>
                      ))}
                    </nav>

                    <div className="mt-6 pt-6 border-t">
                      <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => router.push("/search")}>
                          <Search className="w-4 h-4 mr-3" />
                          Search
                        </Button>

                        <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => window.open("https://wa.me/YOUR_PHONE_NUMBER?text=Halo, saya ingin bertanya tentang bulk order", "_blank")}>
                          <MessageCircle className="w-4 h-4 mr-3" />
                          Bulk Order (WA)
                        </Button>

                        {user ? (
                          <>
                            {getUserMenuItems(user.role).map((item) => (
                              <Button
                                key={item.name}
                                variant="ghost"
                                className="w-full justify-start"
                                size="sm"
                                onClick={() => {
                                  router.push(item.href);
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                <item.icon className="w-4 h-4 mr-3" />
                                {item.name}
                              </Button>
                            ))}
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-destructive hover:bg-destructive/10"
                              size="sm"
                              onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <LogOut className="w-4 h-4 mr-3" />
                              Sign Out
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              size="sm"
                              onClick={() => {
                                router.push("/login");
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <LogIn className="w-4 h-4 mr-3" />
                              Login
                            </Button>
                            <Button
                              className="w-full justify-start"
                              size="sm"
                              onClick={() => {
                                router.push("/register");
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <UserPlus className="w-4 h-4 mr-3" />
                              Register
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
