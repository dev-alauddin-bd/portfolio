"use client";
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Eye, Download } from "lucide-react"
import Image from "next/image"

export function Hero() {
  const handleSmoothScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="min-h-screen flex items-center pt-28 pb-12 relative overflow-hidden bg-background">

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Hero Content */}
          <div className="w-full lg:w-4/5 flex flex-col items-start gap-12 animate-slide-in-left">
            <div className="space-y-2 w-full relative">
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-4">
                Full Stack Architect / 2024-2026
              </span>
              <h1 className="text-[12vw] sm:text-[10vw] lg:text-[8vw] text-display leading-[0.85] flex flex-col translate-x-[-0.05em]">
                <span className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  MD ALAU<span className="text-primary">DDIN</span>
                </span>
                <span className="text-muted-foreground animate-fade-in-up tracking-[0.5em] uppercase text-[3vw] sm:text-[2.2vw] lg:text-[1.4vw] font-black" style={{ animationDelay: "0.2s" }}>
                  FULL STACK DEVELOPER
                </span>
              </h1>
              
              <div className="flex flex-col md:flex-row items-end gap-8 pt-8 md:pt-0">
                 <p className="text-lg md:text-xl text-muted-foreground max-w-md animate-fade-in-up leading-relaxed order-2 md:order-1" style={{ animationDelay: "0.3s" }}>
                  Crafting high-performance digital ecosystems with precision and purpose. Turning complex problems into elegant architectural solutions.
                </p>
              </div>
            </div>

            {/* Sharp CTA Buttons */}
            <div className="flex flex-wrap gap-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Button
                size="lg"
                className="group px-12 h-16 rounded-none bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all duration-500 font-black uppercase tracking-widest text-xs"
                onClick={(e) => handleSmoothScroll(e, "#projects")}
              >
                SELECTED WORKS
                <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group px-12 h-16 rounded-none border-y border-r border-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-500 font-black uppercase tracking-widest text-xs"
                asChild
              >
                <a
                  href="/resume.pdf"
                  download="Md_Alauddin_Resume.pdf"
                  className="flex items-center gap-2"
                >
                  DOWNLOAD CV
                </a>
              </Button>
            </div>

            {/* Radical Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-y border-foreground/10 w-full overflow-hidden">
               {[
                { label: "Completed Projects", value: "20+" },
                { label: "Years in Tech", value: "02" },
                { label: "Performance Score", value: "99" },
              ].map((stat, i) => (
                <div key={i} className="p-8 border-r last:border-r-0 border-foreground/10 group hover:bg-primary/5 transition-colors">
                  <h3 className="text-4xl font-black text-foreground group-hover:text-primary transition-colors tabular-nums">{stat.value}</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Radical Image Framing */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-slide-in-right relative">
             <div className="relative group overflow-hidden border border-foreground/10">
               <div className="relative w-full aspect-[4/5] sm:w-[500px] overflow-hidden transition-all duration-1000">
                <Image
                  src="/alauddin.png"
                  alt="Md Alauddin"
                  fill
                  priority
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                />
              </div>

               {/* Indicator */}
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 border border-white/10">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">SYSTEM ONLINE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
