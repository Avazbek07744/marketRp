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
import {
    Plus,
    Edit,
    Trash2,
    Beaker,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useLanguage } from "./language-provider"
import { useEffect, useRef, useState } from "react"
import lord from "@/axios"

interface categoryType {
    id: string,
    name: string,
    updatedDate: string,
}

const Categories = () => {
    const { t, language, setLanguage } = useLanguage();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const categoryRef = useRef<HTMLInputElement>(null);

    const [category, setCategory] = useState<categoryType[]>([]);
    const [shopId, setShopId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [refetchCount, setRefetchCount] = useState(0);

    useEffect(() => {
        const savedShopId = localStorage.getItem("shopId");
        const savedToken = localStorage.getItem("token");

        setShopId(savedShopId);
        setToken(savedToken);
    }, []);

        useEffect(() => {
        if (!token || !shopId) return;

        const getProducts = async () => {
            try {
                const res = await lord.get(`/api/categories/shop/${shopId}`);
                setCategory(res.data);
            } catch (error) {
                console.error("❌ Mahsulotlarni olishda xatolik:", error);
            }
        };

        getProducts();
    }, [token, shopId, refetchCount]);


    const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !shopId) return console.error("Token yoki shopId topilmadi");

        const dto = {
            name: categoryRef.current?.value?.trim()
        };

        if (!dto.name) return toast({ title: "❗️Nomi bo‘sh bo‘lmasligi kerak", variant: "destructive" });

        try {
            const response = await lord.post(`${baseUrl}/api/categories`, dto);

            toast({
                title: "✅ Qo‘shildi",
                description: `📦 ${dto.name} categoriyasi qo‘shildi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error: unknown) {
            console.error("❌ Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Kategoriya qo‘shishda xatolik yuz berdi",
                variant: "destructive",
            });
        } finally {
            setRefetchCount(prev => prev + 1);
        }
    };

    const handleEditCategory = async (e: React.FormEvent<HTMLFormElement>, id: string, dateUp: string) => {
        e.preventDefault();
        if (!token || !shopId) return console.error("Token yoki shopId topilmadi");

        const formData = new FormData(e.currentTarget);
        const entries = Object.fromEntries(formData.entries());

        const dto = {
            id,
            name: entries.name,
            shopId,
            updatedDate: dateUp,
        };

        if (!dto.name) return toast({ title: "❗️Nomi bo‘sh bo‘lmasligi kerak", variant: "destructive" });

        try {
            const response = await lord.post(`/api/categories/${id}`, dto);

            toast({
                title: "✅ Yangilandi",
                description: `📦 ${dto.name} categoriyasi yangilandi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error:unknown) {
            console.error("❌ Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Kategoriya yangilashda xatolik yuz berdi",
                variant: "destructive",
            });
        } finally {
            setRefetchCount(prev => prev + 1);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!token) return console.error("Token yoki shopId topilmadi");

        try {
            const response = await lord.delete(`/api/categories/${id}`)

            toast({
                title: "✅ O‘chirildi",
                description: `📦 kategoriya o‘chirildi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error: unknown) {
            const err = error as { message?: string };

            toast({
                title: "Xatolik",
                description: err.message || "Noma'lum xatolik yuz berdi",
                variant: "destructive",
            });
        } finally {
            setRefetchCount(prev => prev + 1);
        }
    };


    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                        {t("category")}
                    </h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                                <Plus className="w-4 h-4 mr-2" />
                                {t("add_category")}
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

                <div className="space-y-6">
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-200 to-blue-50 dark:from-blue-400 dark:to-blue-700">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.length > 0 ? category.map(category => (
                                    <Card key={category?.id} className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-black">{category?.name}</h3>
                                                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">{t("category")}</Badge>
                                            </div>
                                            <div className="flex items-center space-x-2 pt-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 hover:bg-red-50 border-red-200"
                                                        >
                                                            <Edit className="w-4 h-4 mr-1" />
                                                            Tahrirlash
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Categoriyani tahrirlash</DialogTitle>
                                                            <DialogDescription>Ishchi nomini o'zgartiring</DialogDescription>
                                                        </DialogHeader>

                                                        <form onSubmit={(e) => handleEditCategory(e, category.id, category.updatedDate)} className="grid gap-4 py-4">

                                                            <div className="space-y-2">
                                                                <Label htmlFor="edit_category_name">Categoriya nomi</Label>
                                                                <Input
                                                                    id="edit_category_name"
                                                                    name="name"
                                                                    defaultValue={category?.name}
                                                                    className="border-2 focus:border-blue-400"
                                                                />
                                                            </div>

                                                            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500">
                                                                {t("save")}
                                                            </Button>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="hover:bg-red-50 border-red-200">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Categoriyani o'chirish</DialogTitle>
                                                            <DialogDescription>
                                                                Bu amalni qaytarib bo'lmaydi. Categoriya butunlay o'chiriladi.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button variant="outline">{t("cancel")}</Button>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDeleteCategory(category.id)}
                                                            >
                                                                {t("delete")}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )) : <p className="text-3xl text-center mt-10 text-red-500">Categoriyalar mavjud emas categoriya qo'shing</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Toaster />
            </div>
            <Toaster />
        </div>
    )
}

export default Categories
