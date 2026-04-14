"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const targetElement = document.querySelector(href)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" })
      }
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-nav">
        <Link href="/" className="group flex flex-col items-center gap-8">
          <div className="w-10 h-10 bg-primary flex items-center justify-center font-black italic text-xl">A</div>
          <div className="h-24 w-px bg-border group-hover:bg-primary transition-colors"></div>
        </Link>
        <div className="mt-auto flex flex-col gap-6 text-muted-foreground">
          <button onClick={toggleTheme} className="hover:text-primary transition-colors">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="rotate-90 origin-left translate-x-3 whitespace-nowrap text-[8px] font-black tracking-[0.3em] uppercase opacity-30">
            PORTFOLIO 24/25
          </div>
        </div>
      </aside>

      {/* Global Top Bar */}
      <header
        className={`fixed top-0 right-0 w-full lg:w-[calc(100%-4rem)] z-50 transition-all duration-500 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border py-4" : "bg-transparent py-8"}`}
      >
        <div className="container mx-auto px-10 flex items-center justify-between">
          <Link href="/" className="lg:hidden">
            <div className="w-8 h-8 bg-primary flex items-center justify-center font-black italic text-lg">A</div>
          </Link>

          <div className="flex-grow"></div>

          <div className="flex items-center gap-8">
            <nav className="hidden md:flex gap-8">
              {navItems.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
            </nav>

          </div>
        </div>
      </header>

    
    </>
  )
}
