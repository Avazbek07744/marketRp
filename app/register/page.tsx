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

export default function Register() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        username: "",
        password: "",
        role: "",
        shopId: "", 
    })

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log(formData);

        setIsLoading(true)

        try {
            const res = await fetch(`${baseUrl}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    addUserDto: {
                        fullName: formData.fullName,
                        phoneNumber: formData.phoneNumber,
                        username: formData.username,
                        password: formData.password,
                        role: formData.role, 
                        shopId: null,
                    }
                }),
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(errorText || "Ro‘yxatdan o‘tishda xatolik")
            }

            toast({
                title: "Muvaffaqiyatli",
                description: "Ro‘yxatdan o‘tildi. Endi login qiling.",
            })

            router.push("/login")
        } catch (error: any) {
            toast({
                title: "Xatolik",
                description: error.message || "Xatolik yuz berdi",
                action: <ToastAction altText="Yana urinish">Yana urinish</ToastAction>,
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
                    <CardTitle className="text-2xl text-white">Ro‘yxatdan o‘tish</CardTitle>
                    <CardDescription className="text-white/70">Yangi foydalanuvchi</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            type="text"
                            // defaultValue='Azizbek'
                            placeholder="To‘liq ism"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                        <Input
                            type="text"
                            // defaultValue='owner'
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                        <Input
                            type="number"
                            // defaultValue='884662202'
                            placeholder="Telefon raqam"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                        <Input
                            type="password"
                            // defaultValue='12345'
                            placeholder="Parol"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />

                        <Input
                            type="password"
                            // defaultValue='12345'
                            placeholder="Role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />

                        <Input
                            type="text"
                            // defaultValue='12345'
                            placeholder="shopId"
                            value={formData.shopId}
                            onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />

                        <Button
                            type="submit"
                            className="w-full bg-white text-dark-blue hover:bg-white/90 font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? "..." : "Ro‘yxatdan o‘tish"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    )
}
