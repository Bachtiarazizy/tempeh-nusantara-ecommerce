// app/api/affiliate/materials/route.js

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // BANNER, PRODUCT_PHOTO, etc
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build where clause
    const where = {
      status: "ACTIVE",
      publishedAt: {
        lte: new Date(),
      },
    };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [{ title: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }, { tags: { has: search.toLowerCase() } }];
    }

    // Get materials with pagination
    const [materials, total] = await Promise.all([
      prisma.marketingMaterial.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.marketingMaterial.count({ where }),
    ]);

    // Get user's download history for these materials
    const materialIds = materials.map((m) => m.id);
    const userDownloads = await prisma.materialDownload.findMany({
      where: {
        materialId: { in: materialIds },
        userId: session.user.id,
      },
      select: {
        materialId: true,
        id: true,
      },
    });

    // Create download map
    const downloadMap = {};
    userDownloads.forEach((d) => {
      if (!downloadMap[d.materialId]) {
        downloadMap[d.materialId] = 0;
      }
      downloadMap[d.materialId]++;
    });

    // Add download info to materials
    const materialsWithDownloads = materials.map((m) => ({
      ...m,
      userDownloads: downloadMap[m.id] || 0,
      hasDownloaded: (downloadMap[m.id] || 0) > 0,
    }));

    // Get stats by type
    const stats = await prisma.marketingMaterial.groupBy({
      by: ["type"],
      where: {
        status: "ACTIVE",
        publishedAt: {
          lte: new Date(),
        },
      },
      _count: {
        id: true,
      },
    });

    const statsByType = {};
    stats.forEach((s) => {
      statsByType[s.type] = s._count.id;
    });

    return NextResponse.json({
      success: true,
      data: {
        materials: materialsWithDownloads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: statsByType,
      },
    });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json({ error: "Failed to fetch materials", details: error.message }, { status: 500 });
  }
}
