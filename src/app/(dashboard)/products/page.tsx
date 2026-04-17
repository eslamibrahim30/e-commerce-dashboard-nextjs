"use client";

import { useEffect, useState, useRef } from "react";
import ReusableTable from "@/components/shared/ReusableTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Package, X, Save } from "lucide-react";

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

interface ProductResponse {
  success: boolean;
  data: Product;
  message: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  message: string;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  return res.json();
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const formRef = useRef<HTMLDivElement | null>(null);

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          fetchJson<ProductsResponse>("/api/products"),
          fetchJson<CategoriesResponse>("/api/categories"),
        ]);

        setProducts(prodData.data || []);
        setCategories(catData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showForm]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (formData.price === "" || formData.price === undefined) {
      errors.price = "Price is required";
    } else if (Number(formData.price) < 0) {
      errors.price = "Price cannot be negative";
    }

    if (formData.discount !== "" && formData.discount !== undefined) {
      const discountVal = Number(formData.discount);
      if (discountVal < 0) {
        errors.discount = "Discount cannot be less than 0%";
      } else if (discountVal > 100) {
        errors.discount = "Discount cannot be more than 100%";
      }
    }

    if (formData.stock !== "" && formData.stock !== undefined) {
      const stockVal = Number(formData.stock);
      if (!Number.isInteger(stockVal)) {
        errors.stock = "Stock must be a whole number";
      } else if (stockVal < 0) {
        errors.stock = "Stock cannot be negative";
      }
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setFieldErrors({});

      if (!validateForm()) return;

      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : "/api/products";

      const method = editingProduct ? "PUT" : "POST";

      const data = await fetchJson<ProductResponse>(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discount: Number(formData.discount),
          stock: Number(formData.stock),
        }),
      });

      if (!data.success) {
        setError(data.message);
        return;
      }

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? data.data : p))
        );
      } else {
        setProducts((prev) => [...prev, data.data]);
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData(emptyForm);
    } catch {
      setError("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      const data = await fetchJson<{ success: boolean }>(
        `/api/products/${deletingProduct._id}`,
        { method: "DELETE" }
      );

      if (!data.success) return;

      setProducts((prev) =>
        prev.filter((p) => p._id !== deletingProduct._id)
      );

      setDeletingProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      header: "Product",
      accessor: "name",
      render: (item: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
            <Package size={16} />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
              {item.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      render: (item: Product) => (
        <span>{item.category?.name || "N/A"}</span>
      ),
    },
    {
      header: "Price",
      accessor: "price",
      render: (item: Product) => (
        <span className="font-semibold">
          ${item.price.toFixed(2)}
        </span>
      ),
    },
    {
      header: "Discount",
      accessor: "discount",
      render: (item: Product) => (
        <span className="text-primary font-medium">
          {item.discount}%
        </span>
      ),
    },
    {
      header: "Stock",
      accessor: "stock",
      render: (item: Product) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold ${
            item.stock < 10
              ? "bg-orange-100 text-orange-600"
              : "bg-primary/10 text-primary"
          }`}
        >
          {item.stock === 0 ? "Out of Stock" : `${item.stock}`}
        </span>
      ),
    },
  ];

  const actions = (item: Product) => (
    <div className="flex gap-1">
      <Button
        onClick={() => {
          setEditingProduct(item);
          setFormData({
            name: item.name,
            description: item.description,
            price: String(item.price),
            discount: String(item.discount),
            stock: String(item.stock),
            category: item.category?._id || "",
          });
          setFieldErrors({});
          setShowForm(true);
        }}
        variant="ghost"
        size="icon"
      >
        <Edit size={16} />
      </Button>

      <Button
        onClick={() => setDeletingProduct(item)}
        variant="ghost"
        size="icon"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground animate-pulse">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setFormData(emptyForm);
            setFieldErrors({});
            setShowForm(!showForm);
          }}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Product"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div ref={formRef} className="p-4 border rounded-lg bg-white">
          {error && <p className="text-red-500 mb-3">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                }}
                className={fieldErrors.name ? "border-red-500" : ""}
              />
              {fieldErrors.name && <span className="text-red-500 text-xs">{fieldErrors.name}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  if (fieldErrors.price) setFieldErrors({ ...fieldErrors, price: "" });
                }}
                className={fieldErrors.price ? "border-red-500" : ""}
              />
              {fieldErrors.price && <span className="text-red-500 text-xs">{fieldErrors.price}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Discount (%)"
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.discount}
                onChange={(e) => {
                  setFormData({ ...formData, discount: e.target.value });
                  if (fieldErrors.discount) setFieldErrors({ ...fieldErrors, discount: "" });
                }}
                className={fieldErrors.discount ? "border-red-500" : ""}
              />
              {fieldErrors.discount && <span className="text-red-500 text-xs">{fieldErrors.discount}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={(e) => {
                  setFormData({ ...formData, stock: e.target.value });
                  if (fieldErrors.stock) setFieldErrors({ ...fieldErrors, stock: "" });
                }}
                className={fieldErrors.stock ? "border-red-500" : ""}
              />
              {fieldErrors.stock && <span className="text-red-500 text-xs">{fieldErrors.stock}</span>}
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: "" });
                }}
                className={fieldErrors.description ? "border-red-500" : ""}
              />
              {fieldErrors.description && <span className="text-red-500 text-xs">{fieldErrors.description}</span>}
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <select
                className={`border p-2 rounded ${fieldErrors.category ? "border-red-500" : ""}`}
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (fieldErrors.category) setFieldErrors({ ...fieldErrors, category: "" });
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {fieldErrors.category && <span className="text-red-500 text-xs">{fieldErrors.category}</span>}
            </div>
          </div>

          <Button onClick={handleSubmit} className="mt-4">
            <Save size={16} /> Save
          </Button>
        </div>
      )}

      {/* Table */}
      <ReusableTable columns={columns} data={products} actions={actions} />

      {/* Delete Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">
              Delete {deletingProduct.name} ?
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setDeletingProduct(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}