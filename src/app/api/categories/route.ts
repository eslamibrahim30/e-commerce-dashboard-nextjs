// src\app\api\categories\route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import {Category} from "@/models/Category";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();
  const categories = await Category.find().lean();
  
  // Day 5: Implement product count per category
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat: any) => {
      const count = await Product.countDocuments({ category: cat._id });
      return { ...cat, productCount: count };
    })
  );
  
  return NextResponse.json(categoriesWithCount);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, description } = await req.json();
    
    // Check for duplicate name
    const existing = await Category.findOne({ name });
    if (existing) {
      return NextResponse.json({ error: "A category with this name already exists" }, { status: 400 });
    }

    const newCategory = await Category.create({ name, description });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }
}