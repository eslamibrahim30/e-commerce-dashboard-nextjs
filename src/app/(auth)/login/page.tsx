"use client";

import Image from "next/image"; 
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from 'sonner';
import { loginSchema } from "@/lib/validation";

import FormInput from "@/components/shared/FormInput";
import ReusableButton from "@/components/shared/ReusableButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  async function onSubmit(data: LoginForm) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      toast.error("Invalid credentials", {
        style: { background: '#dc2626', color: '#fff' },
      });
      return;
    }

    toast.success('Login successful!', {
      style: { background: "#16a34a", color: "white" },
    });
    
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <Image 
          src="/logo.png" 
          alt="Nova Logo"
          width={80} 
          height={80}
          className="drop-shadow-xl"
          priority 
        />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl bg-card">
        <CardHeader className="space-y-1 pt-8 text-center border-b border-border/10 pb-6 mb-4">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the dashboard
          </p>
        </CardHeader>

        <CardContent className="pb-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormInput
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <ReusableButton
              type="submit"
              className="w-full h-12 text-lg font-bold"
              isLoading={isSubmitting}
            >
              Sign In
            </ReusableButton>
          </form>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-xs text-muted-foreground tracking-widest uppercase opacity-50">
        Nova Forest UI System &copy; 2026
      </p>
    </div>
  );
}