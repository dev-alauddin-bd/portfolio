"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight, Share2, Search, Filter, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import toast, { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  date: string;
}

export default function AllBlogsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) throw new Error("Connection failed");
        const data: BlogPost[] = await res.json();
        setBlogPosts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to synchronize with database.");
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/blog/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!", {
      icon: '🔗',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Area */}
        <div className="text-center max-w-4xl mx-auto mb-20" data-aos="fade-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
            Tech <span className="text-primary italic">Chronicles</span>
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto rounded-full mb-10"></div>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Exploring the boundaries of architecture, performance, and digital innovation.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-xl mx-auto mb-16" data-aos="fade-up" data-aos-delay="100">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search insights..." 
              className="w-full h-14 bg-white/[0.02] glass border border-white/5 rounded-2xl pl-12 pr-4 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-xl"
            />
          </div>
        </div>

        {/* Blog Grid */}
        {blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div 
                key={post._id} 
                className="group relative" 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <Card className="h-full bg-white/[0.02] glass border-white/5 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/20 hover:scale-[1.02] flex flex-col">
                  {/* Image Holder */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={post.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <Badge className="absolute bottom-4 left-4 bg-primary text-white border-none font-black uppercase tracking-widest text-[8px] py-1 px-3">
                      Technical Insight
                    </Badge>
                  </div>

                  <CardContent className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <CalendarDays className="w-3.5 h-3.5 mr-2 text-primary" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-8 flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                      <Button asChild variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:no-underline">
                        <Link href={`/blog/${post._id}`} className="flex items-center gap-2">
                          Read Full Project <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => copyToClipboard(post._id)}
                        className="w-10 h-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.02] glass rounded-3xl border-dashed border-2 border-white/5">
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No insights deployed yet.</p>
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}