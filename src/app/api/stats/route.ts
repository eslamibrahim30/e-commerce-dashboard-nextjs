import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const [totalProducts, outOfStock, totalCategories] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      Category.countDocuments(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: { totalProducts, outOfStock, totalCategories },
        message: "Stats fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
