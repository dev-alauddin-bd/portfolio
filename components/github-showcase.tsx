"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Star, GitFork, ExternalLink, Code2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AOS from "aos";
import "aos/dist/aos.css";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
}

export function GitHubShowcase() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    
    async function fetchRepos() {
      try {
        const response = await fetch("https://api.github.com/users/md-alauddin/repos?sort=updated&per_page=6");
        const data = await response.json();
        if (Array.isArray(data)) {
          setRepos(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching repos:", error);
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  return (
    <section id="github" className="py-24 md:py-32 relative overflow-hidden bg-background bg-grid">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-purple-500/10 rounded-full blur-[150px] animate-blob pointer-events-none opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20" data-aos="fade-up">
          <div className="flex items-center justify-center gap-3 text-primary mb-4 font-black uppercase tracking-[0.3em] text-[10px]">
            <Github className="w-4 h-4" />
            Open Source contributions
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            Code <span className="text-primary">Ecosystem</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-white/[0.02] glass rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <div key={repo.id} data-aos="fade-up" data-aos-delay={index * 100}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="group block h-full">
                  <Card className="h-full bg-white/[0.01] glass border-white/5 rounded-[32px] p-6 transition-all duration-500 hover:border-primary/30 hover:bg-white/[0.03] flex flex-col">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <Code2 className="w-6 h-6 text-primary" />
                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors truncate">
                        {repo.name}
                      </h3>
                      
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-6 opacity-70 flex-grow">
                        {repo.description || "Experimental technical project focusing on high-performance architecture."}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-[10px] font-bold text-muted-foreground">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {repo.stargazers_count}
                          </div>
                          <div className="flex items-center text-[10px] font-bold text-muted-foreground">
                            <GitFork className="w-3 h-3 mr-1 text-blue-500" />
                            {repo.forks_count}
                          </div>
                        </div>
                        {repo.language && (
                          <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center" data-aos="fade-up">
          <a 
            href="https://github.com/md-alauddin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 h-14 bg-white/[0.02] glass border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl group"
          >
            Explore Full Repository
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Minimal arrow icon for the link
function ArrowRight(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
