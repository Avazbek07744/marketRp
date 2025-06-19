"use client"
import React, { useEffect } from 'react'
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
    Zap,
    Users,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useLanguage } from "./language-provider"
import { useState } from "react"

interface ShopIdType {
    id: string;
}

interface dataType {
    fullName: string;
    phoneNumber: string;
    username: string;
    password: string;
}

const EmployeesPage: React.FC<ShopIdType> = ({ id }) => {
    const { t } = useLanguage();
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${baseUrl}/api/Users/all`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("xatolik yuz berdi");
                return res.json();
            })
            .then((data) => setEmployees(data))
            .catch((err) => console.error("Xatolik:", err));
    }, [baseUrl]);
    function Validate(arg: dataType): boolean {
        if (arg.fullName.length < 3) {
            alert("Full name kamida 3ta belgidan iborat bo‘lishi kerak");
            return false;
        }

        if (!/^\+998\d{9}$/.test(arg.phoneNumber)) {
            alert("Telefon raqam +998 bilan boshlanishi va 12ta belgidan iborat bo‘lishi kerak");
            return false;
        }

        if (!/^[a-zA-Z0-9._-]{4,}$/.test(arg.username)) {
            alert("Username kamida 4ta belgi va faqat harf, raqam, `.` `-` `_` dan iborat bo‘lishi kerak");
            return false;
        }

        if (arg.password.length < 6) {
            alert("Parol kamida 6 ta belgidan iborat bo‘lishi kerak");
            return false;
        }

        return true; // ✅ Hammasi yaxshi bo‘lsa
    }


    const handleAddEmployee = async (e: React.FormEvent<HTMLFormElement>,) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !id) return console.warn("Token yoki shopId yo‘q");

        const formData = new FormData(e.currentTarget);
        const entries = Object.fromEntries(formData.entries());

        const data = {
            fullName: entries.fullName,
            phoneNumber: entries.phoneNumber,
            username: entries.username,
            password: entries.password,
            role: 2,
            shopId: "01978759-b346-71b2-8ad3-f014c446a525",
        };

        console.log("Yuborilayotgan DTO:", data);

        try {
            const response = await fetch(`${baseUrl}/api/Users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ dto: data }),
            });

            const resData = await response.json();

            if (!response.ok) {
                toast({
                    title: "❌ Xatolik",
                    description: resData.Message || "Qo‘shishda xatolik",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "✅ Ishchi qo‘shildi",
                description: `👤 ${data.fullName} ishchi qo‘shildi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error) {
            console.error("Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Serverga murojaat qilishda xatolik yuz berdi",
                variant: "destructive",
            });
        }
    };

    const handleEditEmployee = async (
        e: React.FormEvent<HTMLFormElement>,
        itemId: string | number,
    ) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !id) return console.warn("Token yoki shopId yo‘q");

        const formData = new FormData(e.currentTarget);
        const entries = Object.fromEntries(formData.entries());

        const data = {
            fullName: String(entries.fullName).trim(),
            username: String(entries.username).trim(),
            password: String(entries.password || "").trim(),
            role: "Employee",
            shopId: id,
            isActive: true,
        };

        console.log("Yuborilayotgan DTO (edit):", data);

        try {
            const response = await fetch(`${baseUrl}/api/Users/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const resData = await response.json();

            if (!response.ok) {
                toast({
                    title: "❌ Xatolik",
                    description: resData.Message || "Tahrirlashda xatolik",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "✅ Yangilandi",
                description: `✏️ ${data.fullName} ishchi yangilandi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error) {
            console.error("Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Serverga murojaat qilishda xatolik yuz berdi",
                variant: "destructive",
            });
        }
    };

    const handleDeleteEmployee = async (
        itemId: string | number,
    ) => {
        const token = localStorage.getItem("token");
        if (!token) return console.warn("Token yo‘q");

        try {
            const response = await fetch(`${baseUrl}/api/Users/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resData = await response.json();

            if (!response.ok) {
                toast({
                    title: "❌ Xatolik",
                    description: resData.Message || "O‘chirishda xatolik",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "✅ O‘chirildi",
                description: `🗑️ ${itemId} ishchi o‘chirildi`,
                className: "border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950",
            });
        } catch (error) {
            console.error("Xatolik:", error);
            toast({
                title: "Xatolik",
                description: "Serverga murojaat qilishda xatolik yuz berdi",
                variant: "destructive",
            });
        }
    };


    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {t("employees")}
                    </h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
                                <Plus className="w-4 h-4 mr-2" />
                                {t("add_employee")}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Yangi ishchi qo'shish</DialogTitle>
                                <DialogDescription>Yangi ishchi ma'lumotlarini kiriting</DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={(e) => handleAddEmployee(e)}
                                className="grid gap-4 py-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="employee_name">Ism familiya</Label>
                                    <Input
                                        id="employee_name"
                                        name="fullName"
                                        placeholder="Ism familiya"
                                        className="border-2 focus:border-blue-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employee_phone">{t("phone")}</Label>
                                    <Input
                                        id="employee_phone"
                                        name="phoneNumber"
                                        // placeholder="+998901234567"
                                        className="border-2 focus:border-blue-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employee_username">{t("username")}</Label>
                                    <Input
                                        id="employee_username"
                                        name="username"
                                        placeholder="Login"
                                        className="border-2 focus:border-blue-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employee_password">{t("password")}</Label>
                                    <Input
                                        id="employee_password"
                                        name="password"
                                        type="password"
                                        placeholder="Parol"
                                        className="border-2 focus:border-blue-400"
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-500 to-purple-500"
                                    >
                                        {t("add")}
                                    </Button>
                                </DialogFooter>
                            </form>

                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {employees.length > 0 && employees.map((employee) => (
                        <Card
                            key={employee.id}
                            className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 overflow-hidden relative"
                        >
                            {employee.isActive && (
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white border-0">
                                        <Zap className="w-3 h-3 mr-1" />
                                        Faol
                                    </Badge>
                                </div>
                            )}
                            <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-400" />
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <span>{employee.fullName}</span>
                                </CardTitle>
                                <CardDescription>{employee.roleString}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Telefon:</span>
                                        <span className="font-medium">{employee.phoneNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Login:</span>
                                        <span className="font-medium">{employee.username}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Samaradorlik:</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                                                    style={{ width: `${employee.performance}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-green-600">{employee.performance}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex-1 hover:bg-blue-50 border-blue-200">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Tahrirlash
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Ishchini tahrirlash</DialogTitle>
                                                <DialogDescription>Ishchi ma'lumotlarini o'zgartiring</DialogDescription>
                                            </DialogHeader>

                                            <form onSubmit={(e) => handleEditEmployee(e, employee.id)} className="grid gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit_employee_name">Ism familiya</Label>
                                                    <Input
                                                        id="edit_employee_name"
                                                        name="fullName"
                                                        defaultValue={employee.fullName}
                                                        className="border-2 focus:border-blue-400"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="edit_employee_phone">{t("phone")}</Label>
                                                    <Input
                                                        id="edit_employee_phone"
                                                        name="phoneNumber"
                                                        defaultValue={employee.phoneNumber}
                                                        className="border-2 focus:border-blue-400"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="edit_employee_username">{t("username")}</Label>
                                                    <Input
                                                        id="edit_employee_username"
                                                        name="username"
                                                        defaultValue={employee.username}
                                                        className="border-2 focus:border-blue-400"
                                                    />
                                                </div>

                                                <DialogFooter>
                                                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500">
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
                                                <DialogTitle>Ishchini o'chirish</DialogTitle>
                                                <DialogDescription>
                                                    Bu amalni qaytarib bo'lmaydi. Ishchi butunlay o'chiriladi.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline">{t("cancel")}</Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleDeleteEmployee(employee.id)}
                                                >
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
            <Toaster />
        </>
    )
}

export default EmployeesPage
