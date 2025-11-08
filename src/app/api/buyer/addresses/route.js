// app/api/user/addresses/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - List user addresses
export async function GET(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// POST - Create new address
export async function POST(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, label, phone, address, city, state, postalCode, isDefault } = body;

    // Validation
    if (!fullName || !phone || !address || !city || !state || !postalCode) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // If setting as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create address
    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName,
        label: label || null,
        phone,
        address,
        city,
        state,
        postalCode,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address created successfully",
        data: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}
