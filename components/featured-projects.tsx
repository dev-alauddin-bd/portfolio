"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Code, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AOS from "aos";
import "aos/dist/aos.css";

export function FeaturedProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: false, easing: "ease-in-out" });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/projects.json");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchProjects();
  }, []);

  const renderProjectCard = (project: any, index: number) => (
    <div
      key={project.id}
      className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center group relative py-10 md:py-20 border-b border-foreground/10 last:border-none"
    >
      {/* Large Project Number */}
      <div className="absolute top-10 left-0 text-[100px] sm:text-[150px] lg:text-[15vw] font-black text-foreground/5 pointer-events-none select-none italic translate-x-[-0.2em]">
        0{index + 1}
      </div>

      {/* Immersive Thumbnail */}
      <div className={`w-full lg:w-3/5 relative aspect-[16/10] overflow-hidden border border-foreground/10 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
        <Image
          src={project.thumnail || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-all duration-1000 group-hover:scale-105"
        />

        {/* Category Overlay */}
        <div className="absolute top-0 right-0 p-px bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-500">
          <Badge className="bg-primary text-primary-foreground rounded-none px-4 py-2 font-black uppercase tracking-widest text-[10px]">
            {project.category}
          </Badge>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 h-1/3 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex gap-4">
            <Button size="icon" variant="outline" className="rounded-none border-white/20 text-white hover:bg-primary hover:text-black transition-colors" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-5 h-5" /></a>
            </Button>
            <Button size="icon" variant="outline" className="rounded-none border-white/20 text-white hover:bg-primary hover:text-black transition-colors" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github className="w-5 h-5" /></a>
            </Button>
          </div>
          <Link href={`/projects/${project.id}`} className="text-white text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
            CASE STUDY <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Project Info */}
      <div className="w-full lg:w-2/5 space-y-8 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-primary opacity-50"></span>
            <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px]">SELECTED PROJECT</span>
          </div>
          <h3 className="text-xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-none group-hover:italic transition-all duration-500">
            {project.title.toUpperCase()}
          </h3>
        </div>

        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {project.technologies.slice(0, 4).map((tech: string, i: number) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 border-b border-transparent hover:border-primary hover:text-primary transition-all cursor-crosshair">
              {tech}
            </span>
          ))}
        </div>

        <Button
          asChild
          className="h-12 sm:h-14 px-8 sm:px-10 rounded-none bg-foreground text-background font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-primary hover:text-primary-foreground transition-all duration-500"
        >
          <Link href={`/projects/${project.id}`}>
            VIEW ARCHITECTURE
          </Link>
        </Button>
      </div>
    </div>
  );

  const displayProjects = projects.slice(0, 3);

  return (
    <section id="projects" className="py-16 md:py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-12 md:mb-24 items-start lg:items-end justify-between border-b border-foreground/10 pb-16">
          <div className="lg:w-1/2">
            <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">/ MY WORK</span>
            <h2 className="text-4xl sm:text-6xl lg:text-[7vw] text-display leading-none">
              FEATURED <br />
              <span className="text-primary">PROJECTS</span>
            </h2>
          </div>
     
        </div>

        <div className="flex flex-col">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-96 w-full bg-muted animate-pulse mb-10 border border-foreground/5" />
            ))
          ) : displayProjects.length > 0 ? (
            displayProjects.map((p, i) => renderProjectCard(p, i))
          ) : (
            <p className="py-20 text-center text-muted-foreground text-xl font-black uppercase tracking-widest opacity-20">
              NO PROJECTS FOUND IN INDEX
            </p>
          )}
        </div>

        <div className="flex justify-center mt-20">
          <Button
            asChild
            variant="outline"
            className="px-8 sm:px-16 h-14 sm:h-20 rounded-none border border-foreground font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-primary hover:border-primary transition-all group w-full sm:w-auto"
          >
            <Link href="/projects">
              VIEW ALL PROJECTS
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-4 sm:ml-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
