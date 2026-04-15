import mongoose, { Schema, model, models } from "mongoose";

// Category Schema
const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

// Product Schema
const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
});

// FIX: Use named exports instead of two defaults
export const Category = models.Category || model("Category", CategorySchema);
export const Product = models.Product || model("Product", ProductSchema);