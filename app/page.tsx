"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "next-themes"
import {
  Store,
  Moon,
  Sun,
  Globe,
  LogOut,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  XCircle,
  Home,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import ProductsPage from "@/components/ProductsPage";
import EmployeesPage from "@/components/EmployeesPage";
import StatisticsPage from "@/components/StatisticsPage"
import LowStockPage from "@/components/LowStockPage";
import OutOfStockPage from "@/components/OutOfStockPage";
import Categories from "@/components/Categories"
import lord from "@/axios"

export default function StoreOwnerPage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [categories, setCategories] = useState(0)
  const [products, setProducts] = useState(0)
  const [users, setUsers] = useState(0)
  const [today, setToday] = useState(0)
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)

  const statistics = {
    weeklyData: [
      { day: "Dush", sales: 1200000 },
      { day: "Sesh", sales: 1500000 },
      { day: "Chor", sales: 980000 },
      { day: "Pay", sales: 1800000 },
      { day: "Juma", sales: 2200000 },
      { day: "Shan", sales: 2500000 },
      { day: "Yak", sales: 1900000 },
    ],

    monthlyProfitData: [
      { month: "Yan", profit: 2500000 },
      { month: "Fev", profit: 2800000 },
      { month: "Mar", profit: 3200000 },
      { month: "Apr", profit: 2900000 },
      { month: "May", profit: 3500000 },
      { month: "Iyun", profit: 4200000 },
    ],

  };

  // ShopId ni localStorage dan olish
  useEffect(() => {
    lord.get("/api/Users/GetShopId")
      .then((response) => {
        localStorage.setItem("shopId", response.data);
      })
      .catch((error) => {
        console.error("Xatolik:", error);
      });

    const savedShopId = localStorage.getItem("shopId");
    setShopId(savedShopId);
    setLoading(true)
  }, []);

  // 30 daqiqadan so‘ng localStorage ni tozalovchi setTimeout
  useEffect(() => {
    localStorage.setItem("loginTime", Date.now().toString());

    setTimeout(() => {
      localStorage.clear();
      console.log("⏳ 30 daqiqa o‘tdi. localStorage tozalandi.");
      // yoki
      router.push("/login");
    }, 30 * 60 * 1000); // 30 minut = 1800000 millisekund

  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token")
    const pathname = window.location.pathname

    if (!token && !pathname.includes("/register")) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    if (loading) {
      const Today = async () => {
        try {
          const res = await lord.post("/api/sales/statistics/today-total");
          const stats = res.data;
          setToday(stats.totalSales.toLocaleString());
        } catch (error) {
          console.error("❌ Statistikani olishda xatolik:", error);
        }
      }; Today()

      const Products = async () => {
        try {
          const res = await lord.get(`/api/product/shop/${shopId}`);
          const stats = res.data;
          setProducts(stats.length);
        } catch (error) {
          console.error("❌ Statistikani olishda xatolik:", error);
        }
      }; Products()

      const Users = async () => {
        try {
          const res = await lord.get(`/api/Users/shop/${shopId}/workers`);
          setUsers(res.data.length);
        } catch (error) {
          console.error("❌ Statistikani olishda xatolik:", error);
        }
      }; Users()

      const Categories = async () => {
        try {
          const res = await lord.get(`/api/categories/shop/${shopId}`);
          setCategories(res.data.length);
        } catch (error: unknown) {
          console.error("❌ Kategoriyalarni olishda xatolik:", error);
        }
      };

      Categories();
    }
  }, [loading, shopId])

  const handleLogout = () => {
    router.push("/login")
    localStorage.removeItem("token")
    localStorage.removeItem("shopId")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900 dark:to-teal-900 pb-20">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t("app.name")}
              </h1>
              <p className="text-xs text-muted-foreground">{t("store_owner")}</p>
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-2">
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
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t("dashboard")}
              </h2>
              <p className="text-muted-foreground">Do'koningizni boshqaring</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white overflow-hidden relative group hover:scale-105 transition-transform">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("daily_sales")}</CardTitle>
                  <DollarSign className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{today} so'm</div>
                  <p className="text-xs text-emerald-100">+12% kechaga nisbatan</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden relative group hover:scale-105 transition-transform">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("daily_profit")}</CardTitle>
                  <TrendingUp className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">350,000 so'm</div>
                  <p className="text-xs text-blue-100">+8% kechaga nisbatan</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative group hover:scale-105 transition-transform">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jami mahsulotlar</CardTitle>
                  <Package className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{products}</div>
                  <p className="text-xs text-purple-100">{categories} kategoriyada</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden relative group hover:scale-105 transition-transform">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ishchilar soni</CardTitle>
                  <Users className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users}</div>
                  {/* <p className="text-xs text-orange-100">2 faol smena</p> */}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
                onClick={() => setActiveTab("products")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 group-hover:text-emerald-600 transition-colors">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span>Mahsulotlar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Mahsulotlarni boshqarish va yangi qo'shish</p>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
                onClick={() => setActiveTab("employees")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 group-hover:text-blue-600 transition-colors">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>Ishchilar</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Ishchilarni boshqarish va yangi qo'shish</p>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
                onClick={() => setActiveTab("statistics")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 group-hover:text-purple-600 transition-colors">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <span>Statistika</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Savdo statistikasi va hisobotlar</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "products" && <ProductsPage />}

        {activeTab === "employees" && <EmployeesPage />}

        {activeTab === "statistics" && <StatisticsPage data={statistics} />}

        {activeTab === "low_stock" && <LowStockPage />}

        {activeTab === "out_of_stock" && <OutOfStockPage />}

        {activeTab === "categoriya" && <Categories />}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t z-50">
        <div className="flex items-center justify-around py-2 px-1">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 text-xs rounded-xl transition-all ${activeTab === "dashboard"
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
              : "hover:bg-emerald-100 dark:hover:bg-emerald-900"
              }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="w-4 h-4" />
            <span>Bosh</span>
          </Button>

          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 text-xs rounded-xl transition-all ${activeTab === "products"
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
              : "hover:bg-emerald-100 dark:hover:bg-emerald-900"
              }`}
            onClick={() => setActiveTab("products")}
          >
            <Package className="w-4 h-4" />
            <span>Mahsulot</span>
          </Button>

          <Button
            variant={activeTab === "employees" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 text-xs rounded-xl transition-all ${activeTab === "employees"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "hover:bg-blue-100 dark:hover:bg-blue-900"
              }`}
            onClick={() => setActiveTab("employees")}
          >
            <Users className="w-4 h-4" />
            <span>Ishchi</span>
          </Button>

          <Button
            variant={activeTab === "statistics" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 text-xs rounded-xl transition-all ${activeTab === "statistics"
              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
              : "hover:bg-purple-100 dark:hover:bg-purple-900"
              }`}
            onClick={() => setActiveTab("statistics")}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistika</span>
          </Button>

          <Button
            variant={activeTab === "low_stock" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 text-xs rounded-xl transition-all ${activeTab === "low_stock"
              ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg"
              : "hover:bg-yellow-100 dark:hover:bg-yellow-900"
              }`}
            onClick={() => setActiveTab("low_stock")}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Kam</span>
          </Button>

          <Button
            variant={activeTab === "out_of_stock" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 text-xs rounded-xl transition-all ${activeTab === "out_of_stock"
              ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
              : "hover:bg-red-100 dark:hover:bg-red-900"
              }`}
            onClick={() => setActiveTab("out_of_stock")}
          >
            <XCircle className="w-4 h-4" />
            <span>Tugagan</span>
          </Button>

          <Button
            variant={activeTab === "categoriya" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 text-xs rounded-xl transition-all ${activeTab === "category"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
              : "hover:bg-blue-100 dark:hover:bg-blue-900"
              }`}
            onClick={() => setActiveTab("categoriya")}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Category</span>
          </Button>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
