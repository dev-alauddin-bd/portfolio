"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Github,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  Code2,
  Globe,
  Server,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

interface Project {
  id: number;
  title: string;
  thumnail: string;
  description: string;
  detailedDescription?: string;
  features?: string[];
  challenges?: string[];
  futurePlans?: string[];
  screenshots?: string[];
  technologies: string[];
  role?: string;
  duration?: string;
  teamSize?: string;
  liveUrl: string;
  githubUrl: string;
  backendUrl?: string;
  apiUrl?: string;
  swaggerUrl?: string;
  category: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/projects.json");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data: Project[] = await res.json();
        const foundProject = data.find((p) => p.id === Number(params.id));
        if (!foundProject) {
          router.push("/");
          return;
        }
        setProject(foundProject);
      } catch (error) {
        console.error("Error fetching project:", error);
        router.push("/");
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-32 pb-24">

      <div className="container mx-auto px-6 sm:px-10 relative z-10">
        {/* Navigation & Breadcrumb */}
        <div className="mb-8 md:mb-12" data-aos="fade-down">
          <Button
            variant="ghost"
            className="group hover:bg-primary/10 text-primary font-black uppercase tracking-widest text-[9px] sm:text-[10px] rounded-xl pr-4 md:pr-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 md:mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden xs:inline">Return to Work</span>
            <span className="xs:hidden">Back</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start lg:items-end mb-16 md:mb-20">
          <div data-aos="fade-right">
            <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
              <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border-none backdrop-blur-md font-bold uppercase tracking-tighter text-[9px] sm:text-[10px] px-3 md:px-4 py-1.5">
                {project.category}
              </Badge>
              {project.role && (
                <Badge variant="outline" className="border-2 border-primary/20 font-bold uppercase tracking-tighter text-[9px] sm:text-[10px] px-3 md:px-4 py-1.5">
                  {project.role}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.95] md:leading-[0.9]">
              {project.title.includes('-') ? (
                <>
                  {project.title.split('-')[0]} <br />
                  <span className="text-gradient">{project.title.split('-')[1]}</span>
                </>
              ) : (
                <>
                  {project.title.split(' ').slice(0, 2).join(' ')} <br />
                  <span className="text-gradient">{project.title.split(' ').slice(2).join(' ')}</span>
                </>
              )}
            </h1>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6" data-aos="fade-left">
            {[
              { icon: Calendar, label: "Duration", value: project.duration || "N/A" },
              { icon: Users, label: "Team", value: project.teamSize || "Solo" },
              { icon: Code2, label: "Stack", value: `${project.technologies.length} Core Tech` }
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-3xl border-white/5">
                <stat.icon className="h-6 w-6 text-primary mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                <p className="font-bold text-sm">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Content & Screenshots */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Gallery Wrapper */}
            <div className="space-y-6" data-aos="zoom-in">
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl">
                <Image
                  src={project.screenshots ? project.screenshots[activeScreenshot] : project.thumnail}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
              </div>
              
              {project.screenshots && project.screenshots.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x">
                  {project.screenshots.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveScreenshot(idx)}
                      className={`relative w-40 aspect-video rounded-2xl overflow-hidden border-2 transition-all snap-start flex-shrink-0 ${
                        activeScreenshot === idx ? "border-primary scale-105 shadow-glow" : "border-white/5 opacity-50 grayscale hover:grayscale-0"
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed Info Blocks */}
            <div className="glass p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] border-white/5 space-y-12" data-aos="fade-up">
              <div>
                <h2 className="text-2xl md:text-3xl font-black mb-6 tracking-tight">Project Vision</h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.detailedDescription || "Analysis coming soon..."}
                </p>
              </div>

              {project.features && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-black mb-8 tracking-tight flex items-center gap-4">
                    Architectural Features
                    <span className="h-0.5 flex-grow bg-gradient-to-r from-primary/30 to-transparent"></span>
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 md:p-5 bg-background/50 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                        <CheckCircle2 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-xs md:text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.challenges && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-black mb-8 tracking-tight flex items-center gap-4">
                    Critical Break-throughs
                    <span className="h-0.5 flex-grow bg-gradient-to-r from-orange-500/30 to-transparent"></span>
                  </h2>
                  <div className="space-y-4">
                    {project.challenges.map((challenge, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 md:p-6 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                        <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-orange-500 flex-shrink-0 mt-1" />
                        <p className="text-xs md:text-sm leading-relaxed">{challenge}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.futurePlans && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-black mb-8 tracking-tight flex items-center gap-4">
                    Evolution & Roadmap
                    <span className="h-0.5 flex-grow bg-gradient-to-r from-blue-500/30 to-transparent"></span>
                  </h2>
                  <div className="space-y-4">
                    {project.futurePlans.map((plan, i) => (
                      <div key={i} className="flex items-start gap-4 p-5 md:p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 group hover:bg-blue-500/10 transition-colors">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 group-hover:scale-150 transition-transform" />
                        <p className="text-xs md:text-sm leading-relaxed">{plan}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tactical Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions Card */}
            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6" data-aos="fade-left">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground mb-8">Deployments</h3>
              <div className="space-y-4">
                <Button asChild className="w-full h-12 sm:h-14 rounded-2xl bg-primary hover:shadow-glow font-black uppercase tracking-widest text-[9px] sm:text-[10px]">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-3 h-4 w-4" /> Launch Production
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full h-12 sm:h-14 rounded-2xl border-2 hover:bg-primary hover:text-white hover:border-primary font-black uppercase tracking-widest text-[9px] sm:text-[10px]">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-3 h-4 w-4" /> Frontend Source
                  </a>
                </Button>
                {project.backendUrl && (
                  <Button asChild variant="outline" className="w-full h-12 sm:h-14 rounded-2xl border-2 hover:bg-primary hover:text-white hover:border-primary font-black uppercase tracking-widest text-[9px] sm:text-[10px]">
                    <a href={project.backendUrl} target="_blank" rel="noopener noreferrer">
                      <Server className="mr-3 h-4 w-4" /> Backend Source
                    </a>
                  </Button>
                )}
                {project.apiUrl && (
                  <Button asChild variant="secondary" className="w-full h-12 sm:h-14 rounded-2xl bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest text-[9px] sm:text-[10px]">
                    <a href={project.apiUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-3 h-4 w-4" /> Inspect API
                    </a>
                  </Button>
                )}
                {project.swaggerUrl && (
                  <Button asChild variant="secondary" className="w-full h-12 sm:h-14 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 font-black uppercase tracking-widest text-[9px] sm:text-[10px]">
                    <a href={project.swaggerUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-3 h-4 w-4" /> REST API Swagger
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Ecosystem Card */}
            <div className="glass p-8 rounded-[2.5rem] border-white/5" data-aos="fade-left" data-aos-delay="100">
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground mb-8">Ecosystem</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 bg-background/50 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-white/5 border-b-primary/40 border-b-2">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Viral Component */}
            <div className="glass p-8 rounded-[2.5rem] border-white/5" data-aos="fade-left" data-aos-delay="200">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Share Innovation</h4>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Impressed by this architecture? Share it with your network.</p>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl group hover:border-primary/50"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Project blueprint link copied!");
                }}
              >
                <ExternalLink className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" />
                Copy URL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
