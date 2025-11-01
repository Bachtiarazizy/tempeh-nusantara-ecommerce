// components/shared/checkout-client.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, MapPin, User, Mail, Phone, Home, Package, Truck, ShieldCheck, AlertCircle, Plus, Check } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutClient = ({ cart, user, addresses, shippingMethods }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm cart={cart} user={user} addresses={addresses} shippingMethods={shippingMethods} />
    </Elements>
  );
};

const CheckoutForm = ({ cart, user, addresses, shippingMethods }) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addresses.find((a) => a.isDefault)?.id || null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Indonesia",
  });

  // Set default shipping if available
  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedShipping) {
      setSelectedShipping(shippingMethods[0].id);
    }
  }, [shippingMethods, selectedShipping]);

  // Load selected address data
  useEffect(() => {
    if (selectedAddress && !showNewAddress) {
      const addr = addresses.find((a) => a.id === selectedAddress);
      if (addr) {
        setShippingInfo({
          fullName: addr.fullName,
          email: user?.email || "",
          phone: addr.phone,
          address: addr.address,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: addr.country,
        });
      }
    }
  }, [selectedAddress, addresses, user, showNewAddress]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = cart.subtotal;
  const shippingCost = shippingMethods.find((m) => m.id === selectedShipping)?.price || 0;
  const tax = subtotal * 0.11; // 11% PPN
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!showNewAddress && !selectedAddress) {
      setError("Pilih alamat pengiriman");
      return false;
    }

    if (!selectedShipping) {
      setError("Pilih metode pengiriman");
      return false;
    }

    const required = ["fullName", "email", "phone", "address", "city", "state", "postalCode"];
    for (let field of required) {
      if (!shippingInfo[field]?.trim()) {
        setError(`Field ${field} harus diisi`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setError("Email tidak valid");
      return false;
    }

    // Check stock availability
    const unavailableItems = cart.items.filter((item) => !item.isAvailable);
    if (unavailableItems.length > 0) {
      setError("Beberapa item tidak tersedia atau stok tidak mencukupi");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    if (!stripe || !elements) {
      setError("Stripe belum siap. Silakan coba lagi.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create payment intent and order
      const response = await fetch("/api/checkout/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cart.id,
          shippingInfo,
          shippingMethodId: selectedShipping,
          saveAddress: showNewAddress && saveAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      const { clientSecret, orderId } = data;

      // Step 2: Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: shippingInfo.fullName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.postalCode,
              country: "ID",
            },
          },
        },
      });

      if (stripeError) {
        // Update order status to failed
        await fetch("/api/checkout/payment-failed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, error: stripeError.message }),
        });

        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Confirm order success
        await fetch("/api/checkout/payment-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            paymentIntentId: paymentIntent.id,
          }),
        });

        setSuccess(true);

        // Redirect to success page
        setTimeout(() => {
          router.push(`/order-success?order_id=${orderId}`);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Pembayaran Berhasil!</h2>
          <p className="text-muted-foreground">Terima kasih atas pembelian Anda. Anda akan diarahkan ke halaman konfirmasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">Lengkapi informasi pengiriman dan pembayaran Anda</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Selection */}
            {addresses.length > 0 && !showNewAddress && (
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Pilih Alamat Pengiriman</h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowNewAddress(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Alamat Baru
                  </Button>
                </div>

                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                        <label htmlFor={addr.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{addr.fullName}</span>
                            {addr.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>}
                          </div>
                          <p className="text-sm text-muted-foreground">{addr.phone}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {addr.address}, {addr.city}, {addr.state} {addr.postalCode}
                          </p>
                        </label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* New Address Form */}
            {(showNewAddress || addresses.length === 0) && (
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Informasi Pengiriman</h2>
                  </div>
                  {addresses.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => setShowNewAddress(false)}>
                      Pilih Alamat Tersimpan
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nama Lengkap *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input id="fullName" name="fullName" placeholder="John Doe" className="pl-10" value={shippingInfo.fullName} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input id="email" name="email" type="email" placeholder="john@example.com" className="pl-10" value={shippingInfo.email} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="phone" name="phone" placeholder="+62 812 3456 7890" className="pl-10" value={shippingInfo.phone} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat Lengkap *</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="address" name="address" placeholder="Jl. Contoh No. 123" className="pl-10" value={shippingInfo.address} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Kota *</Label>
                      <Input id="city" name="city" placeholder="Jakarta" value={shippingInfo.city} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">Provinsi *</Label>
                      <Input id="state" name="state" placeholder="DKI Jakarta" value={shippingInfo.state} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Kode Pos *</Label>
                      <Input id="postalCode" name="postalCode" placeholder="12345" value={shippingInfo.postalCode} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Negara</Label>
                      <Input id="country" name="country" value={shippingInfo.country} disabled className="bg-muted" />
                    </div>
                  </div>

                  {showNewAddress && (
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="saveAddress" checked={saveAddress} onCheckedChange={setSaveAddress} />
                      <label htmlFor="saveAddress" className="text-sm text-muted-foreground cursor-pointer">
                        Simpan alamat ini untuk pemesanan berikutnya
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Methods */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Metode Pengiriman</h2>
              </div>

              <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                <div className="space-y-3">
                  {shippingMethods.map((method) => {
                    const isDisabled = method.minOrderAmount && subtotal < method.minOrderAmount;
                    return (
                      <div key={method.id} className={`flex items-start gap-3 p-4 border rounded-lg ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50 cursor-pointer"}`}>
                        <RadioGroupItem value={method.id} id={method.id} disabled={isDisabled} className="mt-1" />
                        <label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">{method.name}</span>
                            <span className="font-bold text-primary">{method.price === 0 ? "GRATIS" : formatPrice(method.price)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Estimasi: {method.estimatedDays} hari kerja</p>
                          {isDisabled && <p className="text-xs text-destructive mt-1">Minimum pembelian {formatPrice(method.minOrderAmount)}</p>}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            {/* Payment Information */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Informasi Pembayaran</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Detail Kartu</Label>
                  <div className="border rounded-md p-3 bg-background">
                    <CardElement options={cardElementOptions} />
                  </div>
                  <p className="text-xs text-muted-foreground">Pembayaran Anda aman dan terenkripsi dengan Stripe</p>
                </div>

                <Alert>
                  <ShieldCheck className="w-4 h-4" />
                  <AlertDescription className="text-sm">Kami menggunakan enkripsi SSL 256-bit untuk melindungi informasi pembayaran Anda. Data kartu tidak disimpan di server kami.</AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Ringkasan Pesanan</h2>

              <div className="space-y-3 mb-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.productName} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.productName}</h4>
                      {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                      {!item.isAvailable && <p className="text-xs text-destructive mt-1">Stok tidak tersedia</p>}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cart.totalItems} item)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span className={shippingCost === 0 ? "text-emerald-600 font-medium" : ""}>{shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PPN (11%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
              </div>

              <Button className="w-full h-12 text-base" size="lg" onClick={handleSubmit} disabled={loading || !stripe}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  `Bayar ${formatPrice(total)}`
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Dengan melanjutkan, Anda menyetujui{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Syarat & Ketentuan
                </a>{" "}
                kami
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutClient;
