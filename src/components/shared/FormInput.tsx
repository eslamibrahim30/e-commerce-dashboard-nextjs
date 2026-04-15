import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  error,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label 
        htmlFor={name} 
        className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
          error ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {label}
      </Label>

      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`bg-background border-input transition-all focus-visible:ring-primary/20 ${
          error 
            ? "border-destructive focus-visible:ring-destructive/20" 
            : "focus-visible:border-primary"
        }`}
      />

      {error && (
        <p className="text-[11px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}