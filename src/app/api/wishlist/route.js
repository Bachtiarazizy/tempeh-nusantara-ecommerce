// app/api/wishlist/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get user's wishlist
export async function GET(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get or create wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                comparePrice: true,
                stock: true,
                images: true,
                status: true,
                category: true,
              },
            },
          },
          orderBy: [{ createdAt: "desc" }],
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        wishlist,
        itemCount: wishlist.items.length,
      },
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

// POST - Add item to wishlist
export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
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

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json({ success: false, error: "Product already in wishlist" }, { status: 400 });
    }

    // Add to wishlist
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
        productSku: product.sku,
        productName: product.name,
        price: product.price,
        image: product.images?.[0] || null,
      },
    });

    // Get updated wishlist
    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlist.id },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: [{ createdAt: "desc" }],
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      data: {
        wishlist: updatedWishlist,
        itemCount: updatedWishlist.items.length,
      },
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json({ success: false, error: "Failed to add to wishlist" }, { status: 500 });
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    // Get wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
    });

    if (!wishlist) {
      return NextResponse.json({ success: false, error: "Wishlist not found" }, { status: 404 });
    }

    // Delete item
    await prisma.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    // Get updated wishlist
    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlist.id },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: [{ createdAt: "desc" }],
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
      data: {
        wishlist: updatedWishlist,
        itemCount: updatedWishlist.items.length,
      },
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json({ success: false, error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
