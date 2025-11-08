"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit2, Trash2, Loader2, Home, Building, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ManageAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    label: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/buyer/addresses");

      if (!response.ok) throw new Error("Failed to fetch addresses");

      const data = await response.json();
      setAddresses(data.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Gagal memuat alamat");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const url = editingAddress ? `/api/buyer/addresses/${editingAddress.id}` : "/api/buyer/addresses";

      const method = editingAddress ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save address");
      }

      toast.success(editingAddress ? "Alamat berhasil diperbarui" : "Alamat berhasil ditambahkan");

      setIsDialogOpen(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan alamat");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      label: address.label || "",
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm("Yakin ingin menghapus alamat ini?")) return;

    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete address");

      toast.success("Alamat berhasil dihapus");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Gagal menghapus alamat");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}/set-default`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to set default address");

      toast.success("Alamat default berhasil diubah");
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default:", error);
      toast.error("Gagal mengubah alamat default");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      label: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const labelIcons = {
    Rumah: Home,
    Kantor: Building,
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Alamat Saya</h1>
            <p className="text-muted-foreground">Kelola alamat pengiriman Anda</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Alamat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAddress ? "Edit Alamat" : "Tambah Alamat Baru"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap *</Label>
                    <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon *</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="label">Label Alamat</Label>
                  <Input id="label" placeholder="Rumah, Kantor, dll" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota/Kabupaten *</Label>
                    <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Provinsi *</Label>
                    <Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kode Pos *</Label>
                  <Input id="postalCode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} required />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} className="w-4 h-4" />
                  <Label htmlFor="isDefault" className="cursor-pointer">
                    Jadikan alamat utama
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Alamat"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Address List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Alamat</h3>
              <p className="text-muted-foreground text-center mb-4">Tambahkan alamat pengiriman untuk mempermudah checkout</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => {
              const LabelIcon = address.label ? labelIcons[address.label] || MapPin : MapPin;

              return (
                <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <LabelIcon className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-lg">{address.fullName}</h3>
                          {address.isDefault && (
                            <Badge className="ml-2">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Default
                            </Badge>
                          )}
                          {address.label && <Badge variant="secondary">{address.label}</Badge>}
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>{address.phone}</p>
                          <p>
                            {address.address}, {address.city}, {address.state} {address.postalCode}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(address.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {!address.isDefault && (
                      <div className="mt-4 pt-4 border-t">
                        <Button variant="ghost" size="sm" onClick={() => handleSetDefault(address.id)}>
                          Jadikan Alamat Utama
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
