import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import User from "@/models/users";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;

  if (token) {
    const decoded = verifyToken(token);

    if (decoded) {
      user = await User.findById(decoded.userId).select("-password");
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col transition-all duration-300 ml-0 lg:ml-64">
        <Navbar user={user} />
        
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}