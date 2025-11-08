// app/api/wishlist/clear/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// DELETE - Clear all wishlist items
export async function DELETE(request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get user's wishlist
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
    });

    if (!wishlist) {
      return NextResponse.json({
        success: true,
        message: "Wishlist already empty",
      });
    }

    // Delete all items
    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id },
    });

    return NextResponse.json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clear wishlist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
