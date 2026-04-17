import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/users";
import {IUserUpdate} from '@/interfaces/users'
// git user by id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await User.findById(params.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, data: null, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: "User fetched successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, message: "Server error" },
      { status: 500 }
    );
  }
}

// update user
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body:IUserUpdate = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, message: "Server error" },
      { status: 500 }
    );
  }
}
// delete user
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      data: null,
      message: "User deleted successfully"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, message: "Server error" },
      { status: 500 }
    );
  }
}