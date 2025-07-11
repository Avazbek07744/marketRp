"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, XCircle, } from "lucide-react"
import {toast} from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useLanguage } from "./language-provider"
import { useRouter } from 'next/navigation'
import lord from '@/axios'
import Cookies from 'js-cookie'

interface ProductType {
    id: string;
    name: string;
    quantityInStock: number;
    outOfStockThreshold: number;
    category: string;
}

const OutOfStockPage = () => {

    const [shopId, setShopId] = useState<string | undefined>(undefined);
    const [token, setToken] = useState<string | undefined>(undefined);
    const { t, language, setLanguage } = useLanguage();
    const [product, setProduct] = useState<ProductType[]>([])
    const router = useRouter();
    const outOfStockProducts = product.filter(
        (p) => p.quantityInStock <= p.outOfStockThreshold
    );


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
    }, [token, shopId]);

    function hendleClick() {
        router.push("/")
    }


    return (
        <>
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                        {t("out_of_stock")}
                    </h2>
                    <p className="text-muted-foreground">Tugagan mahsulotlar</p>
                </div>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-red-50 dark:from-slate-800 dark:to-red-900">
                    <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
                        <CardTitle className="flex items-center space-x-2">
                            <XCircle className="w-5 h-5" />
                            <span>Tugagan mahsulotlar</span>
                        </CardTitle>
                        <CardDescription className="text-red-100">Omborda qolmagan mahsulotlar</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {outOfStockProducts && outOfStockProducts.map((product) => (
                                <Card key={product.id} className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium">{product.name}</h3>
                                            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">Tugagan</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{t(product.category)}</p>
                                        <Button
                                            size="sm"
                                            onClick={hendleClick}
                                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                                        >
                                            Qo'shish
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </>
    )
}

export default OutOfStockPage
