import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your Scriptora email",
    html: `
      <h2>Verify your email</h2>
      <p>Click the link below to verify your email address.</p>
      <p>This link expires in 30 minutes.</p>
      <a href="${verifyUrl}">Verify Email</a>
    `,
  });
}