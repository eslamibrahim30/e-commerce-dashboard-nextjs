import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import {Category} from "@/models/Category";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find()
      .populate({ path: "category", select: "name", model: Category })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: products,
        message: "Products fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description, price, discount, stock, category } = body;

    // Validate required fields manually for cleaner error messages
    if (!name || (typeof name === "string" && name.trim().length === 0)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Product name is required",
        },
        { status: 400 }
      );
    }

    // Validate category exists
    if (
      !category ||
      !mongoose.Types.ObjectId.isValid(category)
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Category not found",
        },
        { status: 400 }
      );
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Category not found",
        },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      discount,
      stock,
      category,
    });

    // Populate category in the response
    const populatedProduct = await Product.findById(product._id)
      .populate({ path: "category", select: "name", model: Category })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: populatedProduct,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const firstMessage = Object.values(error.errors)[0]?.message;
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: firstMessage || "Validation error",
        },
        { status: 400 }
      );
    }

    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Failed to create product",
      },
      { status: 500 }
    );
  }
}
