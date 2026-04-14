import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // Create a token that expires in 2 hours
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
      
      const response = NextResponse.json({ success: true, message: "Access Granted" });
      
      // Set the token in a cookie
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7200, // 2 hours
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ success: false, message: "Invalid access key" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = request.headers.get("cookie");
    const token = cookieStore
      ?.split("; ")
      .find((row) => row.startsWith("admin_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.json({ authenticated: true });
    } catch (err) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
