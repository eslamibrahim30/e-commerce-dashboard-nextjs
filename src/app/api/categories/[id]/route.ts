import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Category, Product } from "@/models/Category"; // Added curly braces for named imports
import mongoose from "mongoose";

type Context = { params: Promise<{ id: string }> }; // params is a Promise in Next.js 15

export async function PUT(request: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params; // Await the params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description } = body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params; // Await the params

    // Requirement: Block delete if products exist
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, message: "Cannot delete: this category has products assigned" }, 
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}