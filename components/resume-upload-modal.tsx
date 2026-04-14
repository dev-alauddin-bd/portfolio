"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function ResumeUploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret command: Ctrl + Shift + U
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Resume updated successfully!");
        setFile(null);
        setIsOpen(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md glass border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black">
            <Upload className="w-6 h-6 text-primary" />
            Resume Manager
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Upload your latest resume. It will be saved as <code className="text-primary">/public/resume.pdf</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div 
            className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${
              file ? "border-primary/50 bg-primary/5" : "border-white/10 hover:border-primary/30"
            }`}
          >
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
            
            {file ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg truncate max-w-[250px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFile(null)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 font-bold uppercase tracking-widest text-[10px]"
                >
                  Remove File
                </Button>
              </div>
            ) : (
              <label 
                htmlFor="resume-upload" 
                className="cursor-pointer text-center space-y-4 w-full"
              >
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold">Click to select PDF</p>
                  <p className="text-xs text-muted-foreground">Maximum size: 10MB</p>
                </div>
              </label>
            )}
          </div>

          <Button 
            className="w-full h-14 bg-primary hover:shadow-glow rounded-2xl font-black uppercase tracking-widest text-xs"
            disabled={!file || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <CheckCircle2 className="w-5 h-5 mr-2" />
            )}
            {isUploading ? "Uploading..." : "Deploy Resume"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
