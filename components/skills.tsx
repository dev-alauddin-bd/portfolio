"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Server, Code2, Wrench } from "lucide-react";

// Enhanced skill data with categories and proficiency
const skillsData = {
  frontend: [
    { name: "React.js", proficiency: 95, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Next.js", proficiency: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { name: "TypeScript", proficiency: 88, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Redux", proficiency: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
    { name: "Tailwind CSS", proficiency: 92, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "i18next", proficiency: 85, icon: "https://www.vectorlogo.zone/logos/i18next/i18next-icon.svg" },
    { name: "Intlayer", proficiency: 80, icon: "https://avatars.githubusercontent.com/u/10547012?s=200&v=4" },
    { name: "Lenis", proficiency: 82, icon: "https://avatars.githubusercontent.com/u/10547012?s=200&v=4" },
    { name: "EmailJS", proficiency: 85, icon: "https://v0.dev/placeholder.svg" },
    { name: "JavaScript", proficiency: 95, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "HTML5", proficiency: 98, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", proficiency: 95, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  ],
  backend: [
    { name: "Node.js", proficiency: 90, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "NestJS", proficiency: 88, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" },
    { name: "JavaScript", proficiency: 95, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", proficiency: 88, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Express.js", proficiency: 92, icon: "https://www.vectorlogo.zone/logos/expressjs/expressjs-icon.svg" },
    { name: "REST API", proficiency: 95, icon: "https://www.svgrepo.com/show/120283/api.svg" },
    { name: "Socket.io", proficiency: 82, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
    { name: "Swagger", proficiency: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" },
    { name: "Mongoose", proficiency: 90, icon: "https://avatars.githubusercontent.com/u/7552965?s=200&v=4" },
    { name: "Cloudinary", proficiency: 82, icon: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Cloudinary_logo.svg" },
    { name: "Multer", proficiency: 80, icon: "https://avatars.githubusercontent.com/u/10547012?s=200&v=4" },
    { name: "Winston", proficiency: 80, icon: "https://avatars.githubusercontent.com/u/826888?s=200&v=4" },
  ],
  database: [
    { name: "PostgreSQL", proficiency: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    { name: "MongoDB", proficiency: 88, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "Prisma", proficiency: 87, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" },
    { name: "Redis", proficiency: 85, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
    { name: "Supabase", proficiency: 80, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
    { name: "Firebase", proficiency: 83, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  ],
  security: [
    { name: "JWT", proficiency: 92, icon: "https://jwt.io/img/pic_logo.svg" },
    { name: "Stripe", proficiency: 88, icon: "https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg" },
    {
      name: "SSLCommerz",
      proficiency: 85,
      // SSLCommerz official site asset
      icon: "https://avatars.githubusercontent.com/u/10547012?s=200&v=4"
    },
    {
      name: "Aamarpay",
      proficiency: 82,
      icon: "https://aamarpay.com/images/logo/aamarpay-logo.png"
    },
    {
      name: "NextAuth",
      proficiency: 90,
      icon: "https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg" // Often used as NextAuth representation
    },
    { name: "Rate Limiting", proficiency: 85, icon: "https://avatars.githubusercontent.com/u/10547012?s=200&v=4" },
    {
      name: "Helmet",
      proficiency: 80,
      // Official Helmet.js logo link from their documentation site
      icon: "https://avatars.githubusercontent.com/u/10547012?s=200&v=4"
    },
    { name: "RBAC", proficiency: 85, icon: "https://avatars.githubusercontent.com/u/10547012?s=200&v=4" },
  ],

  cloud: [
    { name: "AWS", proficiency: 78, icon: "https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg" },
    { name: "Docker", proficiency: 75, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "Vercel", proficiency: 88, icon: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
    { name: "Railway", proficiency: 85, icon: "https://avatars.githubusercontent.com/u/55513813?s=200&v=4" },
    { name: "Render", proficiency: 82, icon: "https://avatars.githubusercontent.com/u/36424272?s=200&v=4" },
    { name: "Git", proficiency: 92, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub Actions", proficiency: 78, icon: "https://avatars.githubusercontent.com/u/44036562?s=200&v=4" },
    { name: "Postman", proficiency: 85, icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
    { name: "PNPM", proficiency: 90, icon: "https://avatars.githubusercontent.com/u/15024545?s=200&v=4" },
    { name: "Figma", proficiency: 80, icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  ],
};

export function Skills() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("backend");

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
  }, []);




  return (
    <section id="skills" className="py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 sm:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 mb-20 items-baseline">
          <div className="lg:w-1/2">
            <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">/ TECHNICAL CAPABILITIES</span>
            <h2 className="text-4xl sm:text-6xl lg:text-[6vw] text-display leading-none">
              TECH <br />
              <span className="text-primary italic">STACK.</span>
            </h2>
          </div>
          <div className="lg:w-1/2 w-full lg:pl-10">
            <div className="relative group p-px bg-foreground/10 focus-within:bg-primary transition-colors">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="FILTER TOOLKIT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-16 pl-14 bg-background border-none rounded-none focus-visible:ring-0 text-[10px] font-black tracking-widest uppercase placeholder:opacity-50"
              />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex border-b border-foreground/10 mb-16 overflow-x-auto no-scrollbar">
            <TabsList className="h-16 p-0 bg-transparent rounded-none flex gap-10 min-w-max">
              {[
                { id: "backend", label: "01/ BACKEND" },
                { id: "frontend", label: "02/ FRONTEND" },
                { id: "database", label: "03/ DATABASES" },
                { id: "security", label: "04/ SECURITY & PAYMENTS" },
                { id: "cloud", label: "05/ CLOUD & TOOLS" },
              ].map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="h-16 px-0 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-black text-[10px] tracking-[0.3em] uppercase transition-all"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(skillsData).map(([category, skills]) => (
            <TabsContent key={category} value={category} className="outline-none">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-foreground/10 border border-foreground/10 overflow-hidden">
                {skills
                  .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((skill, index) => (
                    <div
                      key={skill.name}
                      className="bg-background p-4 sm:p-8 flex flex-col items-center justify-center gap-4 sm:gap-6 group transition-colors aspect-square lg:aspect-auto min-h-[9rem] sm:min-h-[12rem] relative"
                    >
                      <div className="p-4 bg-foreground/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className={`h-10 w-10 object-contain transition-all duration-500 ${skill.name.toLowerCase().includes("express") ||
                            skill.name.toLowerCase().includes("github") ||
                            skill.name.toLowerCase().includes("socket") ||
                            skill.name.toLowerCase().includes("next.js") ||
                            skill.name.toLowerCase().includes("shadcn") ||
                            skill.name.toLowerCase().includes("vercel") ||
                            skill.name.toLowerCase().includes("aws") ||
                            skill.name.toLowerCase().includes("swagger") ||
                            skill.name.toLowerCase().includes("api") ||
                            skill.name.toLowerCase().includes("multer") ||
                            skill.name.toLowerCase().includes("cloudinary") ||
                            skill.name.toLowerCase().includes("mongoose") ||
                            skill.name.toLowerCase().includes("railway") ||
                            skill.name.toLowerCase().includes("render") ||
                            skill.name.toLowerCase().includes("actions") ||
                            skill.name.toLowerCase().includes("pnpm") ||
                            skill.name.toLowerCase().includes("netlify") ||
                            skill.name.toLowerCase().includes("kubernetes") ||
                            skill.name.toLowerCase().includes("nextauth") ||
                            skill.name.toLowerCase().includes("limiting") ||
                            skill.name.toLowerCase().includes("helmet") ||
                            skill.name.toLowerCase().includes("rbac")
                            ? "dark:invert"
                            : ""
                            }`}
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="text-[10px] font-black uppercase tracking-widest">{skill.name}</h4>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}