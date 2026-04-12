import React from 'react';

// 1.(Interface)
interface StatCardProps {
  title: string;
  value: number | string;
  color: string;
}

// 2.(Component)
const StatCard = ({ title, value, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

// 3.main page
export default function DashboardPage() {
  const stats = {
    totalProducts: 48,
    outOfStock: 5,
    totalCategories: 6,
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          color="text-blue-600" 
        />
        <StatCard 
          title="Out of Stock" 
          value={stats.outOfStock} 
          color="text-red-600" 
        />
        <StatCard 
          title="Total Categories" 
          value={stats.totalCategories} 
          color="text-green-600" 
        />
      </div>

      <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-8 h-80 flex items-center justify-center shadow-sm">
        <div className="text-center">
          <div className="text-4xl mb-3">📈</div>
          <p className="text-gray-400 font-medium">Recharts Integration coming on Day 3</p>
        </div>
      </div>
    </main>
  );
}