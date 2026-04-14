"use client";

import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: Category;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  message: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  message: string;
}

interface CreateProductResponse {
  success: boolean;
  data: Product;
  message: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
  });

 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = (await res.json()) as ProductsResponse;
        setProducts(data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = (await res.json()) as CategoriesResponse;
        setCategories(data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Submit
  const handleSubmit = async () => {
    try {
      setError("");

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          discount: Number(formData.discount),
          stock: Number(formData.stock),
          category: formData.category,
        }),
      });

      const data = (await res.json()) as CreateProductResponse;

      if (!data.success) {
        setError(data.message);
        return;
      }

      setProducts((prev) => [...prev, data.data]);
      setShowForm(false);

      setFormData({
        name: "",
        description: "",
        price: "",
        discount: "",
        stock: "",
        category: "",
      });
    } catch (err) {
      setError("Something went wrong");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      
      {showForm && (
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Add Product</h2>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Discount"
              type="number"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
              className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500"
            />

            <input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border border-gray-300 p-2 rounded col-span-2 focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="border border-gray-300 p-2 rounded col-span-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

     
      {products.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          No products yet
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {product.name}
                  </td>

                  <td className="p-3 text-gray-600">
                    {product.category?.name || "N/A"}
                  </td>

                  <td className="p-3 font-semibold text-blue-600">
                    ${product.price.toFixed(2)}
                  </td>

                  <td className="p-3">
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                      {product.discount}%
                    </span>
                  </td>

                  <td className="p-3">
                    {product.stock === 0 ? (
                      <span className="text-red-600">
                        Out of stock
                      </span>
                    ) : (
                      <span className="text-green-600">
                        {product.stock}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}