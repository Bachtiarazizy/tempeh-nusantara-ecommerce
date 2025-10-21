"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Star, Loader2 } from "lucide-react";

export default function ProductFormModal({ isOpen, onClose, product, onSuccess }) {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "",
    weight: "",
    status: "ACTIVE",
    category: "",
    featured: false,
    mainImage: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Temporary preview URLs for uploaded images
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || "",
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        comparePrice: product.comparePrice?.toString() || "",
        stock: product.stock?.toString() || "",
        weight: product.weight?.toString() || "",
        status: product.status || "ACTIVE",
        category: product.category || "",
        featured: product.featured || false,
        mainImage: product.images?.[0] || "",
        images: product.images || [],
      });
      setMainImagePreview(product.images?.[0] || "");
      setGalleryPreviews(product.images?.slice(1) || []);
    } else {
      resetForm();
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      sku: "",
      name: "",
      slug: "",
      description: "",
      price: "",
      comparePrice: "",
      stock: "",
      weight: "",
      status: "ACTIVE",
      category: "",
      featured: false,
      mainImage: "",
      images: [],
    });
    setMainImagePreview("");
    setGalleryPreviews([]);
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug when name changes
    if (name === "name" && !product) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  // Upload main image
  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setUploadingMain(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();

      setFormData((prev) => ({
        ...prev,
        mainImage: result.url,
      }));
      setMainImagePreview(result.url);
      toast.success("Gambar utama berhasil diupload");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal upload gambar");
    } finally {
      setUploadingMain(false);
    }
  };

  // Upload gallery images
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate total images
    if (galleryPreviews.length + files.length > 5) {
      toast.error("Maksimal 5 gambar galeri");
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Semua file harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran setiap file maksimal 5MB");
        return;
      }
    }

    setUploadingGallery(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!response.ok) throw new Error("Upload failed");
        const result = await response.json();
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setGalleryPreviews((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} gambar berhasil diupload`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal upload gambar");
    } finally {
      setUploadingGallery(false);
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove main image
  const removeMainImage = () => {
    setFormData((prev) => ({ ...prev, mainImage: "" }));
    setMainImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine main image and gallery images
      const allImages = [formData.mainImage, ...galleryPreviews].filter(Boolean);

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        images: allImages,
      };

      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save product");
      }

      toast.success(product ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!");
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Gagal menyimpan produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle>
          <DialogDescription>{product ? "Perbarui informasi produk" : "Lengkapi form untuk menambah produk baru"}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="font-semibold text-lg">Gambar Produk</h3>

            {/* Main Image */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Gambar Utama <span className="text-red-500">*</span>
              </Label>

              {mainImagePreview ? (
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
                  <img src={mainImagePreview} alt="Main preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="destructive" size="sm" onClick={removeMainImage}>
                      <X className="w-4 h-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input type="file" id="main-image" accept="image/*" onChange={handleMainImageUpload} className="hidden" disabled={uploadingMain} />
                  <label htmlFor="main-image" className="cursor-pointer">
                    {uploadingMain ? <Loader2 className="w-12 h-12 mx-auto text-gray-400 animate-spin" /> : <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />}
                    <p className="text-sm text-gray-600 mb-2">{uploadingMain ? "Mengupload..." : "Klik untuk upload gambar utama"}</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
                  </label>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Gambar Galeri (Opsional)
              </Label>
              <p className="text-xs text-muted-foreground">Maksimal 5 gambar tambahan</p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Existing gallery images */}
                {galleryPreviews.map((url, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                    <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeGalleryImage(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Upload button */}
                {galleryPreviews.length < 5 && (
                  <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors">
                    <input type="file" id="gallery-images" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={uploadingGallery} />
                    <label htmlFor="gallery-images" className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4">
                      {uploadingGallery ? (
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-600 text-center">Upload</p>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">
                SKU <span className="text-red-500">*</span>
              </Label>
              <Input id="sku" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="TEMPE-001" required disabled={!!product} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Nama Produk <span className="text-red-500">*</span>
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Tempe Kedelai Premium" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="tempe-kedelai-premium" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEMPE_KEDELAI">Tempe Kedelai</SelectItem>
                  <SelectItem value="TEMPE_GEMBUS">Tempe Gembus</SelectItem>
                  <SelectItem value="TEMPE_KACANG">Tempe Kacang</SelectItem>
                  <SelectItem value="LAINNYA">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Harga <span className="text-red-500">*</span>
              </Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="15000" required min="0" step="100" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comparePrice">Harga Coret</Label>
              <Input id="comparePrice" name="comparePrice" type="number" value={formData.comparePrice} onChange={handleInputChange} placeholder="20000" min="0" step="100" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">
                Stok <span className="text-red-500">*</span>
              </Label>
              <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="100" required min="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Berat (gram)</Label>
              <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleInputChange} placeholder="500" min="0" step="10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex items-center">
              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))} />
                <Label htmlFor="featured" className="cursor-pointer">
                  Produk Unggulan
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Deskripsi lengkap produk..." rows={4} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading || !formData.mainImage}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : product ? (
                "Update Produk"
              ) : (
                "Tambah Produk"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
