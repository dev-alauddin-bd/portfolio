"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarDays, Share2, ArrowLeft, Loader2, Link as LinkIcon, Facebook, Linkedin, Twitter } from 'lucide-react';
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  date: string;
}

export default function BlogPostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchBlogPost() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error("Blog connection failed");
        const data: BlogPost = await res.json();
        setBlogPost(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
        setLoading(false);
      }
    }
    fetchBlogPost();
  }, [id]);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied! Ready to share.", {
      style: {
        borderRadius: '10px',
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #ff000033'
      }
    });
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );
  
  if (error || !blogPost) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Post not found</h2>
      <Button asChild className="rounded-xl"><Link href="/blog">Back to Archives</Link></Button>
    </div>
  );

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background bg-grid relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Navigation */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            asChild 
            className="rounded-xl hover:bg-primary/10 hover:text-primary group"
          >
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Archives
            </Link>
          </Button>
        </div>

        <article className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl bg-white/[0.01]">
          {/* Hero Image Section */}
          <div className="relative aspect-[21/9] w-full overflow-hidden">
            <img 
              src={blogPost.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000"} 
              alt={blogPost.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          </div>

          <div className="px-8 md:px-16 py-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-white/5 pb-8">
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-primary">
                <CalendarDays className="w-4 h-4 mr-2" />
                {new Date(blogPost.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span className="text-primary italic mr-2 font-black italic">By</span> Md Alauddin
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-none group-hover:text-primary transition-colors">
              {blogPost.title}
            </h1>

            {/* Content */}
            <div 
              className="prose prose-xl prose-invert max-w-none transition-all duration-300
              prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-strong:text-primary prose-strong:font-black
              prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl
              mb-16" 
              dangerouslySetInnerHTML={{ __html: blogPost.content }} 
            />

            {/* Share Footer */}
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 mt-20">
              <div className="space-y-4 text-center md:text-left">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Digital Propagation</h4>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" onClick={shareOnLinkedIn} className="w-12 h-12 rounded-xl hover:bg-blue-600 hover:text-white transition-all border-white/10">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={shareOnFacebook} className="w-12 h-12 rounded-xl hover:bg-blue-700 hover:text-white transition-all border-white/10">
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={copyLink} className="w-12 h-12 rounded-xl hover:bg-primary hover:text-white transition-all border-white/10">
                    <LinkIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                 <Button asChild size="lg" className="bg-primary hover:shadow-glow rounded-xl font-black uppercase tracking-widest text-xs h-14 px-8">
                   <Link href="/contact">Discuss this Topic</Link>
                 </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}