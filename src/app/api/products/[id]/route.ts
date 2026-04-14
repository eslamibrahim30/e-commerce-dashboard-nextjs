import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import mongoose from "mongoose";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: Context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, price, discount, stock, category } = body;

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;
    if (stock !== undefined) updateData.stock = stock;

    // Validate category if provided
    if (category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
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

      updateData.category = category;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate({ path: "category", select: "name", model: Category })
      .lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: null,
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}
