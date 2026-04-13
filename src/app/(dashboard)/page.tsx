import React from 'react';
import { products } from './data';

// Component for displaying individual statistic cards
const StatCard = ({ title, value, color }: { title: string; value: number | string; color: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default function DashboardPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to your store management panel.</p>
      </div>

      {/* Stats Grid (Day 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Products" value={products.length} color="text-blue-600" />
        <StatCard title="Low Stock" value={1} color="text-orange-500" />
        <StatCard title="Out of Stock" value={1} color="text-red-600" />
      </div>

      {/* Products Table (Day 2) */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Products</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{product.category}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">${product.price}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${product.status === 'In Stock' ? 'bg-green-100 text-green-700' : 
                        product.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' : 
                        'bg-red-100 text-red-700'}`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}