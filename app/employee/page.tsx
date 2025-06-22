"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "next-themes"
import {
  Store,
  Search,
  Moon,
  Sun,
  Globe,
  LogOut,
  ShoppingCart,
  Package,
  History,
  CheckCircle,
  Star,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

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
  rating?: number;
  popular?: boolean;
}

interface categoryType {
  id: string,
  name: string,
  updatedDate: string,
}

export default function EmployeePage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("products")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [quantityInputs, setQuantityInputs] = useState<{ [key: number]: string }>({})
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [shopId, setShopId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [load, setLoad] = useState(false);
  const [categories, setCategories] = useState<categoryType[]>([])

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedShopId = localStorage.getItem("shopId");

    setToken(savedToken);
    setShopId(savedShopId);
    setLoad(true)
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${baseUrl}/api/Users/GetShopId`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('xatolik yuz berdi');
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("shopId", data)
      })
      .catch((error) => {
        // console.error('Xatolik:', error);
      });
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token");
    const pathname = window.location.pathname

    if (!token && !pathname.includes("/register")) {
      router.push("/login")
    }
  }, [router])


  useEffect(() => {
    if (shopId) {
      fetch(`${baseUrl}/api/sales/shop/${shopId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('xatolik yuz berdi');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Mahsulot:', data);
        })
        .catch((error) => {
          console.error('Xatolik:', error);
        });
    }
  }, [token, shopId, load])

  useEffect(() => {
    if (shopId) {
      fetch(`${baseUrl}/api/product/shop/${shopId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('xatolik yuz berdi');
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
        })
        .catch((error) => {
          console.error('Xatolik:', error);
        });
    }

    if (token && shopId) {
      fetch(`${baseUrl}/api/categories/shop/${shopId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('xatolik yuz berdi');
          }
          return response.json();
        })
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => {
          console.error('Xatolik:', error);
        });
    }
  }, [token, shopId, load])

  const salesHistory = [
    { id: 1, product: "Olma", quantity: 5, unit: "kg", price: 8000, total: 40000, time: "10:30", date: "2024-01-15" },
    { id: 2, product: "Coca Cola", quantity: 10, unit: "piece", price: 5000, total: 50000, time: "11:15", date: "2024-01-15", },
    { id: 3, product: "Sut", quantity: 3, unit: "liter", price: 7000, total: 21000, time: "12:00", date: "2024-01-15" },
  ]


  const handleLogout = () => {
    router.push("/login")
    localStorage.removeItem("token")
    localStorage.removeItem("shopId")
  }


  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      toast({
        title: "🛒 Mahsulot allaqachon savatda",
        description: `${product.name} mahsuloti savatda mavjud. Miqdorni o'zgartiring.`,
        className: "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950",
      })
      setIsCartOpen(true)
      return
    } else {
      setCart([...cart, { ...product, quantity: 0 }])
      setQuantityInputs({ ...quantityInputs, [product.id]: "0" })
      toast({
        title: "✅ Savatga qo'shildi!",
        description: `${product.name} muvaffaqiyatli savatga qo'shildi`,
        className: "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950",
      })
    }
    setIsCartOpen(true)
  }

  const handleQuantityInputChange = (productId: number, value: string) => {
    // Allow empty string, numbers, and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setQuantityInputs({ ...quantityInputs, [productId]: value })

      // Update cart quantity
      const numValue = value === "" ? 0 : Number.parseFloat(value) || 0
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: numValue } : item)))
    }
  }

  const removeFromCart = (productId: number) => {
    const product = cart.find((item) => item.id === productId)
    setCart(cart.filter((item) => item.id !== productId))
    const newInputs = { ...quantityInputs }
    delete newInputs[productId]
    setQuantityInputs(newInputs)

    toast({
      title: "🗑️ Savatdan olib tashlandi",
      description: `${product?.name} savatdan olib tashlandi`,
      className: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950",
    })
  }

  const clearCart = () => {
    setCart([])
    setQuantityInputs({})
    setIsCartOpen(false)
    toast({
      title: "🧹 Savat tozalandi",
      description: "Barcha mahsulotlar savatdan olib tashlandi",
      className: "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950",
    })
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.sellingPrice * item.quantity, 0);
  };

  const handleCheckout = () => {
    const totalAmount = getTotalAmount()
    const itemCount = cart.length

    toast({
      title: "🎉 Savdo muvaffaqiyatli yakunlandi!",
      description: `${itemCount} ta mahsulot, jami: ${totalAmount.toLocaleString()} so'm`,
      className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
    })
    clearCart()
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.categoryName === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors = {
      fruits: "from-red-400 to-pink-400",
      vegetables: "from-green-400 to-emerald-400",
      drinks: "from-blue-400 to-cyan-400",
      dairy: "from-yellow-400 to-orange-400",
      meat: "from-purple-400 to-indigo-400",
      other: "from-gray-400 to-slate-400",
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 pb-20">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("app.name")}
              </h1>
              <p className="text-xs text-muted-foreground">{t("employee")}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-pulse">
                  {cart.length}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-yellow-100 dark:hover:bg-yellow-900"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Select value={language} onValueChange={(value: "uz" | "ru" | "en") => setLanguage(value)}>
              <SelectTrigger className="w-20 hover:bg-green-100 dark:hover:bg-green-900">
                <Globe className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uz">O'z</SelectItem>
                <SelectItem value="ru">Ру</SelectItem>
                <SelectItem value="en">En</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-100 dark:hover:bg-red-900">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6">
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("products")}
              </h2>
              <p className="text-muted-foreground">Mahsulotni tanlash uchun kartochkani bosing</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-2 focus:border-blue-400 transition-colors"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.name}
                      disabled={category.name === "all"} // faqat 'meat' bo'lsa disable
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product?.id}
                  className={`group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 overflow-hidden ${product?.quantityInStock === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={() => product?.quantityInStock > 0 && addToCart(product)}
                >
                  <div className={`h-2 bg-gradient-to-r ${getCategoryColor(product?.categoryName)}`} />
                  <CardHeader className="pb-3 relative">
                    {product?.popular && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                          <Star className="w-3 h-3 mr-1" />
                          Mashhur
                        </Badge>
                      </div>
                    )}
                    <CardTitle className="text-lg capitalize group-hover:text-blue-600 transition-colors">
                      {product?.name}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>{t(product?.categoryName)}</span>
                      {product?.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{product?.rating}</span>
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Narx:</span>
                        <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {product?.sellingPrice} so'm
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Mavjud:</span>
                        <Badge
                          variant={
                            product?.quantityInStock > product?.lowStockThreshold
                              ? "default"
                              : product?.quantityInStock > product?.outOfStockThreshold
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {product?.quantityInStock} {t(product?.unitOfMeasureString)}
                        </Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground group-hover:text-blue-600 transition-colors">
                          <ShoppingCart className="w-4 h-4" />
                          <span>{product?.quantityInStock === 0 ? "Tugagan" : "Savatga qo'shish"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            </div>
          </div>
        )}

        {activeTab === "sales_history" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("sales_history")}
            </h2>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Bugungi savdolar</span>
                </CardTitle>
                <CardDescription className="text-purple-100">Bugun amalga oshirilgan barcha savdolar</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-100 dark:bg-purple-900">
                        <TableHead className="font-semibold">Mahsulot</TableHead>
                        <TableHead className="font-semibold">Miqdor</TableHead>
                        <TableHead className="font-semibold">Narx</TableHead>
                        <TableHead className="font-semibold">Jami</TableHead>
                        <TableHead className="font-semibold">Vaqt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesHistory.map((sale, index) => (
                        <TableRow
                          key={sale.id}
                          className={`hover:bg-purple-50 dark:hover:bg-purple-900 ${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-purple-25 dark:bg-slate-750"}`}
                        >
                          <TableCell className="font-medium">{sale.product}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-purple-300">
                              {sale.quantity} {t(sale.unit)}
                            </Badge>
                          </TableCell>
                          <TableCell>{sale.price.toLocaleString()} so'm</TableCell>
                          <TableCell className="font-bold text-green-600">{sale.total.toLocaleString()} so'm</TableCell>
                          <TableCell>
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">{sale.time}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t z-50">
        <div className="flex items-center justify-around py-3">
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-4 rounded-xl transition-all ${activeTab === "products"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "hover:bg-blue-100 dark:hover:bg-blue-900"
              }`}
            onClick={() => setActiveTab("products")}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs">{t("products")}</span>
          </Button>
          <Button
            variant={activeTab === "sales_history" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-4 rounded-xl transition-all ${activeTab === "sales_history"
              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
              : "hover:bg-purple-100 dark:hover:bg-purple-900"
              }`}
            onClick={() => setActiveTab("sales_history")}
          >
            <History className="w-5 h-5" />
            <span className="text-xs">Tarix</span>
          </Button>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-slate-900 border-l shadow-2xl animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>{t("cart")}</span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-auto p-4 max-h-[calc(100vh-200px)]">
              {cart.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 space-y-4">
                  <ShoppingCart className="w-16 h-16 mx-auto opacity-50" />
                  <p>{t("cart_empty") || "Savat bo‘sh"}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card
                      key={item.id}
                      className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-lg">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.sellingPrice.toLocaleString()} so'm / {t(item.unitOfMeasureString)}
                              </p>
                              <p className="text-sm font-semibold text-green-600">
                                Jami: {(item.sellingPrice * item.quantity).toLocaleString()} so'm
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              ×
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1">
                              <Label htmlFor={`quantity-${item.id}`} className="text-xs font-medium">
                                {t("quantity") || "Miqdor"}
                              </Label>
                              <Input
                                id={`quantity-${item.id}`}
                                type="text"
                                inputMode="decimal"
                                value={quantityInputs[item.id] || ""}
                                onChange={(e) =>
                                  handleQuantityInputChange(item.id, e.target.value)
                                }
                                className="text-center border-2 focus:border-blue-400 rounded-lg mt-2"
                              />
                              <span className="text-xs text-center text-muted-foreground block mt-1">
                                {t(item.unitOfMeasureString)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-blue-900">
                <div className="flex justify-between text-xl font-bold">
                  <span>{t("total")}:</span>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {getTotalAmount().toLocaleString()} so'm
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {t("clear_cart")}
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t("checkout")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      <Toaster />
    </div>
  )
}
