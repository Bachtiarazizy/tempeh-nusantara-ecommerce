// app/api/wishlist/[itemId]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// DELETE - Remove item from wishlist
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = params;

    // Verify item belongs to user
    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      include: {
        wishlist: {
          select: { userId: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }

    if (item.wishlist.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Delete item
    await prisma.wishlistItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove item from wishlist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
