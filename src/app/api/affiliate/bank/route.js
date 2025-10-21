import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { auth } from "@/lib/auth";

// PUT - Update bank information
export async function PUT(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bankName, accountNumber, accountName } = body;

    // Validation
    if (!bankName || !accountNumber || !accountName) {
      return NextResponse.json({ error: "All bank fields are required" }, { status: 400 });
    }

    // Validate account number (digits only)
    if (!/^\d+$/.test(accountNumber)) {
      return NextResponse.json({ error: "Account number must contain only digits" }, { status: 400 });
    }

    // Get affiliate
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    });

    if (!affiliate) {
      return NextResponse.json({ error: "Not an affiliate" }, { status: 403 });
    }

    // Update bank data
    const updatedAffiliate = await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        bankName,
        accountNumber,
        accountName,
      },
    });

    return NextResponse.json({
      message: "Bank information updated successfully",
      affiliate: {
        bankName: updatedAffiliate.bankName,
        accountNumber: updatedAffiliate.accountNumber,
        accountName: updatedAffiliate.accountName,
      },
    });
  } catch (error) {
    console.error("Error updating bank info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
