"use client";

import React, { useState, useEffect } from "react";
import { Editor } from "primereact/editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Image as ImageIcon, Tags, Type, Layout, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

// PrimeReact styles
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function AddBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Simple verification check - in a real app this would verify the token via API
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/login");
        // If we want stricter check, we rely on the cookie being sent
        setIsVerifying(false);
      } catch (err) {
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  const handleSave = async () => {
    if (!title || !content) {
      toast.error("Please provide both title and content!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          content,
          coverImage: coverImage || null,
          date: new Date().toISOString()
        }),
      });

      if (!res.ok) throw new Error("Failed to deploy blog post");

      toast.success("Blog post deployed successfully!");
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Error deploying blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-4 text-[10px] font-black uppercase tracking-widest opacity-50">Identity Verification in progress...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                Compose <span className="text-primary">New Insight</span>
              </h1>
              <p className="text-muted-foreground mt-4 text-lg">
                Craft a high-impact technical blog post for your audience.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push("/admin/dashboard")}
                className="rounded-xl border-white/10 glass"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSubmitting || !title || !content}
                className="bg-primary hover:shadow-glow rounded-xl px-8 font-black uppercase tracking-widest text-xs"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Deploying..." : "Publish Post"}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Editor Side */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass border-white/5 overflow-hidden rounded-3xl">
                <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" />
                    Content Editor
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Editor
                    value={content}
                    onTextChange={(e) => setContent(e.htmlValue ?? "")}
                    style={{
                      height: "500px",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "inherit",
                    }}
                    placeholder="Architect your story here..."
                  />
                </CardContent>
              </Card>
            </div>

            {/* Config Side */}
            <div className="space-y-8">
              <Card className="glass border-white/5 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Layout className="w-4 h-4 text-primary" />
                    Metadata & Assets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Post Title</label>
                    <Input
                      placeholder="e.g. Master Next.js 15 Performance"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-background/50 border-white/10 focus:border-primary/50 rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cover Image URL</label>
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="bg-background/50 border-white/10 focus:border-primary/50 rounded-xl h-12"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Quick Preview</h5>
                    {coverImage ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-muted">
                        <img 
                          src={coverImage} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = "")}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-muted-foreground bg-white/[0.02]">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Cover Image</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="bg-primary/5 border-primary/20 rounded-3xl">
                <CardContent className="pt-6">
                  <h4 className="font-bold flex items-center gap-2 text-primary mb-4">
                    <Tags className="w-4 h-4" />
                    Pro Tips
                  </h4>
                  <ul className="text-xs space-y-3 text-muted-foreground font-medium">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Use H1 and H2 tags for better SEO structure.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Add code blocks to increase technical value.
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Keep your title concise but punchy.
                    </li>
                  </ul>
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
