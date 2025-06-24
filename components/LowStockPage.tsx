"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Edit, } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { useLanguage } from "./language-provider"
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import lord from '@/axios'
import Cookies from 'js-cookie'

interface ProductType {
    id: string;
    name: string;
    quantityInStock: number;
    unitOfMeasureString: string;
    categoryName: string;
    lowStockThreshold: number;
    [key: string]: any;
}

const LowStockPage = () => {

    const [shopId, setShopId] = useState<string | undefined>(undefined);
    const [token, setToken] = useState<string | undefined>(undefined);
    const { t, language, setLanguage } = useLanguage();
    const [product, setProduct] = useState<ProductType[]>([])
    const lowStockProducts = product.length > 0 && product.filter((p) => p.quantityInStock <= 10 && p.outOfStockThreshold > 0);
    const router = useRouter();
    const [refetchCount, setRefetchCount] = useState(0);


    useEffect(() => {
        const savedShopId = Cookies.get("shopId");
        const savedToken = Cookies.get("token");

        setShopId(savedShopId);
        setToken(savedToken);
    }, []);

    useEffect(() => {
        if (!token || !shopId) return;

        const getProducts = async () => {
            try {
                const res = await lord.get(`/api/product/shop/${shopId}`);
                setProduct(res.data);
            } catch (error) {
                console.error("❌ Mahsulotlarni olishda xatolik:", error);
                toast({
                    title: "Xatolik",
                    description: "Mahsulotlarni olishda muammo yuz berdi",
                    variant: "destructive",
                });
            }
        };

        getProducts();
    }, [token, shopId, refetchCount]);

    const handleEditProduct = async (
        e: React.FormEvent<HTMLFormElement>,
        itemId: string
    ) => {
        e.preventDefault();
        if (!token || !shopId) {
            console.error("Token yoki shopId topilmadi");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const raw = Object.fromEntries(formData.entries());

        const data = {
            sellingPrice: Number(raw.price),
            quantityInStock: Number(raw.quantity),
        };

        try {
            await lord.put(`/api/product/${itemId}`, data);
            toast({
                title: "✅ Yangilandi",
                description: `✏️ ${data.sellingPrice} so'm narxdagi mahsulot yangilandi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error: any) {
            console.error("❌ Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Mahsulot yangilashda xatolik yuz berdi",
                variant: "destructive",
            });
        } finally {
            setRefetchCount(prev => prev + 1);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        {t("low_stock")}
                    </h2>
                    <p className="text-muted-foreground">Kam qolgan mahsulotlar</p>
                </div>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-yellow-50 dark:from-slate-800 dark:to-yellow-900">
                    <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                        <CardTitle className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5" />
                            <span>Kam qolgan mahsulotlar</span>
                        </CardTitle>
                        <CardDescription className="text-yellow-100">
                            10 dona yoki undan kam qolgan mahsulotlar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lowStockProducts &&
                                lowStockProducts.map((product) => (
                                    <Card
                                        key={product.id}
                                        className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium">{product.name}</h3>
                                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                                    {product.quantityInStock} {product.unitOfMeasureString}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {product.categoryName}
                                            </p>
                                            {/* <Button
                                                size="sm"
                                                onClick={()=>{hendleAdd(product.id)}}
                                            >
                                                Qo'shish
                                            </Button> */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm"
                                                        className="w-full  text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:text-white">
                                                        Qo'shish
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Mahsulotni tahrirlash</DialogTitle>
                                                        <DialogDescription>Mahsulot ma'lumotlarini o'zgartiring</DialogDescription>
                                                    </DialogHeader>
                                                    <form onSubmit={(e) => handleEditProduct(e, product.id)}>
                                                        <div className="grid grid-cols-2 gap-2 mb-6">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="edit_quantity">{t("quantity")}</Label>
                                                                <Input
                                                                    id="edit_quantity"
                                                                    name="quantity"
                                                                    type="number"
                                                                    defaultValue={product?.quantityInStock}
                                                                    className="border-2 focus:border-emerald-400"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="edit_price">{t("price")}</Label>
                                                                <Input
                                                                    id="edit_price"
                                                                    name="price"
                                                                    type="number"
                                                                    defaultValue={product?.sellingPrice}
                                                                    className="border-2 focus:border-emerald-400"
                                                                />
                                                            </div>
                                                        </div>

                                                        <DialogFooter>
                                                            <Button
                                                                type="submit"
                                                                className="bg-gradient-to-r from-emerald-500 to-teal-500"
                                                            >
                                                                {t("save")}
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </CardContent>
                </Card>

            </div >
            <Toaster />
        </>
    )
}

export default LowStockPage
