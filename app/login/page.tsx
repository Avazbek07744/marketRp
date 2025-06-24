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
import lord from "@/axios"
import Cookies from "js-cookie";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phoneNumber: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.phoneNumber || !formData.password) {
            toast({
                title: "Ma'lumot yetarli emas",
                description: "Iltimos, login va parolni to‘ldiring",
            });
            return;
        }

        setIsLoading(true);

        try {
            const res = await lord.post(`/api/auth/login`, formData);

            // Tokenni Cookies va localStorage ga yozamiz
            Cookies.set("token", res.data.token);

            if (formData.phoneNumber === "+998941061243" && formData.password === "200704") {
                router.push("/super-admin");
            } else {
                router.push("/");
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.Message || "Xatolik yuz berdi";

            if (error.response?.status === 403 && errorMessage === "User account is not active.") {
                router.push("/payments");
                return;
            }

            toast({
                title: "Kirishda xatolik",
                description: errorMessage,
                action: <ToastAction altText="Qayta urinish">Qayta urinish</ToastAction>,
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                            className={`${isLoading ? "bg-black text-dark-blue" : "bg-white text-dark-blue"} w-full hover:bg-white/90 font-semibold`}
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
