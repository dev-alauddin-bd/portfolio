import { Header } from "@/components/header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode
}

export default function layout({ children }: LayoutProps) {
  return (
    <div >
      <Header />
      <main>{children}</main>
      <ScrollToTop />
    </div>
  )
}
