"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Lock, 
  Unlock, 
  FileUp, 
  PlusCircle, 
  Settings, 
  ShieldCheck, 
  Loader2,
  X,
  LayoutDashboard
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function AdminGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<"login" | "dashboard" | "resume">("login");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setView("dashboard");
        toast.success("Identity Verified", {
          icon: '🛡️',
          style: { borderRadius: '10px', background: '#333', color: '#fff' }
        });
      } else {
        toast.error("Access Denied: Invalid Key");
      }
    } catch (error) {
      toast.error("Verification system error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Resume synchronized successfully!");
        setView("dashboard");
        setResumeFile(null);
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Network error during sync");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setView(isAuthenticated ? "dashboard" : "login");
          setPassword("");
        }
      }}>
        <DialogContent className="sm:max-w-md glass border-white/10 rounded-[32px] overflow-hidden p-0 gap-0">
          <div className="bg-primary/5 p-8 border-b border-white/5">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                {isAuthenticated ? <LayoutDashboard className="w-6 h-6 text-primary" /> : <ShieldCheck className="w-6 h-6 text-primary" />}
                {isAuthenticated ? "Admin Control" : "Security Gateway"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium italic">
                {isAuthenticated ? "Welcome back, Commander." : "Elevated privileges required to proceed."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8">
            {!isAuthenticated ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Passcode</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="bg-white/5 border-white/10 focus:border-primary/50 pl-11 h-12 rounded-xl"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleLogin} 
                  disabled={isLoading || !password}
                  className="w-full bg-primary hover:shadow-glow h-12 rounded-xl font-black uppercase tracking-widest text-xs"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                </Button>
              </div>
            ) : view === "dashboard" ? (
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setView("resume")}
                  className="h-32 flex-col gap-3 glass border-white/5 hover:border-primary/50 rounded-2xl transition-all group"
                >
                  <FileUp className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Update Resume</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/addblog");
                  }}
                  className="h-32 flex-col gap-3 glass border-white/5 hover:border-primary/50 rounded-2xl transition-all group"
                >
                  <PlusCircle className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">New Article</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select PDF Artifact</label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {resumeFile ? (
                      <div className="flex flex-col items-center">
                        <ShieldCheck className="w-10 h-10 text-primary mb-2" />
                        <span className="text-xs font-bold text-foreground">{resumeFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <FileUp className="w-10 h-10 text-muted-foreground mb-2 opacity-20" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Drop or Click</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setView("dashboard")} className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest">Back</Button>
                  <Button 
                    onClick={handleResumeUpload} 
                    disabled={isLoading || !resumeFile}
                    className="flex-1 bg-primary hover:shadow-glow rounded-xl font-black uppercase tracking-widest text-xs h-12"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Resume"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
