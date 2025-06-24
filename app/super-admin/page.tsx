"use client"

import { useEffect, useState } from "react"
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
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "next-themes"
import {
  Store,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  Search,
  Moon,
  Sun,
  Globe,
  LogOut,
  BarChart3,
  DollarSign,
  TrendingUp,
  Crown,
  Building2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { DialogClose } from "@radix-ui/react-dialog"
import lord from "@/axios"
import Cookies from "js-cookie";

interface StoreType {
  id: string;
  name: string;
  location: string;
  ownerId: string;
  ownerFullName: string;
  ownerPhoneNumber: string;
  ownerUsername: string;
  createdDate: string;
  updatedDate: string;
  nextPaymentDate: string;
  status: number;
  statusString: "Active" | "Blocked" | string;
  premium?: boolean;
  revenue?: number;
}

export default function SuperAdminPage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("stores")
  const [stores, setStores] = useState<StoreType[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [refetchCount, setRefetchCount] = useState(0);
  const [activeStores, setActiveStores] = useState(0)
  const [blockStores, setBlockStores] = useState(0)
  const [persent, setPersent] = useState(0)


  // 30 daqiqadan so‘ng cookie ni tozalovchi setTimeout
  useEffect(() => {
    Cookies.set("loginTime", Date.now().toString());

    setTimeout(() => {
      Cookies.remove("token");
      Cookies.remove("loginTime");
      console.log("⏳ 30 daqiqa o‘tdi. Cookie tozalandi.");
      router.push("/login");
    }, 30 * 60 * 1000); // 30 minut = 1800000 millisekund

  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const pathname = window.location.pathname;

    if (!token && !pathname.includes("/register")) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    lord.get(`/api/shop`)
      .then((response) => {
        setStores(response.data);
      })
      .catch((error:any) => {
        toast({
          title: "❌ Xatolik",
          description: `${error.Message} xatolik yuz berdi`,
          className: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950",
        });
      });
  }, [refetchCount, activeTab]);

  useEffect(() => {
    if (searchTerm === "") setRefetchCount(prev => prev + 1);
    const filtered = stores.filter((v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setStores(filtered);
  }, [searchTerm]);

  useEffect(() => {
    const fetchStoreActiveStatistics = async () => {
      try {
        const res = await lord.get("/api/shop/statistics/active-count");
        const stats = res.data;

        const percentage = (stats.active / stats.total) * 100;
        percentage.toFixed(1)

        setActiveStores(stats);
        setPersent(percentage);
      } catch (error:any) {
        toast({
          title: "❌ Xatolik",
          description: `${error.Message} xatolik yuz berdi`,
          className: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950",
        });
      }
    }; fetchStoreActiveStatistics();

    const fetchStoreBlockedStatistics = async () => {
      try {
        const res = await lord.get("/api/shop/statistics/awaiting-payment-count");
        const stats = res.data;

        setBlockStores(stats);
      } catch (error:any) {
        toast({
          title: "❌ Xatolik",
          description: `${error.Message} xatolik yuz berdi`,
          className: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950",
        });
      }
    }; fetchStoreBlockedStatistics();
  }, [stores]);


  const handleLogout = () => {
    router.push("/login")
    localStorage.removeItem("token")
  }

  const addStore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const data = {
      name: form.store_name.value,
      location: form.store_address.value,
      ownerFullName: form.owner_name.value,
      ownerPhoneNumber: form.owner_phone.value,
      ownerUsername: form.store_username.value,
      ownerPassword: form.store_password.value,
      nextPaymentDate: new Date(form.payment_date.value).toISOString(),
    };

    try {
      const res = await lord.post("/api/shop", data);

      toast({
        title: "🎉 Muvaffaqiyatli",
        description: `Yangi do'kon qo'shildi: ${data.name}`,
        className: "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950",
      });
    } catch (error) {
      toast({
        title: "❌ Xatolik",
        description: "Do'kon qo'shishda xatolik yuz berdi",
        className: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950",
      });
    }
  };

  const deleteStore = async (storeId: string) => {
    try {
      const res = await lord.delete(`/api/shop/${storeId}`);
      toast({
        title: "🗑️ O‘chirildi",
        description: `${storeId} o‘chirildi`,
        className: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950",
      });
    } catch (error) {
      toast({
        title: "❌ Xatolik",
        description: "O‘chirish vaqtida xatolik yuz berdi",
        className: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950",
      });
    } finally {
      setRefetchCount(prev => prev + 1);
    }
  };

  const editStore = async (
    storeId: string,
    formData: {
      name: string;
      location: string;
      nextPaymentDate: string;
    }
  ) => {
    try {
      const res = await lord.put(`/api/shop/${storeId}`, formData);

      toast({
        title: "📝 Yangilandi",
        description: `${formData.name} ma'lumotlari yangilandi`,
        className: "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950",
      });
    } catch (error) {
      toast({
        title: "❌ Xatolik",
        description: "Tahrirlash vaqtida xatolik yuz berdi",
        className: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950",
      });
    } finally {
      setRefetchCount(prev => prev + 1);
    }
  };

  const handleStoreAction = async (action: number, storeId: string) => {
    const messages = {
      block: `🚫 Do'kon bloklandi`,
      unblock: `✅ Do'kon blokdan chiqarildi`,
    };

    const data = { status: action }

    try {
      const url = lord.patch(`/api/shop/${storeId}/status`, data);

      toast({
        title: "✅ Muvaffaqiyatli",
        description: messages[action === 1 ? "unblock" : "block"],
        className: "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950",
      });


    } catch (error: unknown) {
      toast({
        title: "❌ Xatolik",
        description: "Amalni bajarishda xatolik yuz berdi",
        className: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">{t("active")}</Badge>
        )
      case "Blocked":
        return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">{t("blocked")}</Badge>
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0">{t("inactive")}</Badge>
        )
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">{t("paid")}</Badge>
      case "Blocked":
        return <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">{t("unpaid")}</Badge>
      default:
        return <Badge className="bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0">{t("unpaid")}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 pb-20">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("app.name")}
              </h1>
              <p className="text-xs text-muted-foreground">{t("super_admin")}</p>
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
        {activeTab === "stores" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("stores")}
              </h2>
              <p className="text-muted-foreground">Barcha do'konlarni boshqaring</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 h-12 rounded-xl border-2 focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jami do'konlar</CardTitle>
                  <Store className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stores.length}</div>
                  <p className="text-xs text-blue-100">+2 oxirgi oyda</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faol do'konlar</CardTitle>
                  <TrendingUp className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeStores}</div>
                  <p className="text-xs text-green-100">{persent}% faollik</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Oylik daromad</CardTitle>
                  <DollarSign className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$12,450</div>
                  <p className="text-xs text-purple-100">+8% o'tgan oyga nisbatan</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">To'lov kutilmoqda</CardTitle>
                  <BarChart3 className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{blockStores}</div>
                  <p className="text-xs text-orange-100">${30 * blockStores} Jami</p>
                </CardContent>
              </Card>
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.length > 0 && stores.map((store) => (
                <Card
                  key={store.id}
                  className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900 overflow-hidden relative group hover:shadow-2xl transition-all duration-300"
                >
                  {store.premium && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  )}

                  <div
                    className={`h-2 bg-gradient-to-r ${store.statusString === "Active" ? "from-green-400 to-emerald-400" : "from-red-400 to-pink-400"}`}
                  />

                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      <span>{store.name}</span>
                    </CardTitle>
                    <CardDescription>{store.location}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Egasi:</span>
                        <span className="font-medium">{store.ownerFullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Telefon:</span>
                        <span className="font-medium">{store.ownerPhoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Daromad:</span>
                        <span className="font-bold text-green-600">
                          {/* {mounted ? store.revenue.toLocaleString() : store.revenue} so'm */}
                          {store.revenue?.toLocaleString()} so'm
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      {getPaymentStatusBadge(store.statusString)}
                      {getStatusBadge(store.statusString)}
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      {/* Tahrirlash dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 hover:bg-blue-50">
                            <Edit className="w-4 h-4 mr-1" />
                            Tahrirlash
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Do'konni tahrirlash</DialogTitle>
                            <DialogDescription>Do'kon ma'lumotlarini o'zgartiring</DialogDescription>
                          </DialogHeader>

                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const form = e.currentTarget;
                              const elements = form.elements as typeof form.elements & {
                                name: HTMLInputElement;
                                location: HTMLInputElement;
                                nextPaymentDate: HTMLInputElement;
                              };

                              const formData = {
                                name: elements.name.value,
                                location: elements.location.value,
                                nextPaymentDate: new Date(elements.nextPaymentDate.value).toISOString(),
                              };

                              editStore(store.id, formData);
                            }}

                            className="grid gap-4 py-4"
                          >
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                {t("name")}
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                defaultValue={store.name}
                                className="col-span-3"
                                placeholder="Do'kon nomi"
                              />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="location" className="text-right">
                                {t("address")}
                              </Label>
                              <Input
                                id="location"
                                name="location"
                                defaultValue={store.location}
                                className="col-span-3"
                                placeholder="Do'kon manzili"
                              />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="nextPaymentDate" className="text-right">
                                {t("payment_date")}
                              </Label>
                              <Input
                                id="nextPaymentDate"
                                name="nextPaymentDate"
                                type="date"
                                defaultValue={store.nextPaymentDate?.slice(0, 10)}
                                className="col-span-3"
                              />
                            </div>

                            {/* Saqlash tugmasi */}
                            <DialogFooter>
                              <Button type="submit">{t("save")}</Button>
                            </DialogFooter>
                          </form>

                        </DialogContent>
                      </Dialog>

                      {/* Block/unblock dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              store?.statusString === "blocked"
                                ? "hover:bg-green-50"
                                : "hover:bg-red-50"
                            }
                          >
                            {store?.statusString === "Blocked" ? (
                              <ShieldOff className="w-4 h-4" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {store?.statusString === "blocked" ? "Blokdan chiqarish" : "Bloklash"}
                            </DialogTitle>
                            <DialogDescription>
                              {store?.statusString === "Blocked"
                                ? "Do'konni blokdan chiqarishni xohlaysizmi?"
                                : "Do'konni bloklashni xohlaysizmi?"}
                            </DialogDescription>
                          </DialogHeader>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">{t("cancel")}</Button>
                            </DialogClose>

                            <Button
                              variant={
                                store?.statusString === "Blocked" ? "default" : "destructive"
                              }
                              onClick={() =>
                                handleStoreAction(
                                  store?.statusString === "Blocked" ? 1 : 4,
                                  store.id
                                )
                              }
                            >
                              {store?.statusString === "Blocked" ? t("unblock") : t("block")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>


                      {/* O‘chirish dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Do'konni o'chirish</DialogTitle>
                            <DialogDescription>
                              Bu amalni qaytarib bo'lmaydi. Do'kon va unga tegishli barcha ma'lumotlar o'chiriladi.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">{t("cancel")}</Button>
                            <Button variant="destructive" onClick={() => deleteStore(store.id)}>
                              {t("delete")}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        )}

        {activeTab === "add_store" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {t("add_store")}
              </h2>
              <p className="text-muted-foreground">Yangi do'kon qo'shish</p>
            </div>

            <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Yangi do'kon qo'shish</span>
                </CardTitle>
                <CardDescription className="text-green-100">Yangi do'kon ma'lumotlarini kiriting</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-6" onSubmit={addStore}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="store_name" className="font-medium">
                        {t("name")}
                      </Label>
                      <Input
                        id="store_name"
                        name="store_name"
                        placeholder="Do'kon nomi"
                        className="h-12 rounded-lg border-2 focus:border-green-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store_address" className="font-medium">
                        {t("address")}
                      </Label>
                      <Input
                        id="store_address"
                        name="store_address"
                        placeholder="Do'kon manzili"
                        className="h-12 rounded-lg border-2 focus:border-green-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner_name" className="font-medium">
                        {t("owner")}
                      </Label>
                      <Input
                        id="owner_name"
                        name="owner_name"
                        placeholder="Egasi ismi"
                        className="h-12 rounded-lg border-2 focus:border-green-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner_phone" className="font-medium">
                        {t("phone")}
                      </Label>
                      <Input
                        id="owner_phone"
                        name="owner_phone"
                        placeholder="+998901234567"
                        className="h-12 rounded-lg border-2 focus:border-green-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store_username" className="font-medium">
                        {t("username")}
                      </Label>
                      <Input
                        id="store_username"
                        name="store_username"
                        placeholder="Login"
                        className="h-12 rounded-lg border-2 focus:border-green-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store_password" className="font-medium">
                        {t("password")}
                      </Label>
                      <Input
                        id="store_password"
                        name="store_password"
                        type="password"
                        placeholder="Parol"
                        className="h-12 rounded-lg border-2 focus:border-green-400"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="payment_date" className="font-medium">
                        {t("payment_date")}
                      </Label>
                      <Input
                        id="payment_date"
                        name="payment_date"
                        type="date"
                        className="h-12 rounded-lg border-2 focus:border-green-400"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg rounded-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Do'kon qo'shish
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t z-50">
        <div className="flex items-center justify-around py-3">
          <Button
            variant={activeTab === "stores" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-4 rounded-xl transition-all ${activeTab === "stores"
              ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
              : "hover:bg-purple-100 dark:hover:bg-purple-900"
              }`}
            onClick={() => setActiveTab("stores")}
          >
            <Store className="w-5 h-5" />
            <span className="text-xs">{t("stores")}</span>
          </Button>
          <Button
            variant={activeTab === "add_store" ? "default" : "ghost"}
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-4 rounded-xl transition-all ${activeTab === "add_store"
              ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg"
              : "hover:bg-green-100 dark:hover:bg-green-900"
              }`}
            onClick={() => setActiveTab("add_store")}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Qo'shish</span>
          </Button>
        </div>
      </nav>

      <Toaster />
    </div>
  )
}
