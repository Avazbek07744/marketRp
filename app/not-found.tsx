"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect border-white/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-white">404</span>
          </div>
          <CardTitle className="text-white text-2xl">{t("page_not_found")}</CardTitle>
          <CardDescription className="text-white/80">
            Siz qidirayotgan sahifa topilmadi yoki mavjud emas.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/">
            <Button className="bg-white text-dark-blue hover:bg-white/90 font-semibold">
              <Home className="w-4 h-4 mr-2" />
              {t("go_home")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
