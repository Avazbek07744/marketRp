"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

export default function PaymentPage() {
    const contactName = "Okifxon Shokirjonov";
    const phoneNumber = "+998 93 004 65 36";
    const telegramUsername = "@@Akif060";

    const handleCall = () => {
        window.open(`tel:${phoneNumber.replace(/\s/g, "")}`);
    };

    const handleTelegram = () => {
        window.open(`https://t.me/${telegramUsername.replace("@", "Azizbek_2204")}`, "_blank");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md text-center p-6 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl">To‘lov uchun bog‘laning</CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="mb-4 text-gray-700">
                        Hurmatli mijoz, to‘lovni amalga oshirish uchun quyidagi inson bilan bog‘lanishingiz kerak:
                    </p>

                    <div className="mb-4 space-y-1">
                        <p><strong>Ism:</strong> {contactName}</p>
                        <p><strong>Telefon:</strong> {phoneNumber}</p>
                        <p><strong>Telegram:</strong> {telegramUsername}</p>
                    </div>

                    <div className="flex flex-col gap-3 mt-6">
                        <Button onClick={handleCall} className="w-full">
                            <Phone className="mr-2 h-4 w-4" /> Telefon orqali bog‘lanish
                        </Button>

                        <Button onClick={handleTelegram} variant="outline" className="w-full">
                            <MessageCircle className="mr-2 h-4 w-4" /> Telegram orqali bog‘lanish
                        </Button>
                    </div>

                    <p className="mt-6 text-sm text-gray-500">
                        To‘lov amalga oshirilmaguncha buyurtma yakunlanmaydi.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
