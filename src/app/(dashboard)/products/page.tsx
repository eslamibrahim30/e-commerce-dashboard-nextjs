"use client";

import { useEffect, useState } from "react";
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

interface CategoriesResponse {
  success: boolean;
  data: Category[];
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

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        const prodData = (await prodRes.json()) as ProductsResponse;
        const catData = (await catRes.json()) as CategoriesResponse;

        setProducts(prodData.data || []);
        setCategories(catData.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      setError("");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discount: Number(formData.discount),
          stock: Number(formData.stock),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }

      setProducts((prev) => [...prev, data.data]);
      setShowForm(false);
      setFormData({ name: "", description: "", price: "", discount: "", stock: "", category: "" });
    } catch (err) {
      setError("Something went wrong");
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
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{item.description}</p>
          </div>
        </div>
      ),
    },
    { 
      header: "Category", 
      accessor: "category",
      render: (item: Product) => <span>{item.category?.name || "N/A"}</span>
    },
    {
      header: "Price",
      accessor: "price",
      render: (item: Product) => <span className="font-semibold">${item.price.toFixed(2)}</span>,
    },
    {
      header: "Discount",
      accessor: "discount",
      render: (item: Product) => (
        <span className={item.discount > 0 ? "text-primary font-medium" : "text-muted-foreground"}>
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
            item.stock < 10 ? "bg-orange-100 text-orange-600" : "bg-primary/10 text-primary"
          }`}
        >
          {item.stock === 0 ? "Out of Stock" : `${item.stock} in stock`}
        </span>
      ),
    },
  ];

  const actions = (item: Product) => (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
        <Edit size={16} />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
        <Trash2 size={16} />
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground animate-pulse">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your store inventory and pricing.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 shadow-lg shadow-primary/20">
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Product"}
        </Button>
      </div>

      {/* Modern Add Form */}
      {showForm && (
        <div className="p-6 bg-card border rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
          <h2 className="text-lg font-semibold mb-4">New Product Details</h2>
          {error && <p className="text-destructive text-sm mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
                placeholder="Product Name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            <Input 
                type="number" 
                placeholder="Price" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
            />
             <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <Input 
                type="number" 
                placeholder="Discount %" 
                value={formData.discount} 
                onChange={(e) => setFormData({...formData, discount: e.target.value})} 
            />
            <Input 
                type="number" 
                placeholder="Stock Quantity" 
                value={formData.stock} 
                onChange={(e) => setFormData({...formData, stock: e.target.value})} 
            />
            <Input 
                className="md:col-span-3"
                placeholder="Description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <Button onClick={handleSubmit} className="mt-4 gap-2">
            <Save size={16} /> Save Product
          </Button>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-card rounded-lg border shadow-sm">
        {products.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground">No products found.</div>
        ) : (
          <ReusableTable<Product> 
            columns={columns} 
            data={products} 
            actions={actions} 
          />
        )}
      </div>
    </div>
  );
}