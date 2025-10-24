"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  X,
  Package,
  Truck,
  Shield,
  RotateCcw,
  Award,
  MapPin,
  ChevronRight,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  User,
  Layers,
  TrendingUp,
  Clock,
  Info,
  ExternalLink,
  ChevronLeft,
  Zap,
  Gift,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Mock product data - replace with API call
  useEffect(() => {
    const mockProduct = {
      id: params.id,
      name: "Tempe Premium Export Grade A",
      slug: "tempe-premium-export-grade-a",
      category: "Premium",
      brand: "Tempe Nusantara",
      sku: "TPE-001-500",
      price: 25000,
      originalPrice: 35000,
      discount: 29,
      rating: 4.8,
      reviewCount: 247,
      soldCount: 1523,
      stock: 150,
      minOrder: 1,
      maxOrder: 100,
      weight: 500,
      images: [
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800",
        "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800",
        "https://images.unsplash.com/photo-1589621316382-008455b857cd?w=800",
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800",
      ],
      description: `Tempe Premium Export Grade A adalah produk tempe berkualitas tinggi yang diproduksi dengan standar internasional. Dibuat dari kedelai pilihan organik dan difermentasi dengan ragi berkualitas premium.

Produk ini telah melewati berbagai sertifikasi kualitas dan food safety, menjadikannya pilihan sempurna untuk konsumen yang mengutamakan kesehatan dan kualitas.`,

      features: [
        "100% Kedelai Organik Bersertifikat",
        "Tanpa Pengawet & MSG",
        "Proses Fermentasi Tradisional 36 Jam",
        "Dikemas Vacuum Sealed untuk Kesegaran Maksimal",
        "Halal & BPOM Certified",
        "High Protein Content (19g per 100g)",
        "Kaya Probiotik Alami",
        "Export Quality Standard",
      ],

      specifications: [
        { label: "Berat Bersih", value: "500 gram" },
        { label: "Bahan Utama", value: "Kedelai Organik" },
        { label: "Masa Simpan", value: "7 hari (suhu ruang), 30 hari (frozen)" },
        { label: "Metode Produksi", value: "Fermentasi Tradisional" },
        { label: "Protein", value: "19g per 100g" },
        { label: "Serat", value: "4g per 100g" },
        { label: "Negara Asal", value: "Indonesia" },
        { label: "Sertifikasi", value: "Halal, BPOM, Organic" },
      ],

      variants: [
        { id: 1, name: "500g", price: 25000, stock: 150 },
        { id: 2, name: "1kg", price: 45000, stock: 80 },
        { id: 3, name: "2kg (Hemat)", price: 85000, stock: 45 },
      ],

      benefits: [
        {
          icon: Shield,
          title: "Garansi Kualitas",
          description: "100% uang kembali jika produk tidak sesuai",
        },
        {
          icon: Truck,
          title: "Gratis Ongkir",
          description: "Pembelian minimal Rp 100.000",
        },
        {
          icon: RotateCcw,
          title: "Easy Return",
          description: "Pengembalian mudah dalam 7 hari",
        },
        {
          icon: Award,
          title: "Sertifikat Premium",
          description: "BPOM, Halal, & Organic Certified",
        },
      ],

      reviews: [
        {
          id: 1,
          user: "Budi Santoso",
          avatar: null,
          rating: 5,
          date: "2 hari yang lalu",
          variant: "500g",
          comment: "Kualitas premium banget! Rasanya enak, teksturnya padat, dan packaging rapi. Pengiriman juga cepat. Highly recommended!",
          helpful: 24,
          images: [],
        },
        {
          id: 2,
          user: "Siti Rahayu",
          avatar: null,
          rating: 5,
          date: "1 minggu yang lalu",
          variant: "1kg",
          comment: "Sudah order berkali-kali, selalu puas! Tempenya segar, tidak berbau aneh. Cocok untuk yang sedang diet tinggi protein.",
          helpful: 18,
          images: [],
        },
        {
          id: 3,
          user: "Ahmad Hidayat",
          avatar: null,
          rating: 4,
          date: "2 minggu yang lalu",
          variant: "2kg (Hemat)",
          comment: "Bagus sih, tapi harga agak mahal. Tapi sebanding dengan kualitas yang didapat. Packing aman banget.",
          helpful: 12,
          images: [],
        },
      ],

      relatedProducts: [
        { id: 2, name: "Tempe Organik Premium", price: 22000, image: null, rating: 4.7 },
        { id: 3, name: "Tempe Tradisional Asli", price: 15000, image: null, rating: 4.6 },
        { id: 4, name: "Paket Hemat Tempe 5kg", price: 200000, image: null, rating: 4.9 },
      ],
    };

    setTimeout(() => {
      setProduct(mockProduct);
      setSelectedVariant(mockProduct.variants[0]);
      setLoading(false);
    }, 800);
  }, [params.id]);

  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < product.maxOrder) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > product.minOrder) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    toast.success("Produk berhasil ditambahkan ke keranjang!");
  };

  const handleBuyNow = () => {
    toast.success("Redirecting to checkout...");
    router.push("/checkout");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name}!`,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin!");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-muted animate-pulse rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-12 bg-muted animate-pulse rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Produk tidak ditemukan</h2>
          <Button onClick={() => router.push("/products")}>Kembali ke Produk</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push("/")}>
              Home
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push("/products")}>
              Produk
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-foreground cursor-pointer" onClick={() => router.push(`/products?category=${product.category.toLowerCase()}`)}>
              {product.category}
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-4 group">
                {product.images[selectedImage] ? (
                  <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
                {product.discount > 0 && (
                  <Badge variant="destructive" className="absolute top-4 left-4 text-base px-3 py-1">
                    -{product.discount}%
                  </Badge>
                )}

                {/* Image Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-primary scale-95" : "border-transparent hover:border-muted-foreground/30"}`}
                  >
                    {image ? (
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Share & Favorite */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsFavorite(!isFavorite);
                    toast.success(isFavorite ? "Dihapus dari wishlist" : "Ditambahkan ke wishlist");
                  }}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
                  {isFavorite ? "Tersimpan" : "Simpan"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.badge && <Badge variant="outline">{product.badge}</Badge>}
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Best Seller
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-3">{product.name}</h1>

                <div className="flex items-center gap-4 mb-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-foreground">{product.rating}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <button className="text-sm text-muted-foreground hover:text-primary" onClick={() => setActiveTab("reviews")}>
                      {product.reviewCount} Ulasan
                    </button>
                  </div>

                  {/* Sold Count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Separator orientation="vertical" className="h-4" />
                    <Package className="w-4 h-4" />
                    <span>{product.soldCount} Terjual</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Brand: <span className="text-foreground font-medium">{product.brand}</span>
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>SKU: {product.sku}</span>
                </div>
              </div>

              <Separator />

              {/* Price */}
              <div className="bg-muted/50 rounded-xl p-6">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary">{formatPrice(selectedVariant?.price || product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                      <Badge variant="destructive" className="mb-1">
                        Hemat {calculateDiscount()}%
                      </Badge>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Flash Sale berakhir dalam 2 jam 34 menit</span>
                </div>
              </div>

              {/* Variants */}
              {product.variants && (
                <div>
                  <Label className="text-sm font-semibold mb-3 block">Pilih Ukuran:</Label>
                  <div className="flex gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                          selectedVariant?.id === variant.id ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/20 hover:border-primary/50"
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Jumlah:</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => handleQuantityChange("decrease")} disabled={quantity <= product.minOrder} className="p-3 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        if (val >= product.minOrder && val <= product.maxOrder) {
                          setQuantity(val);
                        }
                      }}
                      className="w-16 text-center border-x bg-transparent outline-none"
                    />
                    <button onClick={() => handleQuantityChange("increase")} disabled={quantity >= product.maxOrder} className="p-3 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Stok: <span className="font-semibold text-foreground">{selectedVariant?.stock || product.stock}</span> tersedia
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Min. order: {product.minOrder} | Max. order: {product.maxOrder}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Tambah ke Keranjang
                </Button>
                <Button size="lg" className="flex-1" onClick={handleBuyNow}>
                  Beli Sekarang
                </Button>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-3">
                {product.benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Seller Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Layers className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{product.brand}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>Jakarta, Indonesia</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Deskripsi</TabsTrigger>
              <TabsTrigger value="specifications">Spesifikasi</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Pengiriman</TabsTrigger>
            </TabsList>

            {/* Description */}
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Deskripsi Produk</h3>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line mb-6">{product.description}</div>

                  <h4 className="font-semibold mb-3">Keunggulan Produk:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications */}
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Spesifikasi Produk</h3>
                  <div className="space-y-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex py-3 border-b last:border-0">
                        <span className="w-1/3 text-sm text-muted-foreground">{spec.label}</span>
                        <span className="w-2/3 text-sm font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {/* Rating Summary */}
                  <div className="flex items-start gap-8 mb-8 pb-8 border-b">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{product.reviewCount} ulasan</div>
                    </div>

                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm w-8">{star} ★</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${Math.random() * 100}%` }} />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{Math.floor(Math.random() * 100)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review List */}
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="pb-6 border-b last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-sm">{review.user}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">• {review.date}</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {review.variant}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-foreground">
                                <ThumbsUp className="w-4 h-4" />
                                Membantu ({review.helpful})
                              </button>
                              <button className="flex items-center gap-1 hover:text-foreground">
                                <MessageCircle className="w-4 h-4" />
                                Balas
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-6">
                    Lihat Semua Ulasan
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping */}
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Informasi Pengiriman</h3>

                  <div className="space-y-6">
                    {/* Shipping Calculator */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <Label className="text-sm font-semibold mb-3 block">Cek Ongkos Kirim</Label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input placeholder="Masukkan kode pos atau kota" />
                        </div>
                        <Button>Cek Ongkir</Button>
                      </div>
                    </div>

                    {/* Shipping Options */}
                    <div>
                      <h4 className="font-semibold mb-3">Pilihan Pengiriman:</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium text-sm">Reguler (JNE/J&T/SiCepat)</p>
                              <p className="text-xs text-muted-foreground">Estimasi 3-5 hari kerja</p>
                            </div>
                          </div>
                          <span className="font-semibold">Rp 15.000</span>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <div>
                              <p className="font-medium text-sm">Express (Same Day/Next Day)</p>
                              <p className="text-xs text-muted-foreground">Estimasi 1-2 hari kerja</p>
                            </div>
                          </div>
                          <span className="font-semibold">Rp 35.000</span>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                          <div className="flex items-center gap-3">
                            <Gift className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium text-sm">Gratis Ongkir</p>
                              <p className="text-xs text-muted-foreground">Min. belanja Rp 100.000</p>
                            </div>
                          </div>
                          <Badge variant="secondary">GRATIS</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Policy */}
                    <div>
                      <h4 className="font-semibold mb-3">Kebijakan Pengiriman:</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Pesanan diproses dalam 1x24 jam (hari kerja)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Packaging aman dengan bubble wrap dan ice pack untuk menjaga kesegaran</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Asuransi pengiriman gratis untuk semua pesanan</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Nomor resi akan dikirim otomatis via WhatsApp/Email</span>
                        </div>
                      </div>
                    </div>

                    {/* Return Policy */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <RotateCcw className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Kebijakan Pengembalian</h4>
                          <p className="text-sm text-muted-foreground mb-3">Kami menerima pengembalian produk dalam 7 hari jika produk rusak atau tidak sesuai pesanan.</p>
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Baca Selengkapnya <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Produk Terkait</h2>
            <Button variant="ghost" onClick={() => router.push("/products")}>
              Lihat Semua
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => router.push(`/products/${relatedProduct.id}`)}>
                <div className="aspect-square bg-muted">
                  {relatedProduct.image ? (
                    <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-muted-foreground">{relatedProduct.rating}</span>
                  </div>
                  <p className="text-lg font-bold text-primary">{formatPrice(relatedProduct.price)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-12 bg-muted/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Terakhir Dilihat</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-background rounded-lg border hover:border-primary transition-colors cursor-pointer flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 lg:hidden z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsFavorite(!isFavorite);
              toast.success(isFavorite ? "Dihapus dari wishlist" : "Ditambahkan ke wishlist");
            }}
            className="w-12 h-12 border rounded-lg flex items-center justify-center"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
          </button>
          <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Keranjang
          </Button>
          <Button className="flex-1" onClick={handleBuyNow}>
            Beli Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
