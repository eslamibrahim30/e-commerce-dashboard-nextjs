import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

type LoginBody = {
    email: string;
    password: string;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const body: LoginBody = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Missing fields"
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Invalid email or password"
        },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Invalid email or password"
        },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    const response = NextResponse.json({
      success: true,
      data: {
        email: user.email,
        role: user.role
      },
      message: "Login successful"
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Internal server error"
      },
      { status: 500 }
    );
  }
}