"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
    LayoutDashboard, ShoppingBag, FolderTree, 
    LogOut, Menu, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ILogOut {
    success: boolean;
    data: null;
    message: string;
}

const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Products", icon: ShoppingBag, href: "/products" },
    { label: "Categories", icon: FolderTree, href: "/categories" },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", { method: "POST" });
        const data: ILogOut = await response.json();

        if (response.ok) {
            toast.success(data.message, {
                style: { background: "#16a34a", color: "white" },
            });
        } else {
            toast.error(data.message || "Logout failed", {
                style: { background: '#dc2626', color: '#fff' },
            });
        }
        router.push("/login");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-primary text-white rounded-xl shadow-lg active:scale-95 transition-all"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed left-0 top-0 h-screen bg-card border-r z-[58] transition-all duration-300 ease-in-out flex flex-col w-64",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>

                <div className="p-8 mb-4">
                    <Link href="/" className="flex items-center justify-start group">
                        <div className="w-32 h-10 relative transition-all duration-300 group-hover:scale-105">
                            <Image
                                src="/logo.png"
                                alt="Nova Logo"
                                fill
                                priority
                                className="object-contain"
                            />
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-semibold text-sm",
                                    isActive 
                                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                )}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border/50 mt-auto">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-xl font-bold h-12"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </Button>
                </div>
            </aside>
        </>
    );
}