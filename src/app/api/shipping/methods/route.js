// app/api/shipping/methods/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const weight = parseFloat(searchParams.get("weight") || "0");
    const total = parseFloat(searchParams.get("total") || "0");

    const shippingMethods = await prisma.shippingMethod.findMany({
      where: {
        isActive: true,
        ...(weight > 0 && {
          OR: [{ maxWeight: null }, { maxWeight: { gte: weight } }],
        }),
        ...(total > 0 && {
          OR: [{ minOrderAmount: null }, { minOrderAmount: { lte: total } }],
        }),
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: shippingMethods,
    });
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    return NextResponse.json({ error: "Failed to fetch shipping methods" }, { status: 500 });
  }
}
