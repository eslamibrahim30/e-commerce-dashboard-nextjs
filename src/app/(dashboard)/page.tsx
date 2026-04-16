"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import ReusableButton from "@/components/shared/ReusableButton";
import { Download, TrendingUp, Package, AlertCircle } from "lucide-react";

export default function LuxuryDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGenerateReport = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
    
        const [statsRes, prodRes, catRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        const statsResult = await statsRes.json() as { success: boolean; data: any };
        const prodResult = await prodRes.json() as { success: boolean; data: any[] };
        const catResult = await catRes.json() as { success: boolean; data: any[] };

        if (statsResult.success) setStats(statsResult.data);

        if (prodResult.success && catResult.success) {
          const products = prodResult.data;
          const categories = catResult.data;

          const formattedChart = categories.map((cat: any) => {
            const catProducts = products.filter((p: any) => p.category === cat._id || p.category?._id === cat._id);
            return {
              name: cat.name,
              inStock: catProducts.filter((p: any) => p.stock > 0).length,
              outOfStock: catProducts.filter((p: any) => p.stock === 0).length
            };
          });
          setChartData(formattedChart);
        }
      } catch (error) {
        console.error("Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse">SYNCING DATA...</div>;

  return (
    <div className="space-y-8 p-2">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-black tracking-tighter">Nova <span className="italic font-light opacity-70">Analytics</span></h1>
        <ReusableButton onClick={handleGenerateReport} leftIcon={<Download size={16} />}>
          Generate Report
        </ReusableButton>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
          <Package className="mb-4 text-primary" size={20} />
          <p className="text-[10px] font-black uppercase opacity-50">Total Products</p>
          <h3 className="text-2xl font-black">{stats?.totalProducts || 0}</h3>
        </div>
        <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
          <AlertCircle className="mb-4 text-rose-500" size={20} />
          <p className="text-[10px] font-black uppercase opacity-50">Out of Stock</p>
          <h3 className="text-2xl font-black">{stats?.outOfStock || 0}</h3>
        </div>
        <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm">
          <TrendingUp className="mb-4 text-emerald-500" size={20} />
          <p className="text-[10px] font-black uppercase opacity-50">Categories</p>
          <h3 className="text-2xl font-black">{stats?.totalCategories || 0}</h3>
        </div>
      </div>

      {/* Real-time Stacked Bar Chart */}
      <section className="bg-card rounded-[2.5rem] border border-border/50 p-8 shadow-sm">
        <h2 className="text-xl font-black mb-8">Inventory Distribution</h2>
       <div className="w-full pr-4"> 
  {/* */}
  <ResponsiveContainer width="100%" aspect={2}> 
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
      <XAxis dataKey="name" axisLine={false} tickLine={false} />
      <YAxis axisLine={false} tickLine={false} />
      <Tooltip cursor={{fill: 'transparent'}} />
      <Legend verticalAlign="top" align="right" />
      <Bar dataKey="inStock" stackId="a" fill="#10b981" name="In Stock" barSize={35} />
      <Bar dataKey="outOfStock" stackId="a" fill="#f43f5e" name="Out of Stock" barSize={35} radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>
      </section>
    </div>
  );
}