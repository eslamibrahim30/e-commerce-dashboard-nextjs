import { NextResponse } from "next/server";
import  connectDB  from "@/lib/db";
import User from "@/models/users";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {

  await connectDB();

  const { email, password } = await req.json();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword
  });

  return NextResponse.json({
    success: true,
    data: {
    email: email,
    role: role
    },
    "message": "Login successful"
  });
}