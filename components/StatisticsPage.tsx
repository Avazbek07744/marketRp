"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { BarChart3, DollarSign, Target, TrendingUp, } from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts"

interface weekly {
    day: string,
    sales: number,
}
interface category {
    name: string, value: number, color: string,

}
interface monthlyProfit {
    month: string,
    profit: number,
}
interface stock {
    status: string,
    count: number,
    color: string,
}

interface ProductType {
    weeklyData: weekly[],
    categoryData: category[],
    monthlyProfitData: monthlyProfit[],
    stockData: stock[],
}

interface StatisticsPageProps {
    data: ProductType;
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ data }) => {
    const { t, language, setLanguage } = useLanguage()

    

    return (
        <>
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {t("statistics")}
                    </h2>
                    <p className="text-muted-foreground">Savdo statistikasi va hisobotlar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Target className="w-5 h-5" />
                                <span>Kunlik savdo</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">1,250,000 so'm</div>
                            <p className="text-sm text-green-100">Bugungi savdo hajmi</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5" />
                                <span>Haftalik savdo</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">8,750,000 so'm</div>
                            <p className="text-sm text-blue-100">Oxirgi 7 kun</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <DollarSign className="w-5 h-5" />
                                <span>Oylik savdo</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">35,200,000 so'm</div>
                            <p className="text-sm text-purple-100">Joriy oy</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <BarChart3 className="w-5 h-5" />
                                <span>Eng ko'p sotilganlar</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Olma</span>
                                    <span>150 kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sut</span>
                                    <span>80 litr</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Coca Cola</span>
                                    <span>120 dona</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                            <CardTitle>Haftalik savdo grafigi</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} so'm`, "Savdo"]} />
                                        <Bar dataKey="sales" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                            <CardTitle>Kategoriya bo'yicha savdo</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.categoryData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data.categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                            <CardTitle>Oylik foyda grafigi</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.monthlyProfitData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} so'm`, "Foyda"]} />
                                        <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900">
                        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                            <CardTitle>Mahsulotlar holati</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.stockData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="status" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8">
                                            {data.stockData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default StatisticsPage
