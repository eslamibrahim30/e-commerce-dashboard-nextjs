"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from 'sonner';
import  {loginSchema}  from "@/lib/validation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
    
  const router = useRouter()    

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  async function onSubmit(data: LoginForm) {

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      toast.error("Invalid credentials", {
                    style: {
                        background: '#dc2626',
                        color: '#fff',
                    },
                });
      return
    }
    toast.success('Login successful!',{style: {
    background: "#16a34a",
    color: "white",
    },});
    
    router.push("/")
  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-muted">

      <Card className="w-95">

        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <div>
              <Label>Email</Label>

              <Input
                type="email"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label>Password</Label>

              <Input
                type="password"
                {...register("password")}
              />

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}