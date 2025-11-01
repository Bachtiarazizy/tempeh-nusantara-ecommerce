// app/api/cart/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get user's cart
export async function GET(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get or create cart - FIXED: using compound unique key
    let cart = await prisma.cart.findUnique({
      where: {
        userId_status: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      },
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
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
          status: "ACTIVE",
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

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const itemPrice = Number(item.product?.price || 0);
      return sum + itemPrice * item.quantity;
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        cart,
        itemCount: cart.items.length,
        subtotal,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1, variant = null, weight = null } = body;

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

    if (product.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "Product is not available" }, { status: 400 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ success: false, error: "Insufficient stock" }, { status: 400 });
    }

    // Get or create cart - FIXED: using compound unique key
    let cart = await prisma.cart.findUnique({
      where: {
        userId_status: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variant,
        weight,
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return NextResponse.json({ success: false, error: "Insufficient stock" }, { status: 400 });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: true,
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          variant,
          weight,
        },
        include: {
          product: true,
        },
      });
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const subtotal = updatedCart.items.reduce((sum, item) => {
      const itemPrice = Number(item.product?.price || 0);
      return sum + itemPrice * item.quantity;
    }, 0);

    return NextResponse.json({
      success: true,
      message: "Product added to cart",
      data: {
        cart: updatedCart,
        itemCount: updatedCart.items.length,
        subtotal,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ success: false, error: "Failed to add to cart" }, { status: 500 });
  }
}

// PATCH - Update cart item quantity
export async function PATCH(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ success: false, error: "Item ID and quantity are required" }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ success: false, error: "Quantity must be at least 1" }, { status: 400 });
    }

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Cart item not found" }, { status: 404 });
    }

    if (quantity > cartItem.product.stock) {
      return NextResponse.json({ success: false, error: "Insufficient stock" }, { status: 400 });
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    // Get updated cart - FIXED: using compound unique key
    const updatedCart = await prisma.cart.findUnique({
      where: {
        userId_status: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const subtotal = updatedCart.items.reduce((sum, item) => {
      const itemPrice = Number(item.product?.price || 0);
      return sum + itemPrice * item.quantity;
    }, 0);

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      data: {
        cart: updatedCart,
        itemCount: updatedCart.items.length,
        subtotal,
      },
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 });
  }
}

// DELETE - Remove item from cart
export async function DELETE(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ success: false, error: "Item ID is required" }, { status: 400 });
    }

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Cart item not found" }, { status: 404 });
    }

    // Delete item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    // Get updated cart - FIXED: using compound unique key
    const updatedCart = await prisma.cart.findUnique({
      where: {
        userId_status: {
          userId: session.user.id,
          status: "ACTIVE",
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const subtotal =
      updatedCart?.items.reduce((sum, item) => {
        const itemPrice = Number(item.product?.price || 0);
        return sum + itemPrice * item.quantity;
      }, 0) || 0;

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
      data: {
        cart: updatedCart,
        itemCount: updatedCart?.items.length || 0,
        subtotal,
      },
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json({ success: false, error: "Failed to remove from cart" }, { status: 500 });
  }
}
