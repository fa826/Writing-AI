import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";


export async function POST(req: NextRequest) {
  try {
    const {
      first_Name,
      last_Name,
      email,
      phoneNumber,
      username,
      birthMonth,
      birthDay,
      birthYear,
      pronouns,
      is_reader: wantsReaderAccess,
      is_writer: wantsWriterAccess,
      password,
      confirmPassword,
    } = await req.json();

    const birthday =
      birthYear && birthMonth && birthDay
        ? `${birthYear}-${birthMonth}-${birthDay}`
        : "";

    if (
      !first_Name ||
      !last_Name ||
      !email ||
      !phoneNumber ||
      !username ||
      !birthday ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match." },
        { status: 400 }
      );
    }

    const [existingEmail]: any = await pool.query(
      "SELECT users_id FROM users WHERE email = ?",
      [email]
    );

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const [existingUsername]: any = await pool.query(
      "SELECT users_id FROM users WHERE username = ?",
      [username]
    );

    if (existingUsername.length > 0) {
      return NextResponse.json(
        { success: false, message: "Username is taken." },
        { status: 409 }
      );
    }

    const [existingPhone]: any = await pool.query(
        "SELECT users_id FROM users WHERE phoneNumber = ?",
        [phoneNumber]
    );

    if (existingPhone.length > 0) {
        return NextResponse.json(
            { success: false, message: "An account with this phone number already exists." },
            { status: 409 }
        );
    }

    if (!wantsReaderAccess && !wantsWriterAccess) {
      return NextResponse.json(
        { success: false, message: "Please select reader access, writer access, or both." },
        { status: 400 }
      );
    }

    const [result]: any = await pool.query(
      `INSERT INTO users
      (first_name, last_name, email, username, birthday, pronouns, password_hash, phoneNumber, is_reader, is_writer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_Name,
        last_Name,
        email,
        username,
        birthday,
        pronouns || null,
        password,
        phoneNumber,
        wantsReaderAccess ? 1 : 0,
        wantsWriterAccess ? 1 : 0,
      ]
    );

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await pool.query(
    `INSERT INTO email_verification_tokens (user_id, token, expires_at)
    VALUES (?, ?, ?)`,
    [result.insertId, token, expiresAt]
    );

   try{
    await sendVerificationEmail(email, token);

   }  catch (emailError){
    console.error("Verification email failed:", emailError);

    await pool.query("DELETE FROM email_verification_tokens WHERE user_id = ?", [result.insertId,]);

    await pool.query("DELETE FROM users WHERE users_id = ?", [result.insertId]);

    return NextResponse.json(
        {
            success: false,
            message: "Could not send verification email.",
        },
        {status: 500}
    );
   }

    return NextResponse.json({
      success: true,
      message: "Signup successful. Please check your email to verify your account.",
      user: {
        id: result.insertId,
        first_Name,
        last_Name,
        email,
        username,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong during signup." },
      { status: 500 }
    );
  }
}