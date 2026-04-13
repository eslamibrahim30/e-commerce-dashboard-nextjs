import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

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
