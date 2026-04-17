import { User, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interfaces/users";

interface INavbarProp {
  user: IUser;
}

export default function Navbar({ user }: INavbarProp) {
  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-all duration-300">
      
      <div className="flex items-center gap-4">
        <div className="lg:hidden w-10" /> 
        <h2 className="text-[10px] md:text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">
          Overview
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-primary rounded-xl w-9 h-9"
        >
          <Bell size={18} />
        </Button>

        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

        <button className="flex items-center gap-2 md:gap-3 p-1 md:pr-3 rounded-2xl hover:bg-secondary/50 transition-all group">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <User size={16} />
          </div>

          <div className="hidden sm:flex flex-col items-start leading-tight text-left">
            <span className="text-[11px] font-black text-foreground truncate max-w-[80px]">
              {user?.name || "User"}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-70">
              Admin
            </span>
          </div>

          <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

      </div>
    </header>
  );
}