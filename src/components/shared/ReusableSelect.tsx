import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Option {
  label: string;
  value: string;
}

interface ReusableSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function ReusableSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
}: ReusableSelectProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label 
        className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
          error ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {label}
      </Label>

      <Select onValueChange={onChange} value={value}>
        <SelectTrigger 
          className={`bg-background transition-all focus:ring-primary/20 ${
            error 
              ? "border-destructive focus:ring-destructive/20" 
              : "focus:border-primary"
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent className="bg-card border-border shadow-xl">
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-[11px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}