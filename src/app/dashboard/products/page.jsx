"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Package, CheckCircle, XCircle, TrendingUp, DollarSign, Box, Search, Filter, Plus, Edit, Eye, Download, AlertCircle, Layers, BarChart3, Archive } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ProductFormModal from "@/components/shared/product-modal-form";

const CHART_COLORS = ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F5DEB3", "#FFE4C4"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalStock: 0,
    avgPrice: 0,
    lowStock: 0,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Mock data untuk charts - replace dengan data real dari API
  const stockTrendData = [
    { name: "Jan", stock: 450 },
    { name: "Feb", stock: 520 },
    { name: "Mar", stock: 480 },
    { name: "Apr", stock: 600 },
    { name: "May", stock: 550 },
    { name: "Jun", stock: 680 },
  ];

  const categoryDistribution = [
    { name: "Tempe Kedelai", value: 45 },
    { name: "Tempe Gembus", value: 25 },
    { name: "Tempe Kacang", value: 20 },
    { name: "Lainnya", value: 10 },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status !== "all" && { status }),
        ...(category !== "all" && { category }),
      });

      const response = await fetch(`/api/admin/products?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
        setPagination(result.pagination);
        calculateStats(result.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (productsData) => {
    const activeProducts = productsData.filter((p) => p.status === "ACTIVE");
    const inactiveProducts = productsData.filter((p) => p.status === "INACTIVE");
    const totalStock = productsData.reduce((sum, p) => sum + (p.stock || 0), 0);
    const avgPrice = productsData.length > 0 ? Math.round(productsData.reduce((sum, p) => sum + p.price, 0) / productsData.length) : 0;
    const lowStock = productsData.filter((p) => p.stock < 50).length;

    setStats({
      total: productsData.length,
      active: activeProducts.length,
      inactive: inactiveProducts.length,
      totalStock,
      avgPrice,
      lowStock,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, search, status, category]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchProducts();
        toast.success(`Produk berhasil ${newStatus === "ACTIVE" ? "diaktifkan" : "dinonaktifkan"}!`);
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error("Gagal mengubah status produk");
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductSaved = () => {
    fetchProducts();
    handleModalClose();
    toast.success(selectedProduct ? "Produk berhasil diupdate!" : "Produk baru berhasil ditambahkan!");
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-destructive mb-4 font-medium">Error: {error}</p>
            <Button onClick={fetchProducts} className="w-full">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Manajemen Produk</h1>
          <p className="text-muted-foreground text-sm md:text-base">Kelola semua produk tempe Anda dengan mudah</p>
        </div>
        <Button onClick={handleCreateProduct} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Produk</p>
            <p className="text-xl md:text-2xl font-bold text-foreground">{pagination.total}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Produk Aktif</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Tidak Aktif</p>
            <p className="text-xl md:text-2xl font-bold text-muted-foreground">{stats.inactive}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Box className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Stok</p>
            <p className="text-xl md:text-2xl font-bold text-foreground">{stats.totalStock}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Rata-rata Harga</p>
            <p className="text-base md:text-lg font-bold text-primary">Rp {stats.avgPrice.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Stok Menipis</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">{stats.lowStock}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Stock Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tren Stok 6 Bulan Terakhir
            </CardTitle>
            <CardDescription>Perkembangan total stok produk</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip formatter={(value) => `${value} unit`} contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }} />
                <Bar dataKey="stock" fill="#8B4513" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Distribusi Kategori Produk
            </CardTitle>
            <CardDescription>Breakdown produk per kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search - Responsive */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari produk (nama, SKU, deskripsi)..." value={search} onChange={handleSearchChange} className="pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(parseInt(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per halaman</SelectItem>
                  <SelectItem value="10">10 per halaman</SelectItem>
                  <SelectItem value="25">25 per halaman</SelectItem>
                  <SelectItem value="50">50 per halaman</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  window.open(`/api/admin/products/export`, "_blank");
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table/Cards - Responsive */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>
            Menampilkan {products.length} dari {pagination.total} produk
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">SKU</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Nama Produk</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Kategori</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Harga</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Stok</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="py-4 px-4">
                      <code className="px-2 py-1 bg-accent rounded text-sm">{product.sku}</code>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{product.name}</p>
                      {product.description && <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{product.category}</Badge>
                    </td>
                    <td className="py-4 px-4 font-medium text-primary">Rp {product.price.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge
                        className={
                          product.stock > 100
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : product.stock > 50
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }
                      >
                        {product.stock} pcs
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={product.status === "ACTIVE" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"}>
                        {product.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleToggleStatus(product.id, product.status)}>
                          {product.status === "ACTIVE" ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Nonaktifkan
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Aktifkan
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <code className="px-2 py-1 bg-accent rounded text-xs">{product.sku}</code>
                      <p className="mt-2 font-medium">{product.name}</p>
                      {product.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{product.description}</p>}
                    </div>
                    <Badge className={product.status === "ACTIVE" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"}>
                      {product.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Kategori:</span>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Harga:</span>
                      <span className="font-medium text-primary">Rp {product.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stok:</span>
                      <Badge className={product.stock > 100 ? "bg-green-100 text-green-800 text-xs" : product.stock > 50 ? "bg-yellow-100 text-yellow-800 text-xs" : "bg-red-100 text-red-800 text-xs"}>{product.stock} pcs</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)} className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleToggleStatus(product.id, product.status)} className="flex-1">
                      {product.status === "ACTIVE" ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Nonaktifkan
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aktifkan
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                ← Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}>
                Selanjutnya →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      <ProductFormModal isOpen={isModalOpen} onClose={handleModalClose} product={selectedProduct} onSuccess={handleProductSaved} />
    </div>
  );
}
