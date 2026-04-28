"use client";
import { Button } from "@/components/ui/button"
import { ArrowRight, Download, MapPin, Code2, Globe, Cpu } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center pt-20 md:pt-28 pb-12 relative overflow-hidden bg-background">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 mb-16 md:mb-32 items-start lg:items-center">
          {/* Hero Content */}
          <div className="w-full lg:w-3/5 flex flex-col items-start gap-10 animate-slide-in-left">
            <div className="space-y-6 w-full relative">
              <div className="flex items-center gap-4 animate-fade-in-up">
                <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block">
                  Full Stack Architect / 2024-2026
                </span>
                <div className="h-px flex-grow bg-primary/20" />
              </div>
              
              <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[7.5vw] text-display leading-[0.85] flex flex-col translate-x-[-0.05em]">
                <span className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  MD ALAU<span className="text-primary">DDIN</span>
                </span>
                <span className="text-muted-foreground animate-fade-in-up tracking-[0.2em] uppercase text-xs sm:text-sm md:text-base font-black mt-4 flex flex-wrap gap-4 items-center" style={{ animationDelay: "0.2s" }}>
                  <span>FULL STACK DEVELOPER</span>
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  <span>BACKEND DEVELOPER</span>
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  <span>MERN SPECIALIST</span>
                </span>
              </h1>
              
               <div className="pt-4">
                 <p className="text-base md:text-xl text-muted-foreground max-w-xl animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.3s" }}>
                  I build high-performance web applications that help businesses grow and users succeed. By combining technical precision with a passion for clean, scalable code, I turn complex ideas into powerful digital realities that make a real impact.
                </p>
              </div>

              {/* Top Skills Row - Radical Divider Style */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 py-6 border-y border-foreground/10 animate-fade-in-up w-full" style={{ animationDelay: "0.35s" }}>
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-primary uppercase tracking-[0.3em] mb-1">Architecture</span>
                  <span className="text-sm md:text-base font-black uppercase italic tracking-tighter">Full Stack / AI</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-foreground/20" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-primary uppercase tracking-[0.3em] mb-1">Backend</span>
                  <span className="text-sm md:text-base font-black uppercase italic tracking-tighter">NestJS / Node</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-foreground/20" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-primary uppercase tracking-[0.3em] mb-1">Frontend</span>
                  <span className="text-sm md:text-base font-black uppercase italic tracking-tighter">Next.js / React</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up w-full sm:w-auto" style={{ animationDelay: "0.4s" }}>
              <Button
                size="lg"
                className="group px-8 sm:px-12 h-12 sm:h-16 rounded-none bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all duration-500 font-black uppercase tracking-widest text-[10px] sm:text-xs w-full sm:w-auto shadow-glow"
                asChild
              >
                <a href="#projects">
                  VIEW MY WORK
                  <ArrowRight className="ml-4 w-4 h-4 sm:w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group px-8 sm:px-12 h-12 sm:h-16 rounded-none border border-foreground hover:bg-foreground/5 transition-all duration-500 font-black uppercase tracking-widest text-[10px] sm:text-xs w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://drive.google.com/uc?export=download&id=1vTk2C0Qmg5bdU9Amz2zvkIF-jSvZHZM4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  GET MY RESUME
                  <Download className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </a>
              </Button>
            </div>

            {/* Radical Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-y border-foreground/10 w-full overflow-hidden">
                {[
                 { label: "High-End Projects", value: "20+" },
                 { label: "Active Experience", value: "02+" },
                 { label: "Success Rate", value: "100%" },
               ].map((stat, i) => (
                 <div key={i} className="p-8 border-r last:border-r-0 border-foreground/10 group hover:bg-primary/5 transition-colors">
                   <h3 className="text-4xl font-black text-foreground group-hover:text-primary transition-colors tabular-nums">{stat.value}</h3>
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-2">{stat.label}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Radical Image Framing */}
          <div className="w-full lg:w-2/5 flex justify-center lg:justify-end animate-slide-in-right relative pt-12 lg:pt-0">
             <div className="relative group">


                <div className="relative w-[280px] sm:w-[320px] lg:w-[380px] aspect-[4/5] overflow-hidden bg-muted border border-foreground/10">
                  <Image
                    src="/alauddin.png"
                    alt="Md Alauddin"
                    fill
                    priority
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                  />
                  
                  {/* Indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 border border-foreground/10">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                      <p className="text-[8px] font-black uppercase tracking-widest">READY FOR HIRE</p>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-16 top-1/2 -translate-y-1/2 animate-float hidden sm:block [animation-delay:1s]">
                  <div className="bg-background/80 backdrop-blur-md p-4 border border-foreground/10 flex flex-col gap-1 shadow-glow">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Tech Stack</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">NEXT / NEST / TS</p>
                  </div>
                </div>

                <div className="absolute -left-12 bottom-1/4 animate-float hidden sm:block [animation-delay:2s]">
                  <div className="bg-background/80 backdrop-blur-md p-4 border border-foreground/10 flex flex-col gap-2 shadow-glow">
                    <div className="flex items-center gap-2">
                       <MapPin className="w-3 h-3 text-primary" />
                       <p className="text-[10px] font-black uppercase tracking-widest">BARISAL, BD</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
