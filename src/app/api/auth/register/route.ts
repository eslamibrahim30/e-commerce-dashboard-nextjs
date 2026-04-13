import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/users";
import bcrypt from "bcryptjs";

import {RegisterBody} from '@/interfaces/users'

export async function POST(req: Request) {

  await connectDB();

  const body: RegisterBody = await req.json();

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      {
        success: false,
        data:null,
        message: "Missing fields" 

      },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase()
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "admin"
  });

  return NextResponse.json({
    success: true,
    data: {
      email: user.email,
      role: user.role
    },
    message: "User registered successfully"
  });
}