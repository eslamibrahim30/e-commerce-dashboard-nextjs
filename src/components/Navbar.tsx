import { User, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {IUser} from "@/interfaces/users"
interface INavbarProp{
  user:IUser
}
export default function Navbar({user}:INavbarProp) {
  return (
    <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between transition-all duration-300">
      
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Overview
        </h2>
      </div>

      <div className="flex items-center gap-3">
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-primary rounded-full w-9 h-9"
        >
          <Bell size={18} />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-secondary transition-all group">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <User size={16} />
          </div>

          <div className="hidden md:flex flex-col items-start leading-tight text-left">
            <span className="text-xs font-bold text-foreground">  {user?.name || "User"}</span>
            <span className="text-[10px] text-muted-foreground">Administrator</span>
          </div>

          <ChevronDown size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

      </div>
    </header>
  );
}