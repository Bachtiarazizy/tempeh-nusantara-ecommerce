"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, X, SlidersHorizontal, Calendar, Clock, User, Tag, BookOpen, TrendingUp, ArrowRight, Eye, MessageCircle } from "lucide-react";
import { toast } from "sonner";

function BlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters
  const categoryParam = searchParams.get("category") || "all";
  const sortParam = searchParams.get("sort") || "latest";

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(categoryParam);

  const [filters, setFilters] = useState({
    categories: categoryParam !== "all" ? [categoryParam] : [],
    sortBy: sortParam,
  });

  // Blog categories
  const categories = [
    { id: "resep", name: "Resep & Kuliner", count: 24, icon: BookOpen },
    { id: "kesehatan", name: "Kesehatan & Nutrisi", count: 18, icon: TrendingUp },
    { id: "tips", name: "Tips & Trik", count: 32, icon: Tag },
    { id: "berita", name: "Berita & Update", count: 12, icon: Calendar },
    { id: "budaya", name: "Budaya & Tradisi", count: 15, icon: BookOpen },
  ];

  const sortOptions = [
    { value: "latest", label: "Terbaru" },
    { value: "oldest", label: "Terlama" },
    { value: "popular", label: "Paling Populer" },
    { value: "trending", label: "Trending" },
  ];

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) params.append("q", searchQuery);
      if (filters.sortBy) params.append("sort", filters.sortBy);
      if (filters.categories.length > 0) params.append("categories", filters.categories.join(","));

      const response = await fetch(`/api/blog?${params}`);
      const result = await response.json();

      if (result.success) {
        setPosts(result.data.posts || []);
        setTotalResults(result.data.total || 0);
      } else {
        setPosts([]);
        setTotalResults(0);
        toast.error("Gagal memuat artikel");
      }
    } catch (error) {
      console.error("Error:", error);
      setPosts([]);
      setTotalResults(0);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Update filters when URL params change
  useEffect(() => {
    const newCategory = searchParams.get("category") || "all";
    const newSort = searchParams.get("sort") || "latest";

    setCurrentCategory(newCategory);
    setFilters((prev) => ({
      ...prev,
      categories: newCategory !== "all" ? [newCategory] : prev.categories,
      sortBy: newSort,
    }));
  }, [searchParams]);

  const handleCategoryToggle = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId) ? prev.categories.filter((id) => id !== categoryId) : [...prev.categories, categoryId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      sortBy: "latest",
    });
    setCurrentCategory("all");
    setSearchQuery("");
    router.push("/blog");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
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

      <Button variant="outline" onClick={clearFilters} className="w-full">
        <X className="w-4 h-4 mr-2" />
        Reset Semua Filter
      </Button>

      <div className="h-px bg-border" />

      {/* Popular Tags */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">Tag Populer</h3>
        <div className="flex flex-wrap gap-2">
          {["Resep Tempe", "Protein Nabati", "Diet Sehat", "Fermentasi", "Tradisional", "Inovasi", "Tutorial"].map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push("/")}>
              Home
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Blog</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-foreground mb-3 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-primary" />
              Blog Tempe Nusantara
            </h1>
            <p className="text-lg text-muted-foreground">Temukan resep, tips kesehatan, dan informasi menarik seputar tempe Indonesia</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari artikel, resep, tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchPosts();
                }
              }}
              className="pl-12 pr-12 h-12 text-base"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            )}
            <Button onClick={fetchPosts} size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Active Filters */}
          {filters.categories.length > 0 && (
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
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
                Hapus Semua
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-6 space-y-6">
              <Card>
                <CardContent className="p-5">
                  <FilterSidebar />
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">Newsletter</h3>
                  <p className="text-sm text-muted-foreground mb-4">Dapatkan artikel terbaru langsung di email Anda</p>
                  <Input placeholder="Email Anda" className="mb-2" />
                  <Button className="w-full">Berlangganan</Button>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <p className="text-sm text-muted-foreground">
                {loading ? "Memuat..." : `${totalResults} artikel ditemukan`}
                {searchQuery && <span className="font-medium text-foreground"> untuk "{searchQuery}"</span>}
              </p>

              <div className="flex items-center gap-2">
                {/* Mobile Filters */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filter Artikel</SheetTitle>
                      <SheetDescription>Sesuaikan pencarian Anda</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={filters.sortBy} onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger className="w-[160px] h-9">
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
              </div>
            </div>

            {/* Blog Posts Grid */}
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-80 aspect-video md:aspect-square bg-muted animate-pulse" />
                      <CardContent className="p-6 flex-1 space-y-3">
                        <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                        <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                        <div className="h-4 bg-muted animate-pulse rounded w-full" />
                        <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (posts || []).length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada artikel ditemukan</h3>
                  <p className="text-sm text-muted-foreground mb-6">Coba kata kunci lain atau ubah filter pencarian</p>
                  <Button onClick={clearFilters}>Reset Filter</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {(posts || []).map((post, index) => (
                  <Card key={post.id} className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${index === 0 ? "md:col-span-2" : ""}`} onClick={() => router.push(`/blog/${post.slug}`)}>
                    <div className="md:flex">
                      {/* Image */}
                      <div className={`${index === 0 ? "md:w-1/2" : "md:w-80"} relative shrink-0`}>
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-64 md:h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-muted-foreground" />
                          </div>
                        )}
                        {post.featured && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-amber-500 hover:bg-amber-600">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {post.category && (
                            <Badge variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {post.category}
                            </Badge>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime || "5"} min
                            </span>
                          </div>
                        </div>

                        <h2 className={`font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 ${index === 0 ? "text-2xl" : "text-xl"}`}>{post.title}</h2>

                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">{post.excerpt || post.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t mt-auto">
                          <div className="flex items-center gap-3">
                            {post.author && (
                              <div className="flex items-center gap-2">
                                {post.author.avatar ? (
                                  <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-primary" />
                                  </div>
                                )}
                                <span className="text-sm font-medium text-foreground">{post.author.name}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {post.views && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {post.views}
                              </span>
                            )}
                            {post.comments && (
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {post.comments}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                              Baca Selengkapnya
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && (posts || []).length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="default" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat artikel...</p>
          </div>
        </div>
      }
    >
      <BlogPageContent />
    </Suspense>
  );
}
