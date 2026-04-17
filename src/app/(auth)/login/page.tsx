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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      
      <div className="mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Image 
          src="/logo.png" 
          alt="Nova Logo"
          width={100} 
          height={100}
          className="drop-shadow-2xl"
          priority 
        />
      </div>

      <Card className="w-full max-w-[400px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-card overflow-hidden rounded-[2.5rem]">
        <CardHeader className="space-y-1 pt-10 text-center pb-6">
          <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">
            Welcome Back
          </CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">
            Enter your credentials to access the dashboard
          </p>
        </CardHeader>

        <CardContent className="pb-10 px-6 md:px-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-4">
              <FormInput
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register("email")}
                className="w-full"
              />

              <FormInput
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
                className="w-full"
              />
            </div>

            <div className="pt-2">
              <ReusableButton
                type="submit"
                className="w-full h-12 md:h-14 text-base md:text-lg font-black rounded-2xl shadow-primary/20"
                isLoading={isSubmitting}
              >
                Sign In
              </ReusableButton>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <footer className="mt-8 flex flex-col items-center gap-2">
         <p className="text-[10px] text-muted-foreground tracking-[0.4em] uppercase opacity-40 font-bold">
          Nova Forest UI System &copy; 2026
        </p>
      </footer>
    </div>
  );
}