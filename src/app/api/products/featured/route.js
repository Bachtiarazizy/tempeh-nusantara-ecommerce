import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");
    const category = searchParams.get("category") || "";

    // Build filter conditions
    const where = {
      featured: true,
      status: "ACTIVE",
    };

    if (category && category !== "all") {
      where.category = {
        contains: category,
        mode: "insensitive",
      };
    }

    // Fetch featured products
    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: [{ featured: "desc" }, { sales: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        price: true,
        comparePrice: true,
        rating: true,
        reviewCount: true,
        images: true,
        featured: true,
        sales: true,
        status: true,
        stock: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch featured products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, featured } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Update product featured status
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        featured: featured !== undefined ? featured : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product featured status updated",
      data: product,
    });
  } catch (error) {
    console.error("Error updating featured status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update featured status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
