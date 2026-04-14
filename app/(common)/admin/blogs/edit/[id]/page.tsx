"use client";

import React, { useState, useEffect } from "react";
import { Editor } from "primereact/editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Image as ImageIcon, Tags, Type, Layout, ArrowLeft, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// PrimeReact styles
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBlogData();
  }, [id]);

  const fetchBlogData = async () => {
    try {
      const res = await fetch(`/api/blogs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setCoverImage(data.coverImage || "");
      } else {
        toast.error("Failed to load artifact data.");
        router.push("/admin/dashboard");
      }
    } catch (err) {
      toast.error("Synchronization failure.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title || !content) {
      toast.error("Title and Content are required for re-deployment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          content,
          coverImage: coverImage || null,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Insight successfully updated and re-deployed.");
      setTimeout(() => router.push("/admin/dashboard"), 1000);
    } catch (error) {
      console.error(error);
      toast.error("Critical error during deployment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <Button asChild variant="ghost" className="rounded-xl mb-4 group hover:bg-primary/10 hover:text-primary">
                <Link href="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  Control Layer
                </Link>
              </Button>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                Refine <span className="text-primary italic">Insight</span>
              </h1>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleUpdate}
                disabled={isSubmitting || !title || !content}
                className="bg-primary hover:shadow-glow rounded-xl px-10 font-black uppercase tracking-widest text-xs h-14"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Syncing..." : "Update Insight"}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Editor Area */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass border-white/5 overflow-hidden rounded-[40px]">
                <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" />
                    Content Laboratory
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Editor
                    value={content}
                    onTextChange={(e) => setContent(e.htmlValue ?? "")}
                    style={{
                      height: "550px",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "inherit",
                    }}
                    placeholder="Refactor your thoughts..."
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Config */}
            <div className="space-y-8">
              <Card className="glass border-white/5 rounded-[40px] overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Layout className="w-4 h-4 text-primary" />
                    Artifact Config
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity/Title</label>
                    <Input
                      placeholder="Insight ID"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-background/50 border-white/10 focus:border-primary/50 rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Visual Hash (Image URL)</label>
                    <Input
                      placeholder="https://..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="bg-background/50 border-white/10 focus:border-primary/50 rounded-xl h-12"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Diagnostic Preview</h5>
                    {coverImage ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5">
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center bg-white/[0.02] opacity-30 italic text-[10px] uppercase font-bold text-muted-foreground">
                        No Visual Artifact
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Maintenance Card */}
              <Card className="bg-red-500/5 border-red-500/20 rounded-[32px] overflow-hidden">
                <CardContent className="p-8">
                  <h4 className="font-bold text-red-500 text-sm flex items-center gap-2 mb-4">
                    <Trash2 className="w-4 h-4" />
                    Nuclear Option
                  </h4>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed mb-6">
                    Deleting the artifact will remove it from all public nodes.
                  </p>
                  <Button variant="destructive" className="w-full rounded-xl uppercase font-black tracking-widest text-[10px] h-12">
                     Terminate Insight
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
