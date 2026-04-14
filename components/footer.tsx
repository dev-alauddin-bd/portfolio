"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, Heart, MapPin, Phone, ArrowUpRight, Globe, Zap } from "lucide-react"

export function Footer() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])
  const currentYear = new Date().getFullYear()

  const footerLinks: {
    title: string;
    links: {
      name: string;
      href: string;
      icon?: React.ElementType;
    }[];
  }[] = [
    {
      title: "Portfolio",
      links: [
        { name: "Main Home", href: "/" },
        { name: "About Me", href: "#about" },
        { name: "Tech Stack", href: "#skills" },
        { name: "Work Gallery", href: "#projects" },
      ]
    },
    {
      title: "Navigation",
      links: [
        { name: "Education", href: "#education" },
        { name: "Contact", href: "#contact" },
        { name: "Certifications", href: "#education" },
        { name: "Latest Blog", href: "#blog" },
      ]
    },
    {
      title: "Connect",
      links: [
        { name: "GitHub", href: "https://github.com/dev-alauddin-bd", icon: Github },
        { name: "LinkedIn", href: "https://www.linkedin.com/in/alauddin-dev", icon: Linkedin },
        { name: "Email Me", href: "mailto:muhammadalauddin24434@gmail.com", icon: Mail },
      ]
    }
  ]

  return (
    <footer className="relative bg-background pt-24 pb-12 overflow-hidden border-t border-foreground/5">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <Link href="/" className="inline-flex items-center gap-4 group">
                <div className="w-12 h-12 bg-primary flex items-center justify-center font-black italic text-2xl text-primary-foreground group-hover:rotate-12 transition-transform duration-500">
                  A
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">
                  Alauddin<span className="text-primary">.</span>
                </h2>
              </Link>
              <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
                Crafting high-performance digital experiences with modern web technologies and a focus on radical excellence.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="glass px-4 py-3 rounded-xl flex items-center gap-3 border-foreground/5">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </div>
                <span className="text-xs font-bold tracking-widest uppercase">Available for hire</span>
              </div>
              
              <div className="glass px-4 py-3 rounded-xl flex items-center gap-3 border-foreground/5">
                <Zap className="w-4 h-4 text-primary fill-primary" />
                <span className="text-xs font-bold tracking-widest uppercase">Open to collab</span>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground/60 border-b border-foreground/5 pb-2">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="group flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors inline-block"
                      >
                        {link.icon && <link.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:text-primary" />}
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

    

        {/* Bottom Metadata Bar */}
        <div className="glass mt-12 px-6 py-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-white/5 dark:bg-zinc-900/50">
           <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
             <div className="flex items-center gap-2">
               <Globe className="w-4 h-4 text-primary" />
               <span className="text-[10px] font-bold tracking-widest uppercase">Barisal, Bangladesh</span>
             </div>
             <div className="hidden md:block w-[1px] h-4 bg-foreground/10"></div>
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Local Time</span>
               <span className="text-xs font-black tabular-nums">{time || "00:00"} (GMT+6)</span>
             </div>
           </div>

           <div className="flex items-center gap-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                © {currentYear} ALL RIGHTS RESERVED
              </p>
           </div>
        </div>
        
        {/* Versioning Footer */}
        <div className="mt-8 flex justify-center opacity-30">
          <p className="text-[8px] font-mono tracking-widest uppercase flex items-center gap-2">
            Build v2.0.0-PRO <span className="w-1 h-1 rounded-full bg-foreground"></span> Stack: Next.js + React + Tailwind
          </p>
        </div>
      </div>
    </footer>
  )
}

