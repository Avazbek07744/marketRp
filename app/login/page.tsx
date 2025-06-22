"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phoneNumber: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.phoneNumber || !formData.password) {
            toast({
                title: "Ma'lumot yetarli emas",
                description: "Iltimos, login va parolni to‘ldiring",
            });
            return;
        }

        setIsLoading(true)

        try {
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Login yoki parol noto‘g‘ri.")
                } else {
                    throw new Error("Noma'lum server xatoligi.")
                }
            }

            const data = await res.json()

            localStorage.setItem("token", data.token)

            router.push("/super-admin")

        } catch (error: any) {
            toast({
                title: "Kirishda xatolik",
                description: error.message || "Xatolik yuz berdi",
                action: <ToastAction altText="Qayta urinish">Qayta urinish</ToastAction>,
            })
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
            <Card className="w-full max-w-sm glass-effect border-white/20">
                <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Store className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">AMC</CardTitle>
                    <CardDescription className="text-white/70">Kirish</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            id="username"
                            type="text"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            placeholder="Login"
                            required
                        />

                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            placeholder="Parol"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full bg-white text-dark-blue hover:bg-white/90 font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? "..." : "Kirish"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    )
}
