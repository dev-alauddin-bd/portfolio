"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"
      }`}
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className="relative h-14 w-14 rounded-full bg-primary hover:bg-primary shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group outline-none focus:ring-0 focus:ring-offset-0 border-none"
        aria-label="Scroll to top"
      >
        {/* Progress circle */}
        {scrollProgress > 0 && (
          <svg className="absolute inset-0 -rotate-90 pointer-events-none" width="56" height="56">
            <circle
              cx="28"
              cy="28"
              r="25"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 25}`}
              strokeDashoffset={`${2 * Math.PI * 25 * (1 - scrollProgress / 100)}`}
              className="text-primary-foreground transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
        )}
        
        <ArrowUp className="h-5 w-5 text-primary-foreground group-hover:animate-bounce" />
      </Button>
    </div>
  );
}
