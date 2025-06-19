"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useLanguage } from "./language-provider"
import { useRouter } from 'next/navigation'

interface ProductType {
    id: number;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    price: number;
    lowStock: boolean;
    trending: boolean;
}

interface LowStockPageProps {
    data: ProductType[];
}

const LowStockPage: React.FC<LowStockPageProps> = ({ data }) => {
    const { t, language, setLanguage } = useLanguage();
    const lowStockProducts = data && data.filter((p) => p.quantity <= 10 && p.quantity > 0);
    const router = useRouter();

    
    function hendleClick() {
        router.push(`/employee`)
    }

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
                        <CardDescription className="text-yellow-100">10 dona yoki undan kam qolgan mahsulotlar</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lowStockProducts && lowStockProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium">{product.name}</h3>
                                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                                {product.quantity} {t(product.unit)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">{t(product.category)}</p>
                                        <Button
                                            size="sm"
                                            onClick={hendleClick}
                                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
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

export default LowStockPage
