import React from "react";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingSpinner({ message = "Loading data..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[200px] w-full animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary/10" />
        <Loader2 className="w-12 h-12 text-primary animate-spin absolute top-0 left-0" />
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ 
  title = "Something went wrong", 
  message, 
  onRetry 
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-destructive/20 bg-destructive/5 rounded-2xl w-full max-w-2xl mx-auto my-4 animate-in zoom-in-95 duration-300">
      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
        <AlertCircle size={28} />
      </div>
      
      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
        {message}
      </p>

      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="gap-2 border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all"
        >
          <RefreshCcw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
}