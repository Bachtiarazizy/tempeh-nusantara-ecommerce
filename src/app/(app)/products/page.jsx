"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Grid3x3, List, SlidersHorizontal, Loader2, X, ChevronUp, Package, TrendingUp, Star } from "lucide-react";
import { useState, useEffect } from "react";
import ProductCard from "@/components/shared/product-card";

// Categories yang tersedia
const categories = [
  { value: "all", label: "All Categories" },
  { value: "Original", label: "Original Tempeh" },
  { value: "Marinated", label: "Marinated Tempeh" },
  { value: "Snacks", label: "Tempeh Snacks" },
  { value: "Premium", label: "Premium Tempeh" },
  { value: "Organic", label: "Organic Tempeh" },
];

const ProductsShop = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Server data
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [error, setError] = useState(null);

  // Active filters count
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Fix hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate active filters
  useEffect(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (searchQuery) count++;
    setActiveFiltersCount(count);
  }, [selectedCategory, priceRange, searchQuery, maxPrice]);

  // Fetch products from server
  const fetchProducts = async (page = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search: searchQuery,
        category: selectedCategory,
        sortBy: sortBy,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products");
      }

      if (append) {
        setProducts((prev) => [...prev, ...data.data]);
      } else {
        setProducts(data.data);
        // Set max price from first load if needed
        if (data.data.length > 0 && maxPrice === 100000) {
          const maxProductPrice = Math.max(...data.data.map((p) => p.price));
          const roundedMax = Math.ceil(maxProductPrice / 100) * 100;
          setMaxPrice(roundedMax);
          setPriceRange([0, roundedMax]);
        }
      }

      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!mounted) return;
    fetchProducts(1, false);
  }, [mounted, searchQuery, selectedCategory, sortBy, priceRange]);

  // Load more products
  const handleLoadMore = () => {
    if (pagination.hasMore && !loadingMore) {
      fetchProducts(pagination.page + 1, true);
    }
  };

  const handleToggleFavorite = (productId, isFavorited) => {
    console.log(`Product ${productId} favorite status: ${isFavorited}`);
    // TODO: Implement wishlist API
  };

  const handleBackToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("name");
    setPriceRange([0, maxPrice]);
  };

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Professional Banner */}
      <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm mb-4">
              <Package className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Premium Quality Products</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Discover Our Products</h1>
            <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">Authentic Indonesian tempeh, crafted with traditional methods and premium ingredients</p>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{pagination.total || 0}</div>
                <div className="text-sm text-green-100">Products</div>
              </div>
              <div className="h-12 w-px bg-white opacity-20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold">{categories.length - 1}</div>
                <div className="text-sm text-green-100">Categories</div>
              </div>
              <div className="h-12 w-px bg-white opacity-20"></div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">4.8</span>
                </div>
                <div className="text-sm text-green-100">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-green-600 hover:text-green-700">
                    Clear all
                  </Button>
                )}
              </div>

              {/* Active Filters Badge */}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="w-full justify-center">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                </Badge>
              )}

              {/* Search */}
              <Card className="p-4">
                <label className="text-sm font-medium text-gray-900 mb-3 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
              </Card>

              {/* Category Filter */}
              <Card className="p-4">
                <label className="text-sm font-medium text-gray-900 mb-3 block">Category</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category.value ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Price Range */}
              <Card className="p-4">
                <label className="text-sm font-medium text-gray-900 mb-3 block">Price Range</label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={maxPrice} min={0} step={10} className="mb-4" />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">Rp {priceRange[0].toLocaleString()}</span>
                  <span className="text-gray-500">-</span>
                  <span className="font-medium text-gray-900">Rp {priceRange[1].toLocaleString()}</span>
                </div>
              </Card>

              {/* Quick Filters */}
              <Card className="p-4">
                <label className="text-sm font-medium text-gray-900 mb-3 block">Quick Filters</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" />
                    <label htmlFor="featured" className="text-sm text-gray-700 cursor-pointer">
                      Featured Products
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="instock" defaultChecked />
                    <label htmlFor="instock" className="text-sm text-gray-700 cursor-pointer">
                      In Stock Only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sale" />
                    <label htmlFor="sale" className="text-sm text-gray-700 cursor-pointer">
                      On Sale
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="mb-6 space-y-4">
              {/* Mobile Search */}
              <div className="lg:hidden relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white" />
              </div>

              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <Button variant="outline" onClick={() => setShowMobileFilters(true)} className="lg:hidden flex-1 sm:flex-none">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 bg-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden sm:block">View:</span>
                  <div className="flex rounded-lg border bg-white">
                    <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-r-none">
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-l-none">
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Results Info */}
              <div className="flex items-center justify-between py-3 border-y">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{products.length}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span> products
                </p>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-green-600 hover:text-green-700 lg:hidden">
                    <X className="w-4 h-4 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="p-6 mb-6 bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-900 mb-1">Error loading products</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading products...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait a moment</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <>
                <div className={`grid gap-6 mb-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} onToggleFavorite={handleToggleFavorite} className={viewMode === "list" ? "flex flex-row max-w-none" : ""} />
                  ))}
                </div>

                {/* No Results */}
                {products.length === 0 && !loading && (
                  <Card className="p-12">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-600 mb-6">We couldn't find any products matching your criteria.</p>
                      <Button onClick={handleClearFilters} variant="outline">
                        Clear all filters
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Load More */}
                {products.length > 0 && pagination.hasMore && (
                  <div className="text-center py-8 border-t">
                    <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={loadingMore} className="min-w-[200px]">
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More Products
                          <TrendingUp className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-500 mt-3">
                      Showing {products.length} of {pagination.total} products
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4 space-y-6">
              {/* Mobile filter content - same as desktop sidebar */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-3 block">Category</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category.value ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 mb-3 block">Price Range</label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={maxPrice} min={0} step={10} className="mb-4" />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">Rp {priceRange[0].toLocaleString()}</span>
                  <span className="text-gray-500">-</span>
                  <span className="font-medium text-gray-900">Rp {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4 space-y-2">
              <Button onClick={() => setShowMobileFilters(false)} className="w-full">
                Show Results
              </Button>
              <Button variant="outline" onClick={handleClearFilters} className="w-full">
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top */}
      <button
        onClick={handleBackToTop}
        className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 hover:shadow-xl z-40"
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ProductsShop;
