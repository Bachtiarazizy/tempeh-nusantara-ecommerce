// Quick Fix Script untuk Database
// Jalankan: node quick-fix-database.js

const { Client } = require("pg");
require("dotenv").config();

async function fixDatabase() {
  // Koneksi ke database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("✅ Connected to database");

    // Step 1: Cek data yang bermasalah
    console.log("\n📊 Checking for orphaned commissions...");
    const checkQuery = `
      SELECT 
        c.id,
        c."orderId",
        c."affiliateId",
        c.amount,
        c.status
      FROM commissions c
      LEFT JOIN orders o ON c."orderId" = o.id
      WHERE c."orderId" IS NOT NULL AND o.id IS NULL;
    `;

    const orphanedData = await client.query(checkQuery);
    console.log(`Found ${orphanedData.rows.length} orphaned commission records`);

    if (orphanedData.rows.length > 0) {
      console.log("\nOrphaned records:");
      console.table(orphanedData.rows);
    }

    // Step 2: Backup (optional tapi recommended)
    console.log("\n💾 Creating backup...");
    await client.query(`
      DROP TABLE IF EXISTS commissions_backup;
      CREATE TABLE commissions_backup AS SELECT * FROM commissions;
    `);
    console.log("✅ Backup created: commissions_backup");

    // Step 3: Set orderId ke NULL untuk data yang bermasalah
    console.log("\n🔧 Fixing orphaned commissions...");
    const fixQuery = `
      UPDATE commissions 
      SET "orderId" = NULL 
      WHERE "orderId" IS NOT NULL 
      AND "orderId" NOT IN (SELECT id FROM orders);
    `;

    const result = await client.query(fixQuery);
    console.log(`✅ Fixed ${result.rowCount} commission records`);

    // Step 4: Drop foreign key constraint yang lama
    console.log("\n🗑️ Dropping old foreign key constraint...");
    await client.query(`
      ALTER TABLE commissions 
      DROP CONSTRAINT IF EXISTS "commissions_orderId_fkey";
    `);
    console.log("✅ Old constraint dropped");

    // Step 5: Verifikasi
    console.log("\n✅ Verification:");
    const verifyQuery = `
      SELECT 
        COUNT(*) as total_commissions,
        COUNT("orderId") as with_orders,
        COUNT(*) - COUNT("orderId") as without_orders
      FROM commissions;
    `;
    const verification = await client.query(verifyQuery);
    console.table(verification.rows);

    console.log("\n✅ Database fixed! Now run: npx prisma db push");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\nFull error:", error);
  } finally {
    await client.close();
    console.log("\n🔌 Database connection closed");
  }
}

fixDatabase();
