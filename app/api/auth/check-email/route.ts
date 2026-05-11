import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ taken: false });

  const [rows]: any = await pool.query(
    "SELECT users_id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return NextResponse.json({ taken: rows.length > 0 });
}