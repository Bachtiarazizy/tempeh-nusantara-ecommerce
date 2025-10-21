import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, phone, role } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, dan nama harus diisi" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine user status based on role
    const userStatus = role === "AFFILIATE" ? "PENDING" : "ACTIVE";

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role || "BUYER",
        status: userStatus,
      },
    });

    // If registering as affiliate, create affiliate record
    if (role === "AFFILIATE") {
      const referralCode = await generateUniqueReferralCode(name);

      await prisma.affiliate.create({
        data: {
          userId: user.id,
          referralCode,
          commissionRate: 5.0,
          monthlyGoal: 10,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: role === "AFFILIATE" ? "Registrasi berhasil! Akun Anda menunggu persetujuan admin." : "Registrasi berhasil! Silakan login.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat registrasi" }, { status: 500 });
  }
}

async function generateUniqueReferralCode(name) {
  const baseCode = name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .substring(0, 6);

  let referralCode = baseCode + Math.floor(1000 + Math.random() * 9000);

  // Check uniqueness
  let exists = await prisma.affiliate.findUnique({
    where: { referralCode },
  });

  while (exists) {
    referralCode = baseCode + Math.floor(1000 + Math.random() * 9000);
    exists = await prisma.affiliate.findUnique({
      where: { referralCode },
    });
  }

  return referralCode;
}
