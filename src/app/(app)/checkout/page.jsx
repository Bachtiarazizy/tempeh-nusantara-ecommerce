// app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/shared/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, MapPin, CreditCard, Truck, Gift, ChevronRight, Plus, Edit2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart, isInitialized } = useCart();

  // State
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingShipping, setLoadingShipping] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch addresses
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Wait for cart to initialize from localStorage
  useEffect(() => {
    if (isInitialized) {
      console.log("Cart initialized:", { items, totalItems, totalPrice });
      setPageLoading(false);

      // Redirect if cart is empty after initialization
      if (items.length === 0) {
        toast.error("Keranjang kosong", {
          description: "Tambahkan produk ke keranjang terlebih dahulu",
        });
        router.push("/products?message=cart-empty");
      }
    }
  }, [isInitialized, items.length, router]);

  // Fetch shipping methods when address selected
  useEffect(() => {
    if (selectedAddress) {
      fetchShippingMethods();
    }
  }, [selectedAddress]);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await fetch("/api/buyer/addresses");

      if (!response.ok) throw new Error("Failed to fetch addresses");

      const data = await response.json();
      setAddresses(data.data || []);

      // Auto-select default address
      const defaultAddr = data.data.find((addr) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Gagal memuat alamat");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchShippingMethods = async () => {
    try {
      setLoadingShipping(true);
      const response = await fetch("/api/shipping/methods");

      if (!response.ok) throw new Error("Failed to fetch shipping methods");

      const data = await response.json();
      setShippingMethods(data.data || []);

      // Auto-select first shipping method
      if (data.data.length > 0) {
        setSelectedShipping(data.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
      toast.error("Gagal memuat metode pengiriman");
    } finally {
      setLoadingShipping(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate totals
  const subtotal = totalPrice;
  const selectedShippingMethod = shippingMethods.find((m) => m.id === selectedShipping);
  const shippingCost = selectedShippingMethod?.isFreeShipping ? 0 : selectedShippingMethod?.price || 0;
  const tax = 0; // Set tax calculation if needed
  const adminFee = selectedPayment === "COD" ? 5000 : 0;
  const total = subtotal + shippingCost + tax + adminFee;

  // Payment methods
  const paymentMethods = [
    {
      id: "BANK_TRANSFER",
      name: "Transfer Bank",
      description: "BCA, Mandiri, BNI, BRI",
      icon: "🏦",
      fee: 0,
    },
    {
      id: "EWALLET",
      name: "E-Wallet",
      description: "OVO, DANA, GoPay, ShopeePay",
      icon: "💳",
      fee: 0,
    },
    {
      id: "QRIS",
      name: "QRIS",
      description: "Scan QR untuk bayar",
      icon: "📱",
      fee: 0,
    },
    {
      id: "COD",
      name: "Cash on Delivery",
      description: "Bayar saat terima barang",
      icon: "💵",
      fee: 5000,
    },
  ];

  const handleCheckout = async () => {
    // Validation
    if (items.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }

    if (!selectedAddress) {
      toast.error("Pilih alamat pengiriman");
      return;
    }

    if (!selectedShipping) {
      toast.error("Pilih metode pengiriman");
      return;
    }

    if (!selectedPayment) {
      toast.error("Pilih metode pembayaran");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productSku: item.productId, // Use actual SKU if available
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
          weight: item.weight,
          productImage: item.image,
        })),
        shippingAddressId: selectedAddress,
        shippingMethodId: selectedShipping,
        paymentMethod: selectedPayment,
        customerNotes: customerNotes,
        subtotal: subtotal,
        shippingCost: shippingCost,
        tax: tax,
        adminFee: adminFee,
        total: total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Success
      toast.success("Pesanan berhasil dibuat!", {
        description: `Order #${data.data.orderNumber}`,
      });

      // Clear cart
      clearCart();

      // Redirect based on payment method
      if (data.data.xenditInvoiceUrl) {
        // Redirect to Xendit payment page
        window.location.href = data.data.xenditInvoiceUrl;
      } else {
        // Redirect to order detail page
        router.push(`/orders/${data.data.orderNumber}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Gagal membuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && items.length === 0) {
      router.push("/products");
    }
  }, [items.length, loading, router]);

  // Show loading while cart initializes
  if (pageLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-primary mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Memuat checkout...</h2>
          <p className="text-muted-foreground">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Keranjang Kosong</h2>
          <p className="text-muted-foreground mb-4">Yuk mulai belanja produk tempe premium kami!</p>
          <Button onClick={() => router.push("/products")}>Mulai Belanja</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Lengkapi informasi untuk menyelesaikan pesanan</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAddresses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Belum ada alamat tersimpan</p>
                    <Button variant="outline" onClick={() => router.push("/buyer/profile/addresses")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Alamat
                    </Button>
                  </div>
                ) : (
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddress === address.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={address.id} id={address.id} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Label htmlFor={address.id} className="font-semibold cursor-pointer">
                                  {address.fullName}
                                </Label>
                                {address.isDefault && (
                                  <Badge variant="secondary" className="text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{address.phone}</p>
                              <p className="text-sm">
                                {address.address}, {address.city}, {address.state} {address.postalCode}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/profile/addresses/${address.id}/edit`);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Metode Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedAddress ? (
                  <div className="text-center py-8 text-muted-foreground">Pilih alamat pengiriman terlebih dahulu</div>
                ) : loadingShipping ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : shippingMethods.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Tidak ada metode pengiriman tersedia</div>
                ) : (
                  <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedShipping === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                          onClick={() => setSelectedShipping(method.id)}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <Label htmlFor={method.id} className="font-semibold cursor-pointer">
                                  {method.courier} - {method.service}
                                </Label>
                                <span className="font-bold text-primary">{method.isFreeShipping ? <span className="text-emerald-600">GRATIS</span> : formatPrice(method.price)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">Estimasi {method.estimatedDays} hari</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Metode Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPayment === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{method.icon}</span>
                              <Label htmlFor={method.id} className="font-semibold cursor-pointer">
                                {method.name}
                              </Label>
                              {method.fee > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{formatPrice(method.fee)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Customer Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Catatan Pesanan (Opsional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Tambahkan catatan untuk pesanan Anda..." value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} rows={4} className="resize-none" />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Ringkasan Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product List */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.productName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{item.quantity}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{item.productName}</p>
                        <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({totalItems} item)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ongkir</span>
                    <span className="font-medium">{selectedShippingMethod?.isFreeShipping ? <span className="text-emerald-600 font-semibold">GRATIS</span> : formatPrice(shippingCost)}</span>
                  </div>
                  {adminFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Biaya Admin</span>
                      <span className="font-medium">{formatPrice(adminFee)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                <Button size="lg" className="w-full" onClick={handleCheckout} disabled={loading || !selectedAddress || !selectedShipping || !selectedPayment}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Bayar Sekarang
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Security Info */}
                <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Transaksi aman dan terlindungi. Data Anda terenkripsi.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
