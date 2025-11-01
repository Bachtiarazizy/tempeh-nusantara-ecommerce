"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, X, SlidersHorizontal, Grid3x3, List, Star, Package, Layers, ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";
import { useCartWishlist } from "./cart-wishlist-context";
import ProductCard from "./product-card";

export default function SearchClient({ initialProducts, initialTotal, categoryCounts, initialQuery, initialSort }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, loading: actionLoading } = useCartWishlist();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState(initialProducts);
  const [totalResults, setTotalResults] = useState(initialTotal);
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 500000],
    sortBy: initialSort,
    inStock: false,
    rating: 0,
  });

  const categories = [
    { id: "premium", name: "Tempe Premium", count: categoryCounts.premium || 0, icon: Layers },
    { id: "organic", name: "Tempe Organik", count: categoryCounts.organic || 0, icon: Layers },
    { id: "traditional", name: "Tempe Tradisional", count: categoryCounts.traditional || 0, icon: Layers },
    { id: "bulk", name: "Paket Bulk", count: categoryCounts.bulk || 0, icon: Package },
  ];

  const sortOptions = [
    { value: "relevance", label: "Paling Relevan" },
    { value: "popular", label: "Paling Populer" },
    { value: "newest", label: "Terbaru" },
    { value: "price-low", label: "Harga: Rendah ke Tinggi" },
    { value: "price-high", label: "Harga: Tinggi ke Rendah" },
    { value: "rating", label: "Rating Tertinggi" },
  ];

  // Fetch products with filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) params.append("q", searchQuery);
      if (filters.sortBy) params.append("sort", filters.sortBy);
      if (filters.categories.length > 0) params.append("categories", filters.categories.join(","));
      params.append("minPrice", filters.priceRange[0].toString());
      params.append("maxPrice", filters.priceRange[1].toString());
      if (filters.inStock) params.append("inStock", "true");
      if (filters.rating > 0) params.append("minRating", filters.rating.toString());

      const response = await fetch(`/api/products/search?${params}`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data.products || []);
        setTotalResults(result.data.total || 0);
      } else {
        toast.error("Gagal memuat produk");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    if (filters.sortBy !== "relevance") {
      params.set("sort", filters.sortBy);
    }

    startTransition(() => {
      router.push(`/search?${params.toString()}`, { scroll: false });
    });
  }, [searchQuery, filters.sortBy, router]);

  // Fetch when filters change (but not on initial mount for searchQuery)
  useEffect(() => {
    if (searchQuery !== initialQuery) {
      fetchProducts();
    }
  }, [filters]);

  const handleCategoryToggle = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId) ? prev.categories.filter((id) => id !== categoryId) : [...prev.categories, categoryId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 500000],
      sortBy: "relevance",
      inStock: false,
      rating: 0,
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchProducts();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle add to cart
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    await addToCart(product.id, 1);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">Kategori</h3>
        <div className="space-y-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id={`cat-${category.id}`} checked={filters.categories.includes(category.id)} onCheckedChange={() => handleCategoryToggle(category.id)} />
                  <Label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    {category.name}
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground">({category.count})</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">Rentang Harga</h3>
        <div className="space-y-4">
          <Slider value={filters.priceRange} onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value }))} max={500000} step={10000} className="w-full" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{formatPrice(filters.priceRange[0])}</span>
            <span className="text-muted-foreground">{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">Rating Minimum</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <Checkbox id={`rating-${rating}`} checked={filters.rating === rating} onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, rating: checked ? rating : 0 }))} />
              <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <span className="text-muted-foreground">& up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <div className="flex items-center gap-2">
          <Checkbox id="in-stock" checked={filters.inStock} onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, inStock: checked }))} />
          <Label htmlFor="in-stock" className="text-sm cursor-pointer">
            Stok Tersedia Saja
          </Label>
        </div>
      </div>

      <div className="h-px bg-border" />

      <Button variant="outline" onClick={clearFilters} className="w-full">
        <X className="w-4 h-4 mr-2" />
        Reset Semua Filter
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push("/")}>
              Home
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Pencarian</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Hasil Pencarian</h1>
            {searchQuery && <p className="text-muted-foreground">Menampilkan hasil untuk "{searchQuery}"</p>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari produk tempe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="pl-12 pr-12 h-12 text-base"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            )}
            <Button onClick={handleSearch} size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Active Filters */}
          {(filters.categories.length > 0 || filters.rating > 0 || filters.inStock) && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-muted-foreground">Filter aktif:</span>
              {filters.categories.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                return (
                  <Badge key={catId} variant="secondary" className="gap-1">
                    {cat?.name}
                    <button onClick={() => handleCategoryToggle(catId)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
              {filters.rating > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Rating {filters.rating}+
                  <button onClick={() => setFilters((prev) => ({ ...prev, rating: 0 }))}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.inStock && (
                <Badge variant="secondary" className="gap-1">
                  Stok Tersedia
                  <button onClick={() => setFilters((prev) => ({ ...prev, inStock: false }))}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
                Hapus Semua
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card className="sticky top-6">
              <CardContent className="p-4">
                <FilterSidebar />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <p className="text-sm text-muted-foreground">
                {loading ? "Mencari..." : `${totalResults} hasil ditemukan`}
                {searchQuery && <span className="font-medium text-foreground"> untuk "{searchQuery}"</span>}
              </p>

              <div className="flex items-center gap-2">
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filter Produk</SheetTitle>
                      <SheetDescription>Sesuaikan pencarian Anda</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={filters.sortBy} onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex border rounded-lg">
                  <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setViewMode("grid")}>
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setViewMode("list")}>
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <div className="aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada hasil ditemukan</h3>
                  <p className="text-sm text-muted-foreground mb-6">Coba kata kunci lain atau ubah filter pencarian</p>
                  <Button onClick={clearFilters}>Reset Filter</Button>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} isInWishlist={isInWishlist(product.id)} onAddToCart={handleAddToCart} onWishlistToggle={handleWishlistToggle} actionLoading={actionLoading} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
