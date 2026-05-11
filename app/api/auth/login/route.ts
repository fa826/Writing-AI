import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: "Email/username and password are required." },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `SELECT 
        users_id,
        first_name,
        last_name,
        email,
        username,
        password_hash,
        email_verification,
        is_reader,
        is_writer
       FROM users
       WHERE email = ? OR username = ?
       LIMIT 1`,
      [identifier, identifier]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid email/username or password." },
        { status: 401 }
      );
    }

    const user = rows[0];

    if (!user.email_verification) {
      return NextResponse.json(
        { success: false, message: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    // Temporary plain password check
    // Later replace this with bcrypt.compare()
    if (user.password_hash !== password) {
      return NextResponse.json(
        { success: false, message: "Invalid email/username or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.users_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        is_reader: Boolean(user.is_reader),
        is_writer: Boolean(user.is_writer),
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong during login." },
      { status: 500 }
    );
  }
}