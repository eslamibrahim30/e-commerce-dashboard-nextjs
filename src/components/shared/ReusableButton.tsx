import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; 
import { cn } from "@/lib/utils"; 

interface ReusableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function ReusableButton({
  children,
  variant = "primary",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ReusableButtonProps) {
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/10",
    ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
  };

  return (
    <Button
      disabled={isLoading || disabled}
      className={cn(
        "relative flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95",
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}

      <span className={cn(isLoading && "opacity-0")}>{children}</span>

      {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}

      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center text-xs">
          Processing...
        </span>
      )}
    </Button>
  );
}