"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react"; // أيقونة القفل
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function ReusableModal({
  isOpen,
  onClose,
  title,
  children,
  description,
}: ReusableModalProps) {
  
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        <div className="p-6 border-b bg-secondary/30 flex items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </DialogTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </DialogHeader>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="p-6">
          {children}
        </div>

      </DialogContent>
    </Dialog>
  );
}