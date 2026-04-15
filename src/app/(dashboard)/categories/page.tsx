"use client";

import { useEffect, useState } from "react";
import ReusableTable from "@/components/shared/ReusableTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, FolderTree, X, Save } from "lucide-react";
import { ICategory } from "@/models/Category";



interface CategoriesResponse {
  success: boolean;
  data: ICategory[];
  message: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = (await res.json()) as CategoriesResponse;
      setCategories(data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setError("");
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }

      if (editingId) {
        setCategories((prev) => prev.map((c) => (c._id === editingId ? data.data : c)));
      } else {
        setCategories((prev) => [data.data, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will fail if products are linked to this category.")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setError("");
  };

  const columns = [
    {
      header: "Category",
      accessor: "name",
      render: (item: ICategory) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
            <FolderTree size={16} />
          </div>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
  ];

  const actions = (item: ICategory) => (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleEdit(item)}
        className="h-8 w-8 text-muted-foreground hover:text-primary"
      >
        <Edit size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDelete(item._id)}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground animate-pulse">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize your products into groups.</p>
        </div>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))} className="gap-2 shadow-lg shadow-primary/20">
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Category"}
        </Button>
      </div>


      {showForm && (
        <div className="p-6 bg-card border rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          {error && <p className="text-destructive text-sm mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button onClick={handleSubmit} className="mt-4 gap-2">
            <Save size={16} /> {editingId ? "Update Category" : "Save Category"}
          </Button>
        </div>
      )}


      <div className="bg-card rounded-lg border shadow-sm">
        {categories.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground">No categories found.</div>
        ) : (
          <ReusableTable<ICategory> columns={columns} data={categories} actions={actions} />
        )}
      </div>
    </div>
  );
}