"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, Monitor } from "lucide-react"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
        <div className="mt-auto flex flex-col gap-6 text-muted-foreground pb-8">
          <div className="rotate-90 origin-left translate-x-3 whitespace-nowrap text-[8px] font-black tracking-[0.3em] uppercase opacity-30">
            PORTFOLIO 24/25
          </div>
        </div>
      </aside>

      {/* Global Top Bar */}
      <header
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-background/80 backdrop-blur-xl py-2 sm:py-4 lg:pl-16"
      >
        <div className="container mx-auto px-6 lg:px-10 flex items-center justify-between">
          <Link href="/" className="relative w-10 h-10 md:w-12 md:h-12 hover:scale-110 transition-transform">
            <Image
              src="/logo.png"
              alt="Md Alauddin Logo"
              fill
              className="object-contain mix-blend-screen"
            />
          </Link>

          <div className="flex-grow"></div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-2">
              {navItems.slice(0, 4).map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all relative group flex items-center gap-2 hover:bg-primary/5 rounded-full"
                >
                  <span className="text-[8px] opacity-40 italic">0{i + 1}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              {mounted && (
                <Select value={theme} onValueChange={(v) => setTheme(v)}>
                  <SelectTrigger className="w-[110px] h-9 bg-transparent border-foreground/10 rounded-none text-[9px] font-black uppercase tracking-widest focus:ring-0">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>

                  <SelectContent className="rounded-none border-foreground/10 bg-background/95 backdrop-blur-xl">
                    <SelectItem value="dark" className="text-[9px] font-black uppercase tracking-widest focus:bg-primary focus:text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-zinc-950" /> DARK
                      </div>
                    </SelectItem>

                    <SelectItem value="orange" className="text-[9px] font-black uppercase tracking-widest focus:bg-primary focus:text-primary-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />ORANGE
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Hire Me CTA */}
            <Link
              href="#contact"
              className="hidden lg:flex px-6 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-500 shadow-glow"
            >
              HIRE ME
            </Link>

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
            {mounted && (
              <Select value={theme} onValueChange={(v) => {
                setTheme(v);
                setIsMenuOpen(false);
              }}>
                <SelectTrigger className="w-[180px] h-12 bg-transparent border-foreground/10 rounded-none text-[10px] font-black uppercase tracking-[0.3em] focus:ring-0">
                  <SelectValue placeholder="CHOOSE THEME" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-foreground/10 bg-background/95 backdrop-blur-xl">
                  <SelectItem value="light" className="text-[10px] font-black uppercase tracking-widest py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-white border border-black/10" /> LIGHT MODE
                    </div>
                  </SelectItem>
                  <SelectItem value="dark" className="text-[10px] font-black uppercase tracking-widest py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-zinc-950" /> DARK MODE
                    </div>
                  </SelectItem>
                  <SelectItem value="system" className="text-[10px] font-black uppercase tracking-widest py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-zinc-500" /> SYSTEM DEFAULT
                    </div>
                  </SelectItem>
                  <SelectItem value="blue" className="text-[10px] font-black uppercase tracking-widest py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-500" /> NEON BLUE
                    </div>
                  </SelectItem>
                  <SelectItem value="rose" className="text-[10px] font-black uppercase tracking-widest py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-rose-500" /> ELECTRIC ROSE
                    </div>
                  </SelectItem>
                  <SelectItem value="orange" className="text-[10px] font-black uppercase tracking-widest py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-orange-500" /> SOLAR ORANGE
                    </div>
                  </SelectItem>
                  <SelectItem value="green" className="text-[10px] font-black uppercase tracking-widest py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500" /> CYBER GREEN
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="text-[8px] font-black tracking-[0.3em] uppercase opacity-30">
              MD ALAUDDIN / PORTFOLIO 24-25
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
