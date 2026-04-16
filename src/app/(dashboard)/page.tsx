"use client";

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// استيراد المكونات المشتركة
import { salesData } from './data';
import ReusableButton from "@/components/shared/ReusableButton";
import ReusableTable from "@/components/shared/ReusableTable";
import { 
  Download, 
  TrendingUp, 
  Package, 
  DollarSign, 
  AlertCircle, 
  LucideIcon 
} from "lucide-react";

// --- 1. Interfaces ---

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  isPositive?: boolean;
  icon: LucideIcon;
}

interface Product {
  id: string; 
  name: string;
  category: string;
  price: number;
  status: string;
}

interface DashboardStats {
  success: boolean;
  data: {
    totalProducts: number;
    outOfStock: number;
    totalCategories: number;
    latestProducts?: Product[];
  };
}

// --- 2. المكونات الفرعية ---

const ModernStatCard = ({ title, value, trend, isPositive, icon: Icon }: StatCardProps) => (
  <div className="group relative overflow-hidden bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
          isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'
        }`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-2xl font-black text-foreground mt-1 tracking-tight">{value}</h3>
    </div>
  </div>
);

// --- 3. المكون الأساسي للداشبورد ---

export default function LuxuryDashboard() {
  // الحالة الخاصة بالبيانات الحقيقية
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  //(Stats API)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
       
        const response = await fetch('/api/stats');
        const result: DashboardStats = await response.json();
        
        if (result.success) {
          setStats(result.data); 
        
          if (result.data.latestProducts) {
            setProducts(result.data.latestProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const columns = [
    { 
      header: "Asset Name", 
      accessor: "name" as keyof Product, 
      render: (item: Product) => <span className="font-bold">{item.name}</span> 
    },
    { header: "Category", accessor: "category" as keyof Product },
    { 
      header: "Price", 
      accessor: "price" as keyof Product, 
      render: (item: Product) => <span className="font-black">${item.price.toLocaleString()}</span> 
    },
    { 
      header: "Status", 
      accessor: "status" as keyof Product,
      render: (item: Product) => (
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            item.status === 'In Stock' ? 'bg-emerald-500' : 'bg-rose-500'
          }`} />
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            item.status === 'In Stock' ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {item.status}
          </span>
        </div>
      )
    },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center font-black">SYNCING DATA...</div>;

  return (
    <div className="space-y-8 p-2 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1 w-6 bg-primary rounded-full"></span>
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              Real-time Analysis
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Nova <span className="text-primary/80 italic font-light">Analytics</span>
          </h1>
        </div>
        <ReusableButton leftIcon={<Download size={16} />} className="shadow-lg shadow-primary/20">
          Generate Report
        </ReusableButton>
      </header>

      {/* Stats Grid - الـ 3 كروت المطلوبة في التكليف */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModernStatCard 
          title="Total Products" 
          value={stats?.totalProducts || 0} 
          trend="+ Live" 
          isPositive={true} 
          icon={Package} 
        />
        <ModernStatCard 
          title="Out of Stock" 
          value={stats?.outOfStock || 0} 
          trend="Attention" 
          isPositive={false} 
          icon={AlertCircle} 
        />
        <ModernStatCard 
          title="Total Categories" 
          value={stats?.totalCategories || 0} 
          trend="Stable" 
          isPositive={true} 
          icon={TrendingUp} 
        />
      </div>

      {/* Chart Section */}
      <section className="bg-card rounded-[2.5rem] border border-border/50 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} /> Performance Trends
            </h2>
            <p className="text-muted-foreground text-xs font-medium">Data fetched from shared contract API.</p>
          </div>
        </div>
        
        <div className="h-[350px] w-full pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="novaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 11}} />
              <Tooltip 
                formatter={(value: any) => typeof value === 'number' && value ? [`$${value.toLocaleString()}`, "Revenue"] : ["N/A", "Revenue"]}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '16px', border: '1px solid hsl(var(--border))' }}
                itemStyle={{ color: 'hsl(var(--primary))', fontWeight: '900' }}
              />
              <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#novaGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Table Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-black tracking-tight px-2">Active Inventory</h2>
        {/* سيتم عرض المنتجات الحقيقية لو الـ API بيرجعها، وإلا سيظل الجدول ينتظر البيانات */}
        <ReusableTable columns={columns} data={products} />
      </section>

      <footer className="text-center pb-4">
        <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase opacity-40">
          Nova Forest Analytics &copy; 2026
        </p>
      </footer>
    </div>
  );
}