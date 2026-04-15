"use client";

import ReusableTable from "@/components/shared/ReusableTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
}

const placeholderProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 99.99,
    discount: 10,
    stock: 25,
  },
  {
    id: "2",
    name: "Running Shoes",
    category: "Sports",
    price: 59.99,
    discount: 0,
    stock: 10,
  },
];

export default function ProductsPage() {
 
  const columns = [
    { 
      header: "Product", 
      accessor: "name",
      render: (item: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
            <Package size={16} />
          </div>
          <span className="font-medium text-foreground">{item.name}</span>
        </div>
      )
    },
    { header: "Category", accessor: "category" },
    { 
      header: "Price", 
      accessor: "price",
      render: (item: Product) => <span className="font-semibold">${item.price}</span>
    },
    { 
      header: "Discount", 
      accessor: "discount",
      render: (item: Product) => (
        <span className={item.discount > 0 ? "text-primary font-medium" : "text-muted-foreground"}>
          {item.discount}%
        </span>
      )
    },
    { 
      header: "Stock", 
      accessor: "stock",
      render: (item: Product) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.stock < 15 ? "bg-orange-100 text-orange-600" : "bg-primary/10 text-primary"}`}>
          {item.stock} in stock
        </span>
      )
    },
  ];

  
  const actions = (item: Product) => (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors">
        <Edit size={16} />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
        <Trash2 size={16} />
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-2">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Overview of your store inventory.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus size={18} />
          Add Product
        </Button>
      </div>

      
      <ReusableTable<Product> 
        columns={columns} 
        data={placeholderProducts} 
        actions={actions} 
      />
    </div>
  );
}