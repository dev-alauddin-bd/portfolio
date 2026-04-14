"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ShieldCheck, Lock, Loader2, KeyRound } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast.success("Identity Authenticated", {
          icon: '🛡️',
        });
        setTimeout(() => router.push("/admin/dashboard"), 1000);
      } else {
        toast.error("Invalid credentials. Access denied.");
      }
    } catch (error) {
      toast.error("Security system failure.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background bg-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none z-0"></div>
      
      <div className="container max-w-[400px] relative z-10">
        <Card className="glass border-white/5 shadow-2xl rounded-[32px] overflow-hidden">
          <CardHeader className="text-center p-8 bg-white/[0.02] border-b border-white/5">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter">Command <span className="text-primary italic">Center</span></CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2 opacity-60">
              Restricted Area • Authentication Required
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Key</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-primary/50 pl-11 h-12 rounded-xl"
                    required 
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-8 pt-0">
              <Button 
                type="submit" 
                disabled={isLoading || !password}
                className="w-full h-14 bg-primary hover:shadow-glow rounded-xl font-black uppercase tracking-widest text-xs transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                {isLoading ? "Verifying..." : "Establish Connection"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center">
          <Button variant="link" onClick={() => router.push("/")} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
            Return to Public Sector
          </Button>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </main>
  );
}
