import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/users";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Unauthorized"
        },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Invalid token"
        },
        { status: 401 }
      );
    }

    const users = await User.find().select("-password");

    return NextResponse.json({
      success: true,
      data: users,
      message: "Users fetched successfully"
    });

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