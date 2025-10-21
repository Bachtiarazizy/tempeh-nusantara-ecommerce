// app/api/affiliate/materials/[id]/view/route.js

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if material exists
    const material = await prisma.marketingMaterial.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    // Update view count
    await prisma.marketingMaterial.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "View tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json({ error: "Failed to track view", details: error.message }, { status: 500 });
  }
}

// Get view stats for a material
export async function GET(request, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const material = await prisma.marketingMaterial.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        viewCount: true,
        downloadCount: true,
      },
    });

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: material,
    });
  } catch (error) {
    console.error("Error fetching view stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats", details: error.message }, { status: 500 });
  }
}
