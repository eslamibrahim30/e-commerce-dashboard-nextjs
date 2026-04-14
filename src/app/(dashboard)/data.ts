export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export const products: Product[] = [
  { id: '1', name: 'MacBook Pro M3', category: 'Electronics', price: 1999, stock: 15, status: 'In Stock' },
  { id: '2', name: 'Logitech MX Master', category: 'Accessories', price: 99, stock: 5, status: 'Low Stock' },
  { id: '3', name: 'iPhone 15 Pro', category: 'Electronics', price: 1099, stock: 0, status: 'Out of Stock' },
  { id: '4', name: 'Leather Wallet', category: 'Accessories', price: 45, stock: 25, status: 'In Stock' },
];

export const salesData = [
  { name: 'Mon', sales: 1200 },
  { name: 'Tue', sales: 2100 },
  { name: 'Wed', sales: 800 },
  { name: 'Thu', sales: 1600 },
  { name: 'Fri', sales: 2900 },
  { name: 'Sat', sales: 3100 },
  { name: 'Sun', sales: 1500 },
];