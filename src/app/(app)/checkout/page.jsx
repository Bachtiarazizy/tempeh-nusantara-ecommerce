// app/checkout/page.jsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CheckoutClient from "@/components/shared/checkout-client";

// Server Component - Fetch cart data
export default async function CheckoutPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session) {
    redirect("/login?redirect=/checkout");
  }

  // Fetch user's active cart with items
  const cart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              sku: true,
              name: true,
              slug: true,
              price: true,
              comparePrice: true,
              stock: true,
              images: true,
              category: true,
              status: true,
            },
          },
        },
      },
    },
  });

  // Redirect if cart is empty
  if (!cart || cart.items.length === 0) {
    redirect("/products?message=cart-empty");
  }

  // Get user's saved addresses
  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      isDefault: "desc",
    },
  });

  // Transform cart data for client
  const transformedCart = {
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      slug: item.product.slug,
      price: Number(item.product.price),
      originalPrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
      quantity: item.quantity,
      variant: item.variant || null,
      weight: item.weight || null,
      image: item.product.images?.[0] || null,
      stock: item.product.stock,
      category: item.product.category,
      isAvailable: item.product.status === "ACTIVE" && item.product.stock >= item.quantity,
    })),
    totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
  };

  // Transform addresses
  const transformedAddresses = addresses.map((addr) => ({
    id: addr.id,
    fullName: addr.fullName,
    phone: addr.phone,
    address: addr.address,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    country: addr.country || "Indonesia",
    isDefault: addr.isDefault,
  }));

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  // Get available shipping methods
  const shippingMethods = await prisma.shippingMethod.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
  });

  const transformedShipping = shippingMethods.map((method) => ({
    id: method.id,
    name: method.name,
    description: method.description,
    price: Number(method.price),
    estimatedDays: method.estimatedDays,
    minOrderAmount: method.minOrderAmount ? Number(method.minOrderAmount) : null,
  }));

  return <CheckoutClient cart={transformedCart} user={user} addresses={transformedAddresses} shippingMethods={transformedShipping} />;
}

// Metadata for SEO
export const metadata = {
  title: "Checkout | Selesaikan Pemesanan Anda",
  description: "Selesaikan pemesanan tempe berkualitas tinggi Anda dengan proses checkout yang aman dan mudah.",
  robots: "noindex, nofollow", // Prevent indexing of checkout pages
};

// Enable dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0; // Don't cache checkout pages
