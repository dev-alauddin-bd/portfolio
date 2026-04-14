import { Header } from "@/components/header";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode
}

export default function layout({ children }: LayoutProps) {
  return (
    <div >
      <Header />
      <main>{children}</main>

    </div>
  )
}
