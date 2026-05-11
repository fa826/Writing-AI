import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing verification token." },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `SELECT id, user_id, expires_at
       FROM email_verification_tokens
       WHERE token = ?
       LIMIT 1`,
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid verification link." },
        { status: 400 }
      );
    }

    const tokenRecord = rows[0];

    if (new Date(tokenRecord.expires_at) < new Date()) {
      await pool.query(
        "DELETE FROM email_verification_tokens WHERE id = ?",
        [tokenRecord.id]
      );

      return NextResponse.json(
        { success: false, message: "Verification link has expired." },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE users SET email_verified = TRUE WHERE users_id = ?",
      [tokenRecord.user_id]
    );

    await pool.query(
      "DELETE FROM email_verification_tokens WHERE id = ?",
      [tokenRecord.id]
    );

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Verify email error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong verifying email." },
      { status: 500 }
    );
  }
}