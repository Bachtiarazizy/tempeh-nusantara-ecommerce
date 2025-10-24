"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Building2, Wallet, Plus, Edit, Trash2, Star, Shield, CheckCircle2, AlertCircle, Eye, EyeOff, Smartphone } from "lucide-react";

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [showCVV, setShowCVV] = useState(false);
  const [formData, setFormData] = useState({
    type: "card",
    cardNumber: "",
    cardHolderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    ewalletProvider: "",
    ewalletPhone: "",
    isPrimary: false,
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockMethods = [
        {
          id: "PM001",
          type: "card",
          cardType: "visa",
          cardNumber: "4532********1234",
          cardHolderName: "AHMAD HIDAYAT",
          expiryMonth: "12",
          expiryYear: "2026",
          bankName: "Bank BCA",
          isPrimary: true,
          isVerified: true,
          addedAt: "2024-01-15",
          lastUsed: "2024-10-20",
        },
        {
          id: "PM002",
          type: "card",
          cardType: "mastercard",
          cardNumber: "5412********8765",
          cardHolderName: "AHMAD HIDAYAT",
          expiryMonth: "08",
          expiryYear: "2025",
          bankName: "Bank Mandiri",
          isPrimary: false,
          isVerified: true,
          addedAt: "2024-03-10",
          lastUsed: "2024-10-15",
        },
        {
          id: "PM003",
          type: "bank",
          bankName: "Bank BNI",
          accountNumber: "1234567890",
          accountHolderName: "Ahmad Hidayat",
          isPrimary: false,
          isVerified: true,
          addedAt: "2024-02-20",
          lastUsed: "2024-09-10",
        },
        {
          id: "PM004",
          type: "ewallet",
          ewalletProvider: "GoPay",
          ewalletPhone: "+62 812-3456-7890",
          isPrimary: false,
          isVerified: true,
          addedAt: "2024-04-05",
          lastUsed: "2024-10-22",
        },
        {
          id: "PM005",
          type: "ewallet",
          ewalletProvider: "OVO",
          ewalletPhone: "+62 812-3456-7890",
          isPrimary: false,
          isVerified: true,
          addedAt: "2024-05-12",
          lastUsed: "2024-10-18",
        },
      ];
      setPaymentMethods(mockMethods);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const requiredFields = {
      card: ["cardNumber", "cardHolderName", "expiryMonth", "expiryYear", "cvv"],
      bank: ["bankName", "accountNumber", "accountHolderName"],
      ewallet: ["ewalletProvider", "ewalletPhone"],
    };

    const fields = requiredFields[formData.type];
    const isValid = fields.every((field) => formData[field]?.trim());

    if (!isValid) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    if (editingMethod) {
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === editingMethod.id
            ? {
                ...method,
                ...formData,
                cardNumber: formData.type === "card" ? maskCardNumber(formData.cardNumber) : undefined,
                lastUsed: new Date().toISOString().split("T")[0],
              }
            : formData.isPrimary
            ? { ...method, isPrimary: false }
            : method
        )
      );
    } else {
      const newMethod = {
        id: `PM${String(paymentMethods.length + 1).padStart(3, "0")}`,
        ...formData,
        cardNumber: formData.type === "card" ? maskCardNumber(formData.cardNumber) : undefined,
        cardType: formData.type === "card" ? detectCardType(formData.cardNumber) : undefined,
        isVerified: false,
        addedAt: new Date().toISOString().split("T")[0],
        lastUsed: new Date().toISOString().split("T")[0],
      };

      if (formData.isPrimary) {
        setPaymentMethods((prev) => [newMethod, ...prev.map((m) => ({ ...m, isPrimary: false }))]);
      } else {
        setPaymentMethods((prev) => [...prev, newMethod]);
      }
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const maskCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    return cleaned.slice(0, 4) + "********" + cleaned.slice(-4);
  };

  const detectCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "visa";
    if (cleaned.startsWith("5")) return "mastercard";
    if (cleaned.startsWith("3")) return "amex";
    return "unknown";
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      cardNumber: method.cardNumber || "",
      cardHolderName: method.cardHolderName || "",
      expiryMonth: method.expiryMonth || "",
      expiryYear: method.expiryYear || "",
      cvv: "",
      bankName: method.bankName || "",
      accountNumber: method.accountNumber || "",
      accountHolderName: method.accountHolderName || "",
      ewalletProvider: method.ewalletProvider || "",
      ewalletPhone: method.ewalletPhone || "",
      isPrimary: method.isPrimary,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const methodToDelete = paymentMethods.find((m) => m.id === deleteTargetId);

    if (methodToDelete?.isPrimary && paymentMethods.length > 1) {
      setPaymentMethods((prev) => {
        const filtered = prev.filter((m) => m.id !== deleteTargetId);
        if (filtered.length > 0) {
          filtered[0].isPrimary = true;
        }
        return filtered;
      });
    } else {
      setPaymentMethods((prev) => prev.filter((m) => m.id !== deleteTargetId));
    }

    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleSetPrimary = (id) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isPrimary: method.id === id,
      }))
    );
  };

  const resetForm = () => {
    setFormData({
      type: "card",
      cardNumber: "",
      cardHolderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      ewalletProvider: "",
      ewalletPhone: "",
      isPrimary: false,
    });
    setEditingMethod(null);
  };

  const getCardLogo = (cardType) => {
    const logos = {
      visa: "🔵",
      mastercard: "🔴",
      amex: "🔷",
    };
    return logos[cardType] || "💳";
  };

  const getEwalletLogo = (provider) => {
    const logos = {
      GoPay: "🟢",
      OVO: "🟣",
      DANA: "🔵",
      ShopeePay: "🟠",
      LinkAja: "🔴",
    };
    return logos[provider] || "📱";
  };

  const filteredMethods = paymentMethods.filter((method) => {
    if (selectedTab === "cards") return method.type === "card";
    if (selectedTab === "banks") return method.type === "bank";
    if (selectedTab === "ewallets") return method.type === "ewallet";
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Memuat metode pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Metode Pembayaran</h2>
          <p className="text-muted-foreground mt-1">Kelola kartu kredit, rekening bank, dan e-wallet Anda</p>
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
              Tambah Metode Pembayaran
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMethod ? "Edit Metode Pembayaran" : "Tambah Metode Pembayaran"}</DialogTitle>
              <DialogDescription>{editingMethod ? "Perbarui informasi metode pembayaran Anda" : "Tambahkan metode pembayaran baru untuk kemudahan transaksi"}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tipe Pembayaran</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)} disabled={!!editingMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Kartu Kredit/Debit
                      </div>
                    </SelectItem>
                    <SelectItem value="bank">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Transfer Bank
                      </div>
                    </SelectItem>
                    <SelectItem value="ewallet">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        E-Wallet
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "card" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Nomor Kartu *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\s/g, "")
                            .replace(/(.{4})/g, "$1 ")
                            .trim();
                          handleInputChange("cardNumber", value);
                        }}
                        maxLength={19}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardHolderName">Nama Pemegang Kartu *</Label>
                    <Input id="cardHolderName" placeholder="Sesuai yang tertera di kartu" value={formData.cardHolderName} onChange={(e) => handleInputChange("cardHolderName", e.target.value.toUpperCase())} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tanggal Kadaluarsa *</Label>
                      <div className="flex gap-2">
                        <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange("expiryMonth", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange("expiryYear", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="YY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <SelectItem key={year} value={String(year)}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV/CVC *</Label>
                      <div className="relative">
                        <Input id="cvv" type={showCVV ? "text" : "password"} placeholder="123" value={formData.cvv} onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))} maxLength={4} />
                        <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1 h-7 w-7 p-0" onClick={() => setShowCVV(!showCVV)}>
                          {showCVV ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName">Nama Bank (Opsional)</Label>
                    <Select value={formData.bankName} onValueChange={(value) => handleInputChange("bankName", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bank BCA">Bank BCA</SelectItem>
                        <SelectItem value="Bank Mandiri">Bank Mandiri</SelectItem>
                        <SelectItem value="Bank BNI">Bank BNI</SelectItem>
                        <SelectItem value="Bank BRI">Bank BRI</SelectItem>
                        <SelectItem value="Bank CIMB Niaga">Bank CIMB Niaga</SelectItem>
                        <SelectItem value="Bank Permata">Bank Permata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {formData.type === "bank" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bankNameTransfer">Nama Bank *</Label>
                    <Select value={formData.bankName} onValueChange={(value) => handleInputChange("bankName", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bank BCA">Bank BCA</SelectItem>
                        <SelectItem value="Bank Mandiri">Bank Mandiri</SelectItem>
                        <SelectItem value="Bank BNI">Bank BNI</SelectItem>
                        <SelectItem value="Bank BRI">Bank BRI</SelectItem>
                        <SelectItem value="Bank CIMB Niaga">Bank CIMB Niaga</SelectItem>
                        <SelectItem value="Bank Permata">Bank Permata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Nomor Rekening *</Label>
                    <Input id="accountNumber" placeholder="Masukkan nomor rekening" value={formData.accountNumber} onChange={(e) => handleInputChange("accountNumber", e.target.value.replace(/\D/g, ""))} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Nama Pemegang Rekening *</Label>
                    <Input id="accountHolderName" placeholder="Sesuai rekening bank" value={formData.accountHolderName} onChange={(e) => handleInputChange("accountHolderName", e.target.value)} />
                  </div>
                </>
              )}

              {formData.type === "ewallet" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ewalletProvider">Provider E-Wallet *</Label>
                    <Select value={formData.ewalletProvider} onValueChange={(value) => handleInputChange("ewalletProvider", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GoPay">GoPay</SelectItem>
                        <SelectItem value="OVO">OVO</SelectItem>
                        <SelectItem value="DANA">DANA</SelectItem>
                        <SelectItem value="ShopeePay">ShopeePay</SelectItem>
                        <SelectItem value="LinkAja">LinkAja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ewalletPhone">Nomor Telepon E-Wallet *</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="ewalletPhone" placeholder="+62 812-xxxx-xxxx" value={formData.ewalletPhone} onChange={(e) => handleInputChange("ewalletPhone", e.target.value)} className="pl-9" />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <input type="checkbox" id="isPrimary" checked={formData.isPrimary} onChange={(e) => handleInputChange("isPrimary", e.target.checked)} className="w-4 h-4 rounded border-gray-300" />
                <div className="flex-1">
                  <Label htmlFor="isPrimary" className="font-medium cursor-pointer">
                    Jadikan metode pembayaran utama
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">Akan otomatis dipilih saat checkout</p>
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
              <Button onClick={handleSubmit}>{editingMethod ? "Simpan Perubahan" : "Tambah Metode"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Metode</p>
                <p className="text-2xl font-bold">{paymentMethods.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Kartu</p>
                <p className="text-2xl font-bold">{paymentMethods.filter((m) => m.type === "card").length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bank</p>
                <p className="text-2xl font-bold">{paymentMethods.filter((m) => m.type === "bank").length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">E-Wallet</p>
                <p className="text-2xl font-bold">{paymentMethods.filter((m) => m.type === "ewallet").length}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="cards">Kartu</TabsTrigger>
          <TabsTrigger value="banks">Bank</TabsTrigger>
          <TabsTrigger value="ewallets">E-Wallet</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {filteredMethods.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Wallet className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Belum ada metode pembayaran</h3>
                <p className="text-muted-foreground text-center mb-6">Tambahkan metode pembayaran untuk mempermudah transaksi</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Metode Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMethods.map((method) => (
                <Card key={method.id} className={`relative ${method.isPrimary ? "border-2 border-primary" : ""}`}>
                  <CardContent className="p-6">
                    {method.type === "card" && (
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{getCardLogo(method.cardType)}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{method.bankName || "Kartu Kredit"}</h3>
                                {method.isPrimary && (
                                  <Badge variant="default" className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Utama
                                  </Badge>
                                )}
                              </div>
                              {method.isVerified && (
                                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Terverifikasi
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Nomor Kartu</span>
                            <span className="font-mono">{method.cardNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Pemegang Kartu</span>
                            <span className="font-medium">{method.cardHolderName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Berlaku Hingga</span>
                            <span className="font-medium">
                              {method.expiryMonth}/{method.expiryYear}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t">
                          {!method.isPrimary && (
                            <Button variant="outline" size="sm" onClick={() => handleSetPrimary(method.id)} className="flex-1">
                              <Star className="w-4 h-4 mr-2" />
                              Jadikan Utama
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleEdit(method)} className={method.isPrimary ? "flex-1" : ""}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(method.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {method.type === "bank" && (
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{method.bankName}</h3>
                                {method.isPrimary && (
                                  <Badge variant="default" className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Utama
                                  </Badge>
                                )}
                              </div>
                              {method.isVerified && (
                                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Terverifikasi
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Nomor Rekening</span>
                            <span className="font-mono">{method.accountNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Nama Pemegang</span>
                            <span className="font-medium">{method.accountHolderName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Terakhir Digunakan</span>
                            <span className="text-sm">{new Date(method.lastUsed).toLocaleDateString("id-ID")}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t">
                          {!method.isPrimary && (
                            <Button variant="outline" size="sm" onClick={() => handleSetPrimary(method.id)} className="flex-1">
                              <Star className="w-4 h-4 mr-2" />
                              Jadikan Utama
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleEdit(method)} className={method.isPrimary ? "flex-1" : ""}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(method.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {method.type === "ewallet" && (
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-4xl">{getEwalletLogo(method.ewalletProvider)}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{method.ewalletProvider}</h3>
                                {method.isPrimary && (
                                  <Badge variant="default" className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    Utama
                                  </Badge>
                                )}
                              </div>
                              {method.isVerified && (
                                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Terverifikasi
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Nomor Telepon</span>
                            <span className="font-mono">{method.ewalletPhone}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Terakhir Digunakan</span>
                            <span className="text-sm">{new Date(method.lastUsed).toLocaleDateString("id-ID")}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t">
                          {!method.isPrimary && (
                            <Button variant="outline" size="sm" onClick={() => handleSetPrimary(method.id)} className="flex-1">
                              <Star className="w-4 h-4 mr-2" />
                              Jadikan Utama
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleEdit(method)} className={method.isPrimary ? "flex-1" : ""}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(method.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>

      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Keamanan Metode Pembayaran</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Semua informasi pembayaran dienkripsi dengan standar keamanan PCI DSS Level 1</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Kami tidak menyimpan CVV/CVC kartu Anda untuk keamanan maksimal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Verifikasi 3D Secure untuk transaksi kartu kredit yang lebih aman</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Sistem deteksi fraud otomatis melindungi setiap transaksi Anda</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tips Menggunakan Metode Pembayaran</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Pastikan informasi kartu atau rekening yang Anda masukkan benar dan aktif</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Gunakan metode pembayaran utama untuk checkout lebih cepat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Perbarui tanggal kadaluarsa kartu sebelum melakukan transaksi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Hapus metode pembayaran yang sudah tidak digunakan untuk keamanan</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Metode Pembayaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus metode pembayaran ini? Tindakan ini tidak dapat dibatalkan.
              {paymentMethods.find((m) => m.id === deleteTargetId)?.isPrimary && paymentMethods.length > 1 && (
                <span className="block mt-2 text-orange-600 dark:text-orange-400 font-medium">Metode pembayaran berikutnya akan otomatis menjadi metode utama.</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus Metode
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
