"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { registerSchema } from "@/lib/validation";
import FormInput from "@/components/shared/FormInput";
import ReusableButton from "@/components/shared/ReusableButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RegisterForm = z.infer<typeof registerSchema>;
type RegisterResponse = {
  message: string;
  success?: boolean;
};

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterForm) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result: RegisterResponse = await res.json();

    if (!res.ok) {
      toast.error(result.message, {
        style: { background: '#dc2626', color: '#fff' },
      });
      return;
    }

    toast.success(result.message, {
      style: { background: '#16a34a', color: '#fff' },
    });
    router.push("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      
      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <Image 
          src="/logo.png" 
          alt="Nova Logo"
          width={70} 
          height={70}
          className="drop-shadow-xl"
          priority
        />
      </div>

      <Card className="w-full max-w-md border-none shadow-2xl bg-card">
        <CardHeader className="space-y-1 pt-8 text-center border-b border-border/10 pb-6 mb-4">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create Account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Join the forest and start managing your store
          </p>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <FormInput 
              label="Full Name" 
              placeholder="Nova Elnshar"
              error={errors.name?.message}
              {...register("name")} 
            />

            <FormInput 
              label="Email Address" 
              type="email" 
              placeholder="nova@example.com"
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
              className="w-full h-12 text-md font-bold mt-2" 
              type="submit"
              isLoading={isSubmitting}
            >
              Create Account
            </ReusableButton>

            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => router.push("/login")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Already have an account? <span className="font-semibold underline">Login</span>
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="mt-8 text-[10px] text-muted-foreground tracking-[0.2em] uppercase opacity-40">
        Nova Forest UI System &copy; 2026
      </p>
    </div>
  );
}