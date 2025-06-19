"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useLanguage } from "./language-provider"
import { useRef, useState } from "react"

const Categories = () => {
    const shopId = localStorage.getItem("shopId")
    const { t, language, setLanguage } = useLanguage()
    const searchTermRef = useRef<HTMLInputElement>(null)
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const categoryRef = useRef<HTMLInputElement>(null);

    const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !shopId) return console.error("Token yoki shopId topilmadi");

        const name = categoryRef.current?.value?.trim();

        if (!name) return toast({ title: "❗️Nomi bo‘sh bo‘lmasligi kerak", variant: "destructive" });

        try {
            const response = await fetch(`${baseUrl}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ dto: { name} }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.Message || "Xatolik");

            toast({
                title: "✅ Qo‘shildi",
                description: `📦 ${name} categoriyasi qo‘shildi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });

        } catch (error) {
            console.error("❌ Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Kategoriya qo‘shishda xatolik yuz berdi",
                variant: "destructive",
            });
        }
    };

    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {t("products")}
                    </h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                                <Plus className="w-4 h-4 mr-2" />
                                {t("add_product")}
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Yangi categorie qo'shish</DialogTitle>
                                <DialogDescription>Yangi categorie ma'lumotini kiriting</DialogDescription>
                            </DialogHeader>

                            <form className="grid gap-4 py-4" onSubmit={handleAddCategory}>
                                <div className="space-y-2">
                                    <Label htmlFor="product_name">{t("name")}</Label>
                                    <Input
                                        id="product_name"
                                        name="name"
                                        ref={categoryRef}
                                        placeholder="Kategoriya nomi"
                                        className="border-2 focus:border-emerald-400"
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        className="mt-4 bg-emerald-500 text-white py-2 px-4 rounded-md"
                                    >
                                        {t("add")}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t("search")}
                            value={searchTermRef.current?.value}
                            className="pl-10 h-12 rounded-xl border-2 focus:border-emerald-400 max-w-xl"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Categories
