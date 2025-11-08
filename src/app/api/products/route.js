import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    
    // Search
    const q = searchParams.get("q") || "";
    
    // Filters
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999999");
    const inStock = searchParams.get("inStock") === "true";
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const onSale = searchParams.get("onSale") === "true";
    
    // Sort
    const sort = searchParams.get("sort") || "relevance";

    // Build where clause
    const where = {
      status: "ACTIVE",
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(categories.length > 0 && {
        category: {
          in: categories.map(cat => cat.toLowerCase()),
          mode: "insensitive",
        },
      }),
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      ...(inStock && {
        stock: {
          gt: 0,
        },
      }),
      ...(minRating > 0 && {
        rating: {
          gte: minRating,
        },
      }),
      ...(onSale && {
        comparePrice: {
          not: null,
          gt: prisma.product.fields.price,
        },
      }),
    };

    // Build orderBy
    let orderBy = {};
    switch (sort) {
      case "popular":
        orderBy = { sales: "desc" };
        break;
      case "best-sellers":
        orderBy = { sales: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "relevance":
      default:
        orderBy = [
          { featured: "desc" },
          { sales: "desc" },
          { rating: "desc" },
        ];
        break;
    }

    // Get total count
    const total = await prisma.product.count({ where });

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
        images: true,
        category: true,
        rating: true,
        reviewCount: true,
        sales: true,
        featured: true,
      },
    });

    // Format products for response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.comparePrice,
      image: product.images[0] || null,
      images: product.images,
      category: product.category,
      rating: product.rating || 0,
      reviewCount: product.reviewCount,
      sales: product.sales,
      stock: product.stock,
      badge: product.featured ? "Featured" : null,
      discount: product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        products: formattedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: error.message,
      },
      { status: 500 }
    );
  }
}