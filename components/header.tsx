"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
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


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-nav">
        <Link href="/" className="group flex flex-col items-center gap-8">
          <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-black italic text-xl">A</div>
          <div className="h-24 w-px bg-border group-hover:bg-primary transition-colors"></div>
        </Link>
        <div className="mt-auto flex flex-col gap-6 text-muted-foreground">
          <button onClick={toggleTheme} className="hover:text-primary transition-colors">
            {mounted ? (
              theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
          <div className="rotate-90 origin-left translate-x-3 whitespace-nowrap text-[8px] font-black tracking-[0.3em] uppercase opacity-30">
            PORTFOLIO 24/25
          </div>
        </div>
      </aside>

      {/* Global Top Bar */}
      <header
        className="fixed top-0 right-0 w-full lg:w-[calc(100%-4rem)] z-50 transition-all duration-500 bg-background/80 backdrop-blur-xl border-b border-border py-2 sm:py-4"
      >
        <div className="container mx-auto px-6 lg:px-10 flex items-center justify-between">
          <Link href="/" className="lg:hidden">
            <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-black italic text-lg hover:rotate-12 transition-transform">A</div>
          </Link>

          <div className="flex-grow"></div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8">
              {navItems.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 p-6 text-center">
           <button 
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-10 p-2 border border-foreground/10 hover:bg-primary hover:text-primary-foreground transition-all"
           >
             <X className="w-6 h-6" />
           </button>

           <div className="flex flex-col gap-6 w-full">
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl sm:text-3xl font-black uppercase tracking-tighter hover:text-primary transition-all hover:italic"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {item.label}
                </Link>
              ))}
           </div>

           <div className="mt-12 flex flex-col items-center gap-6 pt-12 border-t border-foreground/10 w-full">
              <button 
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-4 text-xs font-bold tracking-[0.3em] uppercase"
              >
                {mounted ? (
                  theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5" />
                )}
                SWAP THEME
              </button>
              <div className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30">
                MD ALAUDDIN / PORTFOLIO 24-25
              </div>
           </div>
        </div>
      </div>
    </>
  )
}
