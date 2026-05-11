import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ taken: false });
  }

  const [rows]: any = await pool.query(
    "SELECT users_id FROM users WHERE username = ? LIMIT 1",
    [username]
  );

  return NextResponse.json({
    taken: rows.length > 0,
  });
}