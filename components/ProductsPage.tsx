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
import lord from "@/axios"

interface ProductType {
    id: string;
    name: string;
    categoryId: string;
    categoryName: string;
    shopId: string;
    unitOfMeasure: number;
    unitOfMeasureString: string;
    purchasePrice: number;
    sellingPrice: number;
    quantityInStock: number;
    lowStockThreshold: number;
    outOfStockThreshold: number;
    createdDate: string;
    updatedDate: string;
    stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
    trending: string
}

const ProductsPage = () => {
    const { t } = useLanguage();
    const [shopId, setShopId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [product, setProduct] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [unit, setUnit] = useState("");
    const [refetchCount, setRefetchCount] = useState(0);

    // Token va shopId ni localStorage dan olish
    useEffect(() => {
        const savedShopId = localStorage.getItem("shopId");
        const savedToken = localStorage.getItem("token");

        setShopId(savedShopId);
        setToken(savedToken);
    }, []);

    // Kategoriyalarni olish
    useEffect(() => {
        if (!token || !shopId) return;

        const getCategories = async () => {
            try {
                const res = await lord.get(`/api/categories/shop/${shopId}`);
                setCategories(res.data);
            } catch (error) {
                console.error("❌ Kategoriyalarni olishda xatolik:", error);
            }
        };

        getCategories();
        setRefetchCount(prev => prev + 1);
    }, [token, shopId]);

    // Mahsulotlarni olish
    useEffect(() => {
        if (!token || !shopId) return;

        const getProducts = async () => {
            try {
                const res = await lord.get(`/api/product/shop/${shopId}`);
                setProduct(res.data);
            } catch (error) {
                console.error("❌ Mahsulotlarni olishda xatolik:", error);
            }
        };

        getProducts();
    }, [token, shopId, refetchCount]);

    // Filterlash productlarni
    useEffect(() => {
        if (searchTerm === "") setRefetchCount(prev => prev + 1);
        const filtered = product.filter((v) =>
            v.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProduct(filtered);
    }, [searchTerm]);

    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token || !shopId) return console.error("Token yoki shopId topilmadi");

        if (!selectedCategory || selectedCategory === "all") {
            return toast({
                title: "Kategoriya tanlanmadi",
                description: "Iltimos, mahsulot uchun kategoriya tanlang.",
                variant: "destructive",
            });
        }

        const formData = new FormData(e.currentTarget);
        const raw = Object.fromEntries(formData.entries());

        const data = {
            name: String(raw.name || ""),
            categoryId: selectedCategory,
            unitOfMeasure: Number(raw.unitOfMeasure || 0),
            purchasePrice: Number(raw.purchasePrice || 0),
            sellingPrice: Number(raw.sellingPrice || 0),
            quantityInStock: Number(raw.quantityInStock || 0),
            lowStockThreshold: Number(raw.lowStockThreshold || 0),
            outOfStockThreshold: Number(raw.outOfStockThreshold || 0),
            shopId,
        };

        try {
            const response = await lord.post(`/api/product`, data);

            toast({
                title: "✅ Qo‘shildi",
                description: `📦 ${data.name} mahsuloti qo‘shildi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error: any) {
            console.error("❌ Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Mahsulot qo‘shishda xatolik yuz berdi",
                variant: "destructive",
            });
        } finally {
            setRefetchCount(prev => prev + 1);
        }
    };

    const handleEditProduct = async (
        e: React.FormEvent<HTMLFormElement>,
        itemId: string
    ) => {
        e.preventDefault();
        if (!token || !shopId) return console.error("Token yoki shopId topilmadi");

        const formData = new FormData(e.currentTarget);
        const raw = Object.fromEntries(formData.entries());

        const data = {
            sellingPrice: Number(raw.price),
            quantityInStock: Number(raw.quantity),
        };

        try {
            const response = await lord.put(`/api/product/${itemId}`, data);
            toast({
                title: "✅ Yangilandi",
                description: `✏️ ${data.sellingPrice} mahsuloti yangilandi`,
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

    const handleDeleteProduct = async (itemId: string) => {
        if (!token) return console.error("Token topilmadi");

        try {
            const response = await lord.delete(`/api/product/${itemId}`);

            toast({
                title: "✅ O‘chirildi",
                description: `🗑️ ${itemId} mahsuloti o‘chirildi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error: any) {
            console.error("❌ Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Mahsulot o‘chirishda xatolik yuz berdi",
                variant: "destructive",
            });
        } finally {
            setRefetchCount(prev => prev + 1);
        }
    };

    const getStockStatus = (product: any) => {
        if (product.quantityInStock === 0) {
            return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">Tugagan</Badge>;
        } else if (product.quantityInStock <= 10) {
            return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">Kam</Badge>;
        } else {
            return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">Yetarli</Badge>;
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
                                    <Select onValueChange={(value) => setSelectedCategory(value)}>
                                        <SelectTrigger className="border-2 focus:border-emerald-400">
                                            <SelectValue placeholder="Kategoriyani tanlang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <input type="hidden" name="categoryId" value={selectedCategory} />
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
                                        <Select onValueChange={(value) => setUnit(value)}>
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

                                        {/* 📌 unitOfMeasure uchun ham hidden input */}
                                        <input type="hidden" name="unitOfMeasure" value={unit} />
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
                            <SelectValue aria-placeholder="Kategoriya tanlang" placeholder="Kategoriya tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <p className="px-4 py-2 text-sm text-muted-foreground">Kategoriya yo‘q</p>
                            )}
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
                                className={`h-2 bg-gradient-to-r ${product?.quantityInStock === 0
                                    ? "from-red-400 to-pink-400"
                                    : product?.quantityInStock <= 10
                                        ? "from-yellow-400 to-orange-400"
                                        : "from-green-400 to-emerald-400"
                                    }`}
                            />
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Package className="w-5 h-5 text-emerald-600" />
                                    <span>{product?.name}</span>
                                </CardTitle>
                                <CardDescription>{t(product?.categoryName)}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Miqdor:</span>
                                        {getStockStatus(product)}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Narx:</span>
                                        <span className="font-bold text-emerald-600">{product?.sellingPrice} so'm</span>
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
                                                <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                                                    {t("delete")}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    )) : <p className="text-3xl text-red-600 font-bold text-center my-10">Loading....</p>}
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default ProductsPage;
