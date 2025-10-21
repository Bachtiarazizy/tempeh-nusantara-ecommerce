import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get single product by ID
export async function GET(request, { params }) {
  try {
    const session = await auth();

    // Check authentication and admin role
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
            cartItems: true,
            wishlistItems: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product", details: error.message }, { status: 500 });
  }
}

// PATCH - Partial update product (e.g., status toggle)
export async function PATCH(request, { params }) {
  try {
    const session = await auth();

    // Check authentication and admin role
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update product with partial data
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...body,
        // Handle numeric conversions if needed
        ...(body.price && { price: parseFloat(body.price) }),
        ...(body.stock !== undefined && { stock: parseInt(body.stock) }),
        ...(body.comparePrice !== undefined && {
          comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        }),
        ...(body.weight !== undefined && {
          weight: body.weight ? parseFloat(body.weight) : null,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product", details: error.message }, { status: 500 });
  }
}

// PUT - Update product by ID
export async function PUT(request, { params }) {
  try {
    const session = await auth();

    // Check authentication and admin role
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { sku, name, slug, description, price, comparePrice, stock, weight, status, category, images, featured } = body;

    // Check if new SKU conflicts with other products
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku },
      });

      if (skuExists) {
        return NextResponse.json({ error: "Product with this SKU already exists" }, { status: 400 });
      }
    }

    // Check if new slug conflicts with other products
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json({ error: "Product with this slug already exists" }, { status: 400 });
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(sku && { sku }),
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(comparePrice !== undefined && {
          comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(weight !== undefined && {
          weight: weight ? parseFloat(weight) : null,
        }),
        ...(status && { status }),
        ...(category && { category }),
        ...(images !== undefined && { images }),
        ...(featured !== undefined && { featured }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product", details: error.message }, { status: 500 });
  }
}

// DELETE - Delete product by ID
export async function DELETE(request, { params }) {
  try {
    const session = await auth();

    // Check authentication and admin role
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const { id } = params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product has been ordered
    if (existingProduct._count.orderItems > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete product with existing orders. Set status to INACTIVE instead.",
        },
        { status: 400 }
      );
    }

    // Delete product (will cascade delete cart items and wishlist items)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product", details: error.message }, { status: 500 });
  }
}
