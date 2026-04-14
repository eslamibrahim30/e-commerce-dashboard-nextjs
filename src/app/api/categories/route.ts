import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find().lean();

    return NextResponse.json(
      {
        success: true,
        data: categories,
        message: "Categories fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description } = body;

    if (!name || (typeof name === "string" && name.trim().length === 0)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    const category = await Category.create({ name, description });

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: "Category created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle duplicate key error (MongoDB error code 11000)
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Record<string, unknown>).code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "A category with this name already exists",
        },
        { status: 400 }
      );
    }

    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Failed to create category",
      },
      { status: 500 }
    );
  }
}
