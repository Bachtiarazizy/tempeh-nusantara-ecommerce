// app/api/affiliate/materials/[id]/download/route.js
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

    // Get material
    const material = await prisma.marketingMaterial.findUnique({
      where: { id },
    });

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    if (material.status !== "ACTIVE") {
      return NextResponse.json({ error: "Material not available" }, { status: 403 });
    }

    // Get affiliate if exists
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    });

    // Get request info
    const userAgent = request.headers.get("user-agent");
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip");

    // Create download record
    await prisma.materialDownload.create({
      data: {
        materialId: material.id,
        userId: session.user.id,
        affiliateId: affiliate?.id,
        ipAddress,
        userAgent,
      },
    });

    // Update download count
    await prisma.marketingMaterial.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl: material.fileUrl,
        material: {
          id: material.id,
          title: material.title,
          type: material.type,
          fileFormat: material.fileFormat,
        },
      },
    });
  } catch (error) {
    console.error("Error downloading material:", error);
    return NextResponse.json({ error: "Failed to download material", details: error.message }, { status: 500 });
  }
}

// Get download stats for a material
export async function GET(request, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const material = await prisma.marketingMaterial.findUnique({
      where: { id },
      include: {
        downloads: {
          where: {
            userId: session.user.id,
          },
          orderBy: {
            downloadedAt: "desc",
          },
        },
      },
    });

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        material: {
          id: material.id,
          title: material.title,
          downloadCount: material.downloadCount,
        },
        userDownloads: material.downloads.length,
        lastDownload: material.downloads[0]?.downloadedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching download stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats", details: error.message }, { status: 500 });
  }
}
