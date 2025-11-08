// app/api/wishlist/toggle/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// POST - Toggle product in wishlist
export async function POST(request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    // Get or create wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: session.user.id },
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        sku: true,
        name: true,
        price: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Check if item already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: productId,
        },
      },
    });

    let action = "";
    let item = null;

    if (existingItem) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
      action = "removed";
    } else {
      // Add to wishlist
      item = await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: product.id,
          productSku: product.sku,
          productName: product.name,
          price: product.price,
          image: product.images[0] || null,
        },
      });
      action = "added";
    }

    return NextResponse.json({
      success: true,
      action,
      data: item,
      message: action === "added" ? "Product added to wishlist" : "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to toggle wishlist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
