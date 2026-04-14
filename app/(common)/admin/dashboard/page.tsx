"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  FileUp, 
  FileText, 
  LogOut, 
  LayoutDashboard, 
  CalendarDays,
  ExternalLink,
  Loader2,
  Settings,
  ShieldCheck,
  Eye,
  RefreshCcw
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  _id: string;
  title: string;
  date: string;
}

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      toast.error("Failed to fetch insight stream.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this insight? This action is irreversible.")) return;
    
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Insight purged from database");
        fetchBlogs();
      } else {
        toast.error("Deletion failed");
      }
    } catch (error) {
      toast.error("Error connecting to server");
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Resume artifact updated across the ecosystem!");
        setResumeFile(null);
      } else {
        toast.error("Artifact deployment failed");
      }
    } catch (error) {
      toast.error("Network synchronization error");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleLogout = () => {
    // In a real app we'd clear the cookie, but for now we just redirect
    router.push("/");
  };

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16" data-aos="fade-up">
          <div>
            <div className="flex items-center gap-3 text-primary mb-4 font-black uppercase tracking-[0.3em] text-[10px]">
              <ShieldCheck className="w-4 h-4" />
              Authenticated Control Layer
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleLogout} className="rounded-xl border-white/5 glass font-black uppercase tracking-widest text-[10px] h-12 px-6">
              <LogOut className="w-4 h-4 mr-2" />
              Terminate Session
            </Button>
            <Button asChild className="bg-primary hover:shadow-glow rounded-xl font-black uppercase tracking-widest text-xs h-12 px-8">
              <Link href="/admin/blogs/new">
                <Plus className="w-4 h-4 mr-2" />
                New Insight
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area - Blog List */}
          <div className="lg:col-span-2 space-y-8" data-aos="fade-up" data-aos-delay="100">
            <Card className="glass border-white/5 rounded-[40px] overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5 p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Insight Inventory
                  </CardTitle>
                  <CardDescription className="text-xs">Manage and monitor your technical publications.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchBlogs} className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                   <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-20 flex justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
                  </div>
                ) : blogs.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {blogs.map((blog) => (
                      <div key={blog._id} className="p-6 md:p-8 flex items-center justify-between hover:bg-white/[0.01] transition-colors group">
                        <div className="space-y-1 pr-4 min-w-0">
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors truncate">
                            {blog.title}
                          </h4>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            <CalendarDays className="w-3.5 h-3.5 text-primary" />
                            {new Date(blog.date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <Button asChild variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-blue-500/10 hover:text-blue-500">
                             <Link href={`/blog/${blog._id}`} target="_blank">
                               <Eye className="w-4 h-4" />
                             </Link>
                          </Button>
                          <Button asChild variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500">
                             <Link href={`/admin/blogs/edit/${blog._id}`}>
                               <Edit3 className="w-4 h-4" />
                             </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center opacity-40 italic">
                    <p className="font-black uppercase tracking-widest text-xs">The inventory is currently specialized.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Resume Management */}
          <div className="space-y-8" data-aos="fade-up" data-aos-delay="200">
            <Card className="glass border-white/5 rounded-[40px] overflow-hidden">
              <CardHeader className="bg-primary/5 p-8 border-b border-white/5">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-primary" />
                  Artifact Sync
                </CardTitle>
                <CardDescription className="text-xs">Update your global professional resume artifact.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer relative group">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {resumeFile ? (
                    <div className="flex flex-col items-center">
                      <ShieldCheck className="w-12 h-12 text-primary mb-3" />
                      <span className="text-xs font-black uppercase tracking-widest text-center">{resumeFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <FileUp className="w-12 h-12 text-muted-foreground mb-3 opacity-20 group-hover:opacity-40 transition-opacity" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Choose PDF Artifact</span>
                    </>
                  )}
                </div>
                
                <Button 
                  onClick={handleResumeUpload}
                  disabled={isUploadingResume || !resumeFile}
                  className="w-full h-14 bg-primary hover:shadow-glow rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  {isUploadingResume ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Deploy to Production</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass border-white/5 rounded-[32px] overflow-hidden">
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">Total Insights</h5>
                  <span className="text-4xl font-black italic">{blogs.length}</span>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-primary opacity-40" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
