"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import AOS from "aos";
import "aos/dist/aos.css";

interface BlogPost {
    _id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    date: string;
}

export function BlogSection() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: false });
        
        async function fetchBlogs() {
            try {
                const res = await fetch("/api/blogs");
                if (!res.ok) throw new Error("Connection failed");
                const data: BlogPost[] = await res.json();
                setBlogPosts(data.slice(0, 3)); // Only show top 3 on home page
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    return (
        <section id="blog" className="py-24 md:py-32 relative overflow-hidden bg-background bg-grid">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20" data-aos="fade-up">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 text-primary mb-4 font-black uppercase tracking-[0.3em] text-[10px]">
                            <BookOpen className="w-4 h-4" />
                            Knowledge Base
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                            Technical <span className="text-primary italic">Insights</span>
                        </h2>
                    </div>
                    <Button asChild variant="outline" className="rounded-xl border-white/10 glass px-8 h-12 font-black uppercase tracking-widest text-[10px] hidden md:flex">
                        <Link href="/blog">View All Articles</Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="h-96 bg-white/[0.02] glass rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : blogPosts.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <div 
                                key={post._id} 
                                className="group h-full" 
                                data-aos="fade-up" 
                                data-aos-delay={index * 100}
                            >
                                <Card className="h-full bg-white/[0.01] glass border-white/5 rounded-[32px] overflow-hidden transition-all duration-500 hover:border-primary/30 flex flex-col">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img 
                                            src={post.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                                    </div>

                                    <CardContent className="p-8 flex-grow flex flex-col">
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                                            <CalendarDays className="w-3.5 h-3.5 mr-2 text-primary" />
                                            {new Date(post.date).toLocaleDateString()}
                                        </div>

                                        <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        
                                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-8 flex-grow opacity-70">
                                            {post.excerpt}
                                        </p>

                                        <Button asChild variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:no-underline group">
                                            <Link href={`/blog/${post._id}`} className="flex items-center gap-2">
                                                Explore Deeply <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/[0.01] glass rounded-3xl border border-dashed border-white/5">
                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Awaiting first publication.</p>
                    </div>
                )}

                <div className="mt-12 text-center md:hidden" data-aos="fade-up">
                    <Button asChild className="w-full h-14 bg-primary rounded-2xl font-black uppercase tracking-widest text-xs">
                        <Link href="/blog">View All Articles</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}