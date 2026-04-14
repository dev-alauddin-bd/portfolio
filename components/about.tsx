"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Zap, Code, Users, Award } from "lucide-react";

// Key facts data - Updated to remove 'Go'
const keyFacts = [
  {
    icon: Zap,
    title: "Full-Stack Focus",
    // Removed Go from the description
    description: "Expertise in both frontend (React, Next.js) and backend (Node.js, Express) development, delivering cohesive solutions.",
    aosDelay: "100",
  },
  {
    icon: Code,
    title: "Clean Code Enthusiast",
    description: "Committed to writing scalable, maintainable, and efficient code with a strong emphasis on best practices and testing.",
    aosDelay: "200",
  },
  {
    icon: Users,
    title: "Collaborative Spirit",
    description: "Thrive in team settings, actively participating in brainstorming, code reviews, and cross-functional problem-solving.",
    aosDelay: "300",
  },
  {
    icon: Award,
    title: "Continuous Learner",
    description: "Always exploring new technologies and frameworks to stay updated and implement cutting-edge solutions in projects.",
    aosDelay: "400",
  },
];

export function About() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
    AOS.refresh();
  }, []);

  return (
    <section id="about" className="py-32 relative overflow-hidden bg-background">
      {/* Background Grid - Minimalist */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 mb-32 items-end">
           <div className="lg:w-1/2">
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">/ PHILOSOPHY</span>
              <h2 className="text-[12vw] sm:text-[10vw] lg:text-[7vw] text-display leading-none">
                BUILDING <br />
                FOR THE <br />
                <span className="text-primary">FUTURE.</span>
              </h2>
           </div>
           <div className="lg:w-1/2 max-w-xl pb-4">
              <p className="text-2xl font-medium leading-normal mb-8 border-l-4 border-primary pl-10 py-2">
                I'm a digital architect specializing in high-performance full-stack ecosystems.
              </p>
              <p className="text-muted-foreground leading-relaxed pl-10">
                My journey is defined by a relentless pursuit of technical excellence. I don't just build websites; I engineer scalable, efficient digital solutions that balance powerful logic with intuitive user interaction.
              </p>
           </div>
        </div>

        {/* Bento Grid 2.0 */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-8">
           {/* Long Stats Box */}
           <div className="md:col-span-2 lg:col-span-4 h-64 bg-foreground p-8 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 translate-x-10 -translate-y-10 group-hover:translate-x-5 transition-transform duration-700"></div>
              <h4 className="text-background font-black text-6xl italic leading-none tabular-nums">02+</h4>
              <p className="text-background/50 text-[10px] font-bold uppercase tracking-[0.3em]">Years of engineering complexity</p>
           </div>

           {/* Small Box 1 */}
           <div className="md:col-span-2 lg:col-span-3 h-64 border-sharp p-8 flex flex-col justify-between group hover:border-primary transition-colors">
              <Zap className="w-8 h-8 text-primary group-hover:scale-120 transition-transform" />
              <div className="space-y-2">
                 <h4 className="font-black text-xl">FULL-STACK</h4>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-loose">End-to-end architecture from DB to UI</p>
              </div>
           </div>

           {/* Wide Narrative Box */}
           <div className="md:col-span-4 lg:col-span-5 h-64 bg-muted/30 p-8 flex flex-col justify-center border-sharp relative">
              <div className="absolute top-8 right-8 w-2 h-2 bg-primary rounded-full animate-ping"></div>
              <p className="text-xl font-bold leading-relaxed max-w-xs">
                Committed to writing scalable, maintainable code that defines standard.
              </p>
           </div>

           {/* Small Box 2 */}
           <div className="md:col-span-2 lg:col-span-3 h-64 border-sharp p-8 flex flex-col justify-between group hover:border-primary transition-colors">
              <Users className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
              <div className="space-y-2">
                 <h4 className="font-black text-xl">COLLABORATION</h4>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Bridging technical & creative gaps</p>
              </div>
           </div>

           {/* Tall Image/Illustration Box Alternative */}
           <div className="md:col-span-2 lg:col-span-6 h-64 bg-primary p-8 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full text-black/10 text-9xl font-black select-none pointer-events-none flex items-center justify-center translate-x-1/4">
                 CODE
              </div>
              <p className="text-primary-foreground font-black text-2xl uppercase tracking-tighter leading-none italic z-10">Performance is my primary concern.</p>
           </div>

           {/* Final Stats Box */}
           <div className="md:col-span-4 lg:col-span-3 h-64 border-sharp p-8 flex flex-col justify-between group hover:bg-foreground hover:text-background transition-all">
              <Award className="w-8 h-8 text-primary" />
              <div>
                 <h4 className="font-black text-5xl tabular-nums">20+</h4>
                 <p className="text-[10px] opacity-50 uppercase tracking-widest mt-2">Projects deployed globally</p>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}