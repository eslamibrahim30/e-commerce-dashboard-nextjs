"use client";

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { products, salesData } from './data';

const ModernStatCard = ({ title, value, trend, isPositive }: any) => (
  <div className="relative overflow-hidden bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-teal-50 rounded-xl">
        <div className="w-4 h-4 border-2 border-teal-600 rounded-full" />
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-black text-gray-900 mt-1 tracking-tight">{value}</h3>
    </div>
  </div>
);

export default function LuxuryDashboard() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 md:p-8 font-sans selection:bg-teal-100">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-row items-center justify-between mb-10 w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="h-1 w-8 bg-teal-500 rounded-full"></span>
              <span className="text-teal-600 font-bold text-[10px] uppercase tracking-[0.3em]">
                Management Suite
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Dashboard<span className="text-teal-600 italic">Analytics</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
           
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-600 hover:shadow-teal-100 transition-all duration-300 shadow-xl shadow-slate-200 whitespace-nowrap active:scale-95">
              Generate Report
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ModernStatCard title="Total Assets" value={products.length} trend="+14.2%" isPositive={true} />
          <ModernStatCard title="Net Revenue" value="$84,200" trend="+8.1%" isPositive={true} />
          <ModernStatCard title="Inventory Risk" value="Low" trend="Stable" isPositive={true} />
        </div>

        <section className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-[0_4px_25px_rgb(0,0,0,0.02)] mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Performance Trends</h2>
              <p className="text-slate-400 text-xs font-medium">Metric overview for the current week.</p>
            </div>
            <select className="bg-slate-50 border-none rounded-lg text-[11px] font-bold p-2 outline-none ring-1 ring-slate-100 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 13, fontWeight: 700}} 
                  dy={10} 
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', padding: '10px' }}
                  itemStyle={{ color: '#2dd4bf', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0d9488" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#premiumGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Active Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase font-black tracking-[0.15em]">
                  <th className="px-8 py-5">Asset Name</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Price</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-900 text-sm">{product.name}</td>
                    <td className="px-8 py-5">
                      <span className="text-slate-500 font-medium text-xs">{product.category}</span>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-900 text-sm">${product.price.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.status === 'In Stock' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${product.status === 'In Stock' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {product.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}