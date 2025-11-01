// app/api/products/search/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("q") || "";
    const categories = searchParams.get("categories") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999999");
    const inStock = searchParams.get("inStock") === "true";
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const sortBy = searchParams.get("sort") || "relevance";

    const skip = (page - 1) * limit;

    // Build where conditions
    const where = {
      status: "ACTIVE",
      ...(search && {
        OR: [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }, { sku: { contains: search, mode: "insensitive" } }],
      }),
      ...(categories && {
        category: { in: categories.split(",") },
      }),
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      ...(inStock && {
        stock: { gt: 0 },
      }),
    };

    // Determine sort order
    let orderBy = {};
    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
        orderBy = { orderItems: { _count: "desc" } };
        break;
      case "rating":
        orderBy = { createdAt: "desc" };
        break;
      default:
        // relevance - prioritize search match
        orderBy = search ? { name: "asc" } : { featured: "desc", createdAt: "desc" };
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    // Transform products
    const transformedProducts = products.map((product) => {
      const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : null;

      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: Number(product.price),
        originalPrice: product.comparePrice ? Number(product.comparePrice) : null,
        discount,
        stock: product.stock,
        category: product.category,
        image: product.images?.[0] || null,
        images: product.images || [],
        featured: product.featured,
        badge: getBadge(product),
        rating: null,
        reviewCount: 0,
        orderCount: product._count.orderItems,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        products: transformedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        query: search,
      },
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search products",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

function getBadge(product) {
  if (product.featured) return "Featured";
  if (product.category === "premium") return "Premium";
  if (product.category === "organic") return "Organic";
  if (product.comparePrice && product.comparePrice > product.price) return "Sale";
  return null;
}
