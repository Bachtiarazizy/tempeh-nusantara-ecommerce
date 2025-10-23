// app/api/products/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "100000");

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {
      status: "ACTIVE",
      ...(search && {
        OR: [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }, { category: { contains: search, mode: "insensitive" } }],
      }),
      ...(category && category !== "all" && { category }),
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    // DEBUG: Log filter conditions
    console.log("=== PRODUCTS API DEBUG ===");
    console.log("Filter conditions:", JSON.stringify(where, null, 2));
    console.log("Search params:", { page, limit, search, category, sortBy, minPrice, maxPrice });

    // Tentukan order by
    let orderBy = {};
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "name":
      default:
        orderBy = { name: "asc" };
        break;
    }

    // Get total count
    const total = await prisma.product.count({ where });
    console.log("Total products found:", total);

    // Get products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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
        status: true, // Tambahkan ini untuk debug
        createdAt: true,
      },
    });

    console.log("Products retrieved:", products.length);
    if (products.length > 0) {
      console.log("First product:", products[0]);
    }

    // Format products untuk frontend
    const formattedProducts = products.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
      stock: product.stock,
      weight: product.weight,
      category: product.category,
      image: product.images[0] || "/images/placeholder-product.png",
      images: product.images,
      badge: product.featured ? "Featured" : product.stock < 10 && product.stock > 0 ? "Low Stock" : product.stock === 0 ? "Out of Stock" : null,
      rating: 4.5,
      inStock: product.stock > 0,
    }));

    const response = {
      success: true,
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    };

    console.log("Response pagination:", response.pagination);
    console.log("=== END DEBUG ===\n");

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
