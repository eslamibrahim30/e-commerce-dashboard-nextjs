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

    // Validate provided fields
    const errors: string[] = [];
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name === "string" && name.trim().length === 0) {
        errors.push("Product name cannot be empty");
      } else {
        updateData.name = name;
      }
    }

    if (description !== undefined) {
      if (typeof description === "string" && description.trim().length === 0) {
        errors.push("Product description cannot be empty");
      } else {
        updateData.description = description;
      }
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        errors.push("Price cannot be negative");
      } else {
        updateData.price = price;
      }
    }

    if (discount !== undefined) {
      if (Number(discount) < 0) {
        errors.push("Discount cannot be less than 0%");
      } else if (Number(discount) > 100) {
        errors.push("Discount cannot be more than 100%");
      } else {
        updateData.discount = discount;
      }
    }

    if (stock !== undefined) {
      if (!Number.isInteger(Number(stock))) {
        errors.push("Stock must be a whole number");
      } else if (Number(stock) < 0) {
        errors.push("Stock cannot be negative");
      } else {
        updateData.stock = stock;
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: errors[0],
          errors,
        },
        { status: 400 }
      );
    }

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
