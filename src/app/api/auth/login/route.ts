import { NextResponse } from "next/server";
import  connectDB  from "@/lib/db";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {

  await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
        return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
        );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return NextResponse.json({
            success: false,
            data: null,
            message:"Invalid email or password"
    });
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
        secure: true,
        sameSite: "strict",
        path: "/"
    });

    return response;
}