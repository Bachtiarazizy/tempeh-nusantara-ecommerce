"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingCart, Heart, User, Menu, Search, Package, Plus, Minus, X, LogOut, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "../shared/cart-context";
import { useWishlist } from "../shared/wishlist-context";
import Image from "next/image";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { items, totalItems, uniqueProducts, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { items: wishlistItems, totalItems: wishlistTotal, removeFromWishlist, clearWishlist } = useWishlist();
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;
  const isLoading = status === "loading";

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (typeof window !== "undefined") {
      window.location.href = "/checkout";
    }
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const handleDashboard = () => {
    // Route berdasarkan role user
    if (user?.role === "ADMIN") {
      router.push("/dashboard");
    } else if (user?.role === "AFFILIATE") {
      router.push("/dashboard/affiliate");
    } else {
      router.push("/buyer");
    }
  };

  const CartItem = ({ item }) => (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-100">
      <div className="shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
        {item.image ? <img src={item.image} alt={item.productName} className="w-full h-full object-cover rounded-lg" /> : <Package className="w-8 h-8 text-gray-400" />}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{item.productName || item.name}</h4>

        <div className="mt-1 space-y-1">
          {item.variant && (
            <p className="text-xs text-gray-600">
              <span className="font-medium">Variant:</span> {item.variant}
            </p>
          )}
          {item.weight && (
            <p className="text-xs text-gray-600">
              <span className="font-medium">Size:</span> {item.weight}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-green-600">{formatPrice(item.price)}</p>
          <p className="text-xs text-gray-500">each</p>
        </div>

        {item.quantity > 1 && <p className="text-xs text-gray-500 mt-1">Total: {formatPrice(item.price * item.quantity)}</p>}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
            <Minus className="w-3 h-3" />
          </Button>

          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>

          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeFromCart(item.cartItemId)}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/" className="flex items-center">
              <Image src="/logo.png" width={80} height={80} alt="Logo" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-700 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>

            {/* Favorites */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {totalItems > 99 ? "99+" : totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader>
                  <SheetTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shopping Cart
                  </SheetTitle>
                  <SheetDescription>
                    {uniqueProducts} {uniqueProducts === 1 ? "product" : "products"} • {totalItems} total {totalItems === 1 ? "item" : "items"}
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col mt-6">
                  {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-center">Your cart is empty</p>
                      <p className="text-sm text-gray-400 text-center mt-1">Add some products to get started</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto">
                        {items.map((item) => (
                          <CartItem key={item.cartItemId} item={item} />
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>
                              Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}):
                            </span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Shipping:</span>
                            <span className={totalPrice > 50 ? "text-green-600" : ""}>{totalPrice > 50 ? "FREE" : formatPrice(10)}</span>
                          </div>
                          {totalPrice <= 50 && <p className="text-xs text-gray-500">Add {formatPrice(50.01 - totalPrice)} more for free shipping</p>}
                        </div>

                        <div className="flex justify-between items-center mb-4 pt-2 border-t">
                          <span className="text-lg font-semibold text-gray-900">Total:</span>
                          <span className="text-lg font-bold text-green-600">{formatPrice(totalPrice + (totalPrice > 50 ? 0 : 10))}</span>
                        </div>

                        <div className="space-y-3">
                          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleProceedToCheckout}>
                            Proceed to Checkout
                          </Button>
                          <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>
                            Continue Shopping
                          </Button>
                          {items.length > 0 && (
                            <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={clearCart}>
                              Clear Cart
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
              <div className="hidden md:flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 font-normal">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDashboard}>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleLogin}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleRegister}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
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
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    <nav className="space-y-2">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </a>
                      ))}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start">
                          <Search className="w-5 h-5 mr-3" />
                          Search
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Heart className="w-5 h-5 mr-3" />
                          Wishlist
                        </Button>

                        {user ? (
                          <>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                handleDashboard();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <User className="w-5 h-5 mr-3" />
                              Dashboard
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                              <Package className="w-5 h-5 mr-3" />
                              My Orders
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                handleLogout();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <LogOut className="w-5 h-5 mr-3" />
                              Sign Out
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                handleLogin();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <LogIn className="w-5 h-5 mr-3" />
                              Login
                            </Button>
                            <Button
                              className="w-full justify-start bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                handleRegister();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <UserPlus className="w-5 h-5 mr-3" />
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
