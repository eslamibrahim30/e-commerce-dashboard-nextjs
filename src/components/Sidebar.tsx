import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ShoppingBag, FolderTree, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Products", icon: ShoppingBag, href: "/products" },
    { label: "Categories", icon: FolderTree, href: "/categories" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-card h-screen flex flex-col fixed left-0 top-0 border-r transition-colors duration-300 z-50">

            <div className="p-6 mb-2">
                <Link href="/" className="flex items-center justify-start group">
                    <div className="w-32 h-10 flex items-center justify-start p-0.5 transition-all duration-300 group-hover:scale-105 ">
                        <Image
                            src="/logo.png" 
                            alt="Nova Logo"
                            width={128}
                            height={40} 
                            priority 
                            className="object-contain" 
                        />
                    </div>

                </Link>
            </div>

            {/* القائمة الجانبية (Nav) */}
            <nav className="flex-1 px-4 space-y-1.5">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                    >
                        <item.icon size={20} className="transition-colors group-hover:text-primary" />
                        <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t space-y-1 mt-auto">
                
                <Button
                    variant="ghost"
                    // تأثير الخروج باللون الأحمر الـ Destructive
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </Button>
            </div>
        </aside>
    );
}