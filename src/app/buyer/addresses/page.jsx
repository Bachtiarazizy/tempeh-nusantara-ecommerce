"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MapPin, Home, Briefcase, Star, Edit, Trash2, Plus, Phone, User, Building, AlertCircle } from "lucide-react";

export default function UserAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [formData, setFormData] = useState({
    label: "home",
    recipientName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    province: "",
    city: "",
    district: "",
    postalCode: "",
    notes: "",
    isPrimary: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockAddresses = [
        {
          id: "ADDR001",
          label: "home",
          recipientName: "Ahmad Hidayat",
          phoneNumber: "+62 812-3456-7890",
          addressLine1: "Jl. Merdeka No. 123",
          addressLine2: "Komplek Perumahan Indah Blok A5",
          province: "DKI Jakarta",
          city: "Jakarta Selatan",
          district: "Kebayoran Baru",
          postalCode: "12190",
          notes: "Rumah cat hijau, depan minimarket",
          isPrimary: true,
          createdAt: "2024-01-15",
          lastUsed: "2024-10-20",
        },
        {
          id: "ADDR002",
          label: "office",
          recipientName: "Ahmad Hidayat",
          phoneNumber: "+62 812-3456-7890",
          addressLine1: "Gedung Cyber 2 Tower, Lantai 15",
          addressLine2: "Jl. HR Rasuna Said Blok X-5 Kav. 13",
          province: "DKI Jakarta",
          city: "Jakarta Selatan",
          district: "Kuningan",
          postalCode: "12950",
          notes: "Hubungi resepsionis lantai 15",
          isPrimary: false,
          createdAt: "2024-02-10",
          lastUsed: "2024-10-18",
        },
        {
          id: "ADDR003",
          label: "other",
          recipientName: "Siti Nurhaliza",
          phoneNumber: "+62 821-9876-5432",
          addressLine1: "Jl. Kenanga Raya No. 45",
          addressLine2: "RT 005/RW 012, Kelurahan Sukamaju",
          province: "Jawa Barat",
          city: "Bandung",
          district: "Cidadap",
          postalCode: "40141",
          notes: "Rumah orang tua, hubungi penerima terlebih dahulu",
          isPrimary: false,
          createdAt: "2024-03-05",
          lastUsed: "2024-09-15",
        },
      ];
      setAddresses(mockAddresses);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.recipientName || !formData.phoneNumber || !formData.addressLine1 || !formData.province || !formData.city || !formData.district || !formData.postalCode) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? {
                ...addr,
                ...formData,
                lastUsed: new Date().toISOString().split("T")[0],
              }
            : formData.isPrimary
            ? { ...addr, isPrimary: false }
            : addr
        )
      );
    } else {
      const newAddress = {
        id: `ADDR${String(addresses.length + 1).padStart(3, "0")}`,
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        lastUsed: new Date().toISOString().split("T")[0],
      };

      if (formData.isPrimary) {
        setAddresses((prev) => [newAddress, ...prev.map((addr) => ({ ...addr, isPrimary: false }))]);
      } else {
        setAddresses((prev) => [...prev, newAddress]);
      }
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      recipientName: address.recipientName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      province: address.province,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode,
      notes: address.notes,
      isPrimary: address.isPrimary,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const addressToDelete = addresses.find((addr) => addr.id === deleteTargetId);

    if (addressToDelete?.isPrimary && addresses.length > 1) {
      setAddresses((prev) => {
        const filtered = prev.filter((addr) => addr.id !== deleteTargetId);
        if (filtered.length > 0) {
          filtered[0].isPrimary = true;
        }
        return filtered;
      });
    } else {
      setAddresses((prev) => prev.filter((addr) => addr.id !== deleteTargetId));
    }

    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleSetPrimary = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isPrimary: addr.id === id,
      }))
    );
  };

  const resetForm = () => {
    setFormData({
      label: "home",
      recipientName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      province: "",
      city: "",
      district: "",
      postalCode: "",
      notes: "",
      isPrimary: false,
    });
    setEditingAddress(null);
  };

  const getLabelConfig = (label) => {
    const configs = {
      home: { icon: Home, text: "Rumah", color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
      office: { icon: Briefcase, text: "Kantor", color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
      other: { icon: MapPin, text: "Lainnya", color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" },
    };
    return configs[label] || configs.other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Memuat alamat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 max-w-7xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alamat Saya</h2>
          <p className="text-muted-foreground mt-1">Kelola alamat pengiriman Anda</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Alamat Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Alamat" : "Tambah Alamat Baru"}</DialogTitle>
              <DialogDescription>{editingAddress ? "Perbarui informasi alamat Anda" : "Tambahkan alamat pengiriman baru untuk kemudahan berbelanja"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label Alamat</Label>
                <Select value={formData.label} onValueChange={(value) => handleInputChange("label", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Rumah
                      </div>
                    </SelectItem>
                    <SelectItem value="office">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Kantor
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Lainnya
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">Nama Penerima *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="recipientName" placeholder="Masukkan nama penerima" value={formData.recipientName} onChange={(e) => handleInputChange("recipientName", e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Nomor Telepon *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phoneNumber" placeholder="+62 812-xxxx-xxxx" value={formData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">Alamat Lengkap *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="addressLine1" placeholder="Nama jalan, nomor rumah" value={formData.addressLine1} onChange={(e) => handleInputChange("addressLine1", e.target.value)} className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Detail Alamat (Opsional)</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="addressLine2" placeholder="RT/RW, Blok, Unit, dll" value={formData.addressLine2} onChange={(e) => handleInputChange("addressLine2", e.target.value)} className="pl-9" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Provinsi *</Label>
                  <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DKI Jakarta">DKI Jakarta</SelectItem>
                      <SelectItem value="Jawa Barat">Jawa Barat</SelectItem>
                      <SelectItem value="Jawa Tengah">Jawa Tengah</SelectItem>
                      <SelectItem value="Jawa Timur">Jawa Timur</SelectItem>
                      <SelectItem value="Banten">Banten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Kota/Kabupaten *</Label>
                  <Input id="city" placeholder="Masukkan kota" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">Kecamatan *</Label>
                  <Input id="district" placeholder="Masukkan kecamatan" value={formData.district} onChange={(e) => handleInputChange("district", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kode Pos *</Label>
                  <Input id="postalCode" placeholder="12345" value={formData.postalCode} onChange={(e) => handleInputChange("postalCode", e.target.value)} maxLength={5} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Pengiriman (Opsional)</Label>
                <Textarea id="notes" placeholder="Contoh: Rumah cat putih, sebelah warung makan, dll" value={formData.notes} onChange={(e) => handleInputChange("notes", e.target.value)} rows={3} />
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <input type="checkbox" id="isPrimary" checked={formData.isPrimary} onChange={(e) => handleInputChange("isPrimary", e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                <div className="flex-1">
                  <Label htmlFor="isPrimary" className="font-medium cursor-pointer">
                    Jadikan alamat utama
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">Alamat utama akan otomatis dipilih saat checkout</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button onClick={handleSubmit}>{editingAddress ? "Simpan Perubahan" : "Tambah Alamat"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Belum ada alamat tersimpan</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">Tambahkan alamat pengiriman untuk mempermudah proses checkout saat berbelanja</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Alamat Pertama
            </Button>
          </CardContent>
        </Card>
      )}

      {addresses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const labelConfig = getLabelConfig(address.label);
            const LabelIcon = labelConfig.icon;

            return (
              <Card key={address.id} className={`relative ${address.isPrimary ? "border-2 border-primary" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${labelConfig.color}`}>
                        <LabelIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{labelConfig.text}</h3>
                          {address.isPrimary && (
                            <Badge variant="default" className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Utama
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Terakhir digunakan: {new Date(address.lastUsed).toLocaleDateString("id-ID")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">{address.recipientName}</p>
                        <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{address.addressLine1}</p>
                        {address.addressLine2 && <p className="text-sm">{address.addressLine2}</p>}
                        <p className="text-sm text-muted-foreground mt-1">
                          {address.district}, {address.city}, {address.province} {address.postalCode}
                        </p>
                      </div>
                    </div>

                    {address.notes && (
                      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">{address.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t">
                    {!address.isPrimary && (
                      <Button variant="outline" size="sm" onClick={() => handleSetPrimary(address.id)} className="flex-1">
                        <Star className="w-4 h-4 mr-2" />
                        Jadikan Utama
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleEdit(address)} className={address.isPrimary ? "flex-1" : ""}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(address.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tips Mengisi Alamat</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Pastikan nomor telepon aktif dan dapat dihubungi oleh kurir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Tuliskan patokan atau ciri khas lokasi untuk memudahkan pengiriman</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Gunakan alamat utama untuk alamat yang paling sering digunakan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Verifikasi kode pos untuk menghindari kesalahan pengiriman</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Alamat?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.
              {addresses.find((a) => a.id === deleteTargetId)?.isPrimary && addresses.length > 1 && <span className="block mt-2 text-orange-600 dark:text-orange-400 font-medium">Alamat berikutnya akan otomatis menjadi alamat utama.</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus Alamat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
