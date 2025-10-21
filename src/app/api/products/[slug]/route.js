// app/api/products/[slug]/route.js

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Detail produk by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Get product by slug
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        status: "ACTIVE", // Hanya produk aktif
      },
      select: {
        id: true,
        sku: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        comparePrice: true,
        stock: true,
        weight: true,
        category: true,
        images: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get related products (same category, exclude current product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        status: "ACTIVE",
        id: {
          not: product.id, // Exclude current product
        },
      },
      take: 4,
      orderBy: {
        featured: "desc", // Prioritize featured products
      },
      select: {
        id: true,
        sku: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        comparePrice: true,
        stock: true,
        weight: true,
        category: true,
        images: true,
        featured: true,
      },
    });

    // Format product untuk frontend
    const formattedProduct = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      longDescription: product.description || "", // Bisa dipisah jika ada field terpisah
      price: parseFloat(product.price),
      originalPrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
      stock: product.stock,
      stockQuantity: product.stock,
      weight: product.weight || "500g",
      category: product.category,
      image: product.images[0] || "/images/placeholder-product.png",
      images: product.images,

      // Additional info
      inStock: product.stock > 0,
      isNew: false, // Bisa dihitung dari createdAt jika perlu
      isOnSale: product.comparePrice && product.comparePrice > product.price,
      discount: product.comparePrice ? Math.round(((parseFloat(product.comparePrice) - parseFloat(product.price)) / parseFloat(product.comparePrice)) * 100) : 0,

      // Default values - bisa ditambahkan ke schema jika perlu
      rating: 4.5,
      reviewCount: 128,
      tags: ["Organic", "High Protein"],

      // Variants & Weights - hardcoded untuk sekarang, bisa ditambahkan ke schema
      variants: ["Original", "Smoked", "Marinated"],
      weights: [
        { label: "250g", value: "250g", price: parseFloat(product.price) * 0.5, selected: false },
        { label: "500g", value: "500g", price: parseFloat(product.price), selected: true },
        { label: "1kg", value: "1kg", price: parseFloat(product.price) * 1.8, selected: false },
      ],

      // Instructions
      storageInstructions: "Keep refrigerated at 4°C or below",
      cookingInstructions: "Pan fry for 3-5 minutes until golden brown",

      // Nutrition (example data)
      nutritionPer100g: {
        calories: 193,
        protein: 20.7,
        carbs: 7.6,
        fat: 10.8,
        fiber: 4.5,
        sodium: 9,
      },

      // Ingredients
      ingredients: ["Organic Soybeans", "Water", "Vinegar", "Tempeh Starter Culture"],
      allergens: ["Soy"],
    };

    // Format related products
    const formattedRelated = relatedProducts.map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      price: parseFloat(p.price),
      comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
      stock: p.stock,
      weight: p.weight,
      category: p.category,
      image: p.images[0] || "/images/placeholder-product.png",
      images: p.images,
      badge: p.featured ? "Featured" : p.stock < 10 && p.stock > 0 ? "Low Stock" : null,
      rating: 4.5,
      inStock: p.stock > 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        product: formattedProduct,
        relatedProducts: formattedRelated,
      },
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch product details",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
