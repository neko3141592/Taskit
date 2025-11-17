'use client'

import { usePathname } from "next/navigation"
import Footer from "@/components/home/footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // ダッシュボードページではフッターを表示しない
  if (pathname?.startsWith('/dashboard')) {
    return null
  }
  
  return <Footer />
}
