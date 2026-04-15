// src/app/(dashboard)/categories/page.tsx
"use client";
import { useState, useEffect } from "react";

interface ICategory {
  _id: string;
  name: string;
  description?: string;
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json() as ICategory[];
    setCategories(data);
  };

  const handleEditClick = (cat: ICategory) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: "", description: "" });
      setEditingId(null);
      fetchCategories();
    } else {
      const errorData = (await res.json()) as {
        message?: string;
        error?: string;
      };
      alert(errorData.message || errorData.error || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = (await res.json()) as { success: boolean; message?: string };

    if (!res.ok) {
      alert(data.message);
    } else {
      fetchCategories();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories Management</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 bg-gray-50 rounded border"
      >
        <h2 className="font-semibold mb-2">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name (Required)"
          className="border p-2 mr-2 w-full mb-2"
          required
        />
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description"
          className="border p-2 mr-2 w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Category" : "Add Category"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", description: "" });
            }}
            className="ml-2 text-gray-500"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Products</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">{cat.description}</td>
              <td className="p-2 border text-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {cat.productCount || 0} Products
                </span>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEditClick(cat)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
