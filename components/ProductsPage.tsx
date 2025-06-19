"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import {
    Plus,
    Edit,
    Trash2,
    Search,
    TrendingUp,
    Package,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useLanguage } from "./language-provider"
import { useEffect, useState } from "react"

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

const ProductsPage = () => {
    const shopId = localStorage.getItem("shopId")
    const { t, language, setLanguage } = useLanguage()
    const [searchTerm, setSearchTerm] = useState("")
    const [product, setProduct] = useState([])
    const [categories, setCategories] = useState([
        { value: "all", label: "Barchasi" },
        { value: "fruits", label: t("fruits") },
        { value: "vegetables", label: t("vegetables") },
        { value: "drinks", label: t("drinks") },
        { value: "dairy", label: t("dairy") },
        { value: "meat", label: t("meat") },
        { value: "other", label: t("other") },
    ]
    )
    const [selectedCategory, setSelectedCategory] = useState("all")
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log(shopId);


    useEffect(() => {
        const getCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token || !shopId) throw new Error("Token yoki shopId yo‘q");

                const res = await fetch(`${baseUrl}/api/categories/shop/${shopId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Serverdan noto‘g‘ri javob keldi");

                const data = await res.json();
                console.log("Kategoriya ma'lumotlari:", data);

                // setProduct(data); // ← agar kerak bo‘lsa
            } catch (error) {
                console.error("fetchda hatolik bor:", error);
            }
        };

        getCategories();
    }, []);

    // useEffect(() => {
    //     const token = localStorage.getItem("token")
    //     fetch(`${baseUrl}/api/product/shop/${shopId}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({ dto: shopId })
    //     })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error("Serverdan noto‘g‘ri javob keldi");
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             setProduct(data)
    //         })
    //         .catch(error => {
    //             console.log("fetchda hatolik bor:", error);
    //         });
    // }, []);


    const handleAddProduct = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !shopId) return console.error("Token yoki shopId topilmadi");

        const formData = new FormData(e.currentTarget);
        const raw = Object.fromEntries(formData.entries());

        const data = {
            name: String(raw.name || ""),
            categoryId: String(raw.categoryId || ""),
            unitOfMeasure: Number(raw.unitOfMeasure || 0),
            purchasePrice: Number(raw.purchasePrice || 0),
            sellingPrice: Number(raw.sellingPrice || 0),
            quantityInStock: Number(raw.quantityInStock || 0),
            lowStockThreshold: Number(raw.lowStockThreshold || 0),
            outOfStockThreshold: Number(raw.outOfStockThreshold || 0),
            shopId,
        };

        try {
            const response = await fetch(`${baseUrl}/api/product`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ dto: data }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.Message || "Xatolik");

            toast({
                title: "✅ Qo‘shildi",
                description: `📦 ${data.name} mahsuloti qo‘shildi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error) {
            console.error("❌ Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Mahsulot qo‘shishda xatolik yuz berdi",
                variant: "destructive",
            });
        }
    };

    const handleEditProduct = async (
        e: React.FormEvent<HTMLFormElement>,
        itemId: number,
    ) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !shopId) return console.error("Token yoki shopId topilmadi");

        const formData = new FormData(e.currentTarget);
        const raw = Object.fromEntries(formData.entries());

        const data = {
            sellingPrice: raw.price,
            quantityInStock: raw.quantity
        };

        try {
            const response = await fetch(`${baseUrl}/api/product/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.Message || "Xatolik");

            toast({
                title: "✅ Yangilandi",
                description: `✏️ ${data.sellingPrice} mahsuloti yangilandi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error) {
            console.error("❌ Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Mahsulot yangilashda xatolik yuz berdi",
                variant: "destructive",
            });
        }
    };

    const handleDeleteProduct = async (
        itemId: number,
    ) => {
        const token = localStorage.getItem("token");
        if (!token) return console.error("Token topilmadi");

        try {
            const response = await fetch(`${baseUrl}/api/product/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.Message || "Xatolik");

            toast({
                title: "✅ O‘chirildi",
                description: `🗑️ ${itemId} mahsuloti o‘chirildi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error) {
            console.error("❌ Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Mahsulot o‘chirishda xatolik yuz berdi",
                variant: "destructive",
            });
        }
    };

    const getStockStatus = (product: any) => {
        if (product.quantity === 0) {
            return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">Tugagan</Badge>
        } else if (product.quantity <= 10) {
            return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">Kam</Badge>
        } else {
            return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">Yetarli</Badge>
        }
    }

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
                                <DialogTitle>Yangi mahsulot qo'shish</DialogTitle>
                                <DialogDescription>Yangi mahsulot ma'lumotlarini kiriting</DialogDescription>
                            </DialogHeader>

                            <form className="grid gap-4 py-4" onSubmit={(e) => handleAddProduct(e)}>
                                <div className="space-y-2">
                                    <Label htmlFor="product_name">{t("name")}</Label>
                                    <Input
                                        id="product_name"
                                        name="name"
                                        placeholder="Mahsulot nomi"
                                        className="border-2 focus:border-emerald-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="product_category">{t("category")}</Label>
                                    <Select name="categoryId">
                                        <SelectTrigger className="border-2 focus:border-emerald-400">
                                            <SelectValue placeholder="Kategoriyani tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories
                                                .filter((c) => c.value !== "all")
                                                .map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="product_quantity">{t("quantity")}</Label>
                                        <Input
                                            id="product_quantity"
                                            name="quantityInStock"
                                            type="number"
                                            step="0.001"
                                            placeholder="0"
                                            className="border-2 focus:border-emerald-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product_unit">O'lchov birligi</Label>
                                        <Select name="unitOfMeasure">
                                            <SelectTrigger className="border-2 focus:border-emerald-400">
                                                <SelectValue placeholder="Birlik" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">{t("kg")}</SelectItem>
                                                <SelectItem value="2">{t("piece")}</SelectItem>
                                                <SelectItem value="3">{t("liter")}</SelectItem>
                                                <SelectItem value="4">Metr</SelectItem>
                                                <SelectItem value="5">Quti</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="cost_price">Asl narxi</Label>
                                        <Input
                                            id="cost_price"
                                            name="purchasePrice"
                                            type="number"
                                            placeholder="0"
                                            className="border-2 focus:border-emerald-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="selling_price">Sotuv narxi</Label>
                                        <Input
                                            id="selling_price"
                                            name="sellingPrice"
                                            type="number"
                                            placeholder="0"
                                            className="border-2 focus:border-emerald-400"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="low_stock">Minimal zaxira (lowStockThreshold)</Label>
                                    <Input
                                        id="low_stock"
                                        name="lowStockThreshold"
                                        type="number"
                                        placeholder="0"
                                        className="border-2 focus:border-emerald-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="out_stock">Yuq bo‘lish zaxirasi (outOfStockThreshold)</Label>
                                    <Input
                                        id="out_stock"
                                        name="outOfStockThreshold"
                                        type="number"
                                        placeholder="0"
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 rounded-xl border-2 focus:border-emerald-400"
                        />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-2 focus:border-emerald-400">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {product.length > 0 ? product.map((product) => (
                        <Card
                            key={product?.id}
                            className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900 overflow-hidden relative group hover:shadow-2xl transition-all duration-300"
                        >
                            {product?.trending && (
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-0">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Trend
                                    </Badge>
                                </div>
                            )}
                            <div
                                className={`h-2 bg-gradient-to-r ${product?.quantity === 0
                                    ? "from-red-400 to-pink-400"
                                    : product?.quantity <= 10
                                        ? "from-yellow-400 to-orange-400"
                                        : "from-green-400 to-emerald-400"
                                    }`}
                            />
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Package className="w-5 h-5 text-emerald-600" />
                                    <span>{product?.name}</span>
                                </CardTitle>
                                <CardDescription>{t(product?.category)}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Miqdor:</span>
                                        {getStockStatus(product)}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Narx:</span>
                                        <span className="font-bold text-emerald-600">{product?.price.toLocaleString()} so'm</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex-1 hover:bg-emerald-50 border-emerald-200">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Tahrirlash
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Mahsulotni tahrirlash</DialogTitle>
                                                <DialogDescription>Mahsulot ma'lumotlarini o'zgartiring</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={(e) => handleEditProduct(e, product?.id)}>
                                                <div className="grid gap-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit_name">{t("name")}</Label>
                                                        <Input
                                                            id="edit_name"
                                                            name="name"
                                                            defaultValue={product?.name}
                                                            className="border-2 focus:border-emerald-400"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit_quantity">{t("quantity")}</Label>
                                                            <Input
                                                                id="edit_quantity"
                                                                name="quantity"
                                                                type="number"
                                                                defaultValue={product?.quantity}
                                                                className="border-2 focus:border-emerald-400"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit_price">{t("price")}</Label>
                                                            <Input
                                                                id="edit_price"
                                                                name="price"
                                                                type="number"
                                                                defaultValue={product?.price}
                                                                className="border-2 focus:border-emerald-400"
                                                            />
                                                        </div>
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
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="hover:bg-red-50 border-red-200">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Mahsulotni o'chirish</DialogTitle>
                                                <DialogDescription>
                                                    Bu amalni qaytarib bo'lmaydi. Mahsulot butunlay o'chiriladi.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline">{t("cancel")}</Button>
                                                <Button variant="destructive" onSubmit={() => handleDeleteProduct(product?.id)}>
                                                    {t("delete")}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    )) : <p className="text-3xl text-red-600 font-bold text-center my-10">Kechirasiz do'koningizda mahsulotlar yo'q mahsulot qo'shing</p>}
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default ProductsPage;
