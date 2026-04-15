import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, name, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full text-left">
        <Label 
          htmlFor={name} 
          className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
            error ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {label}
        </Label>

        <Input
          ref={ref} // ربط الـ ref هنا مهم جداً
          id={name}
          name={name}
          className={`bg-background border-input transition-all focus-visible:ring-primary/20 ${
            error 
              ? "border-destructive focus-visible:ring-destructive/20" 
              : "focus-visible:border-primary"
          } ${className}`}
          {...props} // نمرر الـ register props هنا (value, onChange, onBlur)
        />

        {error && (
          <p className="text-[11px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;