import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phoneNumber = searchParams.get("phoneNumber");

  if (!phoneNumber) return NextResponse.json({ taken: false });

  const [rows]: any = await pool.query(
    "SELECT users_id FROM users WHERE phoneNumber = ? LIMIT 1",
    [phoneNumber]
  );

  return NextResponse.json({ taken: rows.length > 0 });
}