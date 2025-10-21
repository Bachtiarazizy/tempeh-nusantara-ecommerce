// app/api/admin/settings/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Get all settings
export async function GET(request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    // Get all settings from database
    const settings = await prisma.setting.findMany({
      orderBy: { key: "asc" },
    });

    // Convert to key-value object
    const settingsObject = settings.reduce((acc, setting) => {
      let value = setting.value;

      // Parse value based on type
      switch (setting.type) {
        case "NUMBER":
          value = parseFloat(value);
          break;
        case "BOOLEAN":
          value = value === "true";
          break;
        case "JSON":
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.error(`Failed to parse JSON for key: ${setting.key}`);
          }
          break;
        default:
          // STRING - keep as is
          break;
      }

      acc[setting.key] = value;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: settingsObject,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings", details: error.message }, { status: 500 });
  }
}

// PUT - Update settings
export async function PUT(request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
    }

    // Define setting types for validation
    const settingDefinitions = {
      // Business Info
      businessName: { type: "STRING", description: "Nama bisnis" },
      businessEmail: { type: "STRING", description: "Email bisnis" },
      businessPhone: { type: "STRING", description: "Nomor telepon bisnis" },
      businessAddress: { type: "STRING", description: "Alamat bisnis" },

      // Commission Settings
      affiliateCommissionRate: { type: "NUMBER", description: "Persentase komisi affiliate (%)" },
      minimumPayout: { type: "NUMBER", description: "Minimum payout (Rp)" },
      payoutSchedule: { type: "STRING", description: "Jadwal pembayaran komisi" },

      // Shipping Settings
      freeShippingThreshold: { type: "NUMBER", description: "Minimal gratis ongkir (Rp)" },
      domesticShippingRate: { type: "NUMBER", description: "Tarif pengiriman domestik (Rp)" },
      internationalShippingRate: { type: "NUMBER", description: "Tarif pengiriman internasional (Rp)" },

      // Payment Settings
      bankName: { type: "STRING", description: "Nama bank" },
      accountNumber: { type: "STRING", description: "Nomor rekening" },
      accountName: { type: "STRING", description: "Nama pemilik rekening" },

      // Notification Settings
      emailNotifications: { type: "BOOLEAN", description: "Aktifkan notifikasi email" },
      whatsappNotifications: { type: "BOOLEAN", description: "Aktifkan notifikasi WhatsApp" },
      orderNotifications: { type: "BOOLEAN", description: "Aktifkan notifikasi pesanan baru" },
      affiliateNotifications: { type: "BOOLEAN", description: "Aktifkan notifikasi affiliate baru" },

      // WhatsApp Settings
      whatsappNumber: { type: "STRING", description: "Nomor WhatsApp bisnis" },
      whatsappMessage: { type: "STRING", description: "Pesan default WhatsApp" },
    };

    // Update or create settings
    const updatePromises = Object.entries(settings).map(([key, value]) => {
      const definition = settingDefinitions[key];

      if (!definition) {
        console.warn(`Unknown setting key: ${key}`);
        return null;
      }

      // Convert value to string based on type
      let stringValue;
      switch (definition.type) {
        case "NUMBER":
          stringValue = String(value);
          break;
        case "BOOLEAN":
          stringValue = String(value);
          break;
        case "JSON":
          stringValue = JSON.stringify(value);
          break;
        default:
          stringValue = String(value);
          break;
      }

      return prisma.setting.upsert({
        where: { key },
        update: {
          value: stringValue,
          type: definition.type,
          description: definition.description,
        },
        create: {
          key,
          value: stringValue,
          type: definition.type,
          description: definition.description,
        },
      });
    });

    // Filter out null promises and execute
    await Promise.all(updatePromises.filter(Boolean));

    // Get updated settings
    const updatedSettings = await prisma.setting.findMany({
      orderBy: { key: "asc" },
    });

    const settingsObject = updatedSettings.reduce((acc, setting) => {
      let value = setting.value;

      switch (setting.type) {
        case "NUMBER":
          value = parseFloat(value);
          break;
        case "BOOLEAN":
          value = value === "true";
          break;
        case "JSON":
          try {
            value = JSON.parse(value);
          } catch (e) {
            console.error(`Failed to parse JSON for key: ${setting.key}`);
          }
          break;
      }

      acc[setting.key] = value;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: settingsObject,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings", details: error.message }, { status: 500 });
  }
}
