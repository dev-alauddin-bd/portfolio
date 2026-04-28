"use client"

import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Award, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CoursesAndCertifications() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })
  }, [])

  useEffect(() => {
    AOS.refresh()
  })

  const courses = [
    {
      title: "Bachelor of Science in Computer Science & Engineering",
      provider: "University of Barisal",
      year: "2020 - 2024",
      description:
        "Focused on core computer science principles including Data Structures, Algorithms, Database Management Systems, and Software Engineering.",
    },
    {
      title: "Next Level Web Development Course",
      provider: "Programming Hero",
      year: "2024",
      description:
        "Covered advanced full-stack development topics including REST APIs, authentication, Redux, and deployment strategies.",
    },
    {
      title: "Complete Web Development Course",
      provider: "Programming Hero",
      year: "2023",
      description:
        "Learned foundational web development skills including HTML, CSS, JavaScript, React, Node.js, and MongoDB.",
    },
  ]

  const certifications = [
    {
      title: "Next Level Web Development Course",
      issuer: "Programming Hero",
      year: "2024",
      credentialId: "PHlevel2-batch-3-fullstackWEB8-38501070",
      viewUrl: "/certificates/label-2.pdf",
    },
    {
      title: "Complete Web Development Course",
      issuer: "Programming Hero",
      year: "2023",
      credentialId: "WEB8-3850",
      viewUrl: "/certificates/label-1.pdf",
    },
  ]

  return (
    <section id="education" className="py-16 md:py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 mb-12 md:mb-24 items-baseline pb-16">
           <div className="lg:w-1/2">
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">/ LEARNING JOURNEY</span>
              <h2 className="text-4xl sm:text-6xl lg:text-[7vw] text-display leading-none">
                EDUCATION <br />
                <span className="text-primary">& COURSES</span>
              </h2>
           </div>
         
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <div className="flex border-b border-foreground/10 mb-12 sm:mb-20 overflow-x-auto no-scrollbar">
             <TabsList className="h-16 p-0 bg-transparent rounded-none flex gap-6 sm:gap-10 min-w-max">
                <TabsTrigger value="courses" className="h-16 px-0 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-black text-[10px] tracking-[0.3em] uppercase transition-all whitespace-nowrap">
                  01/ ACADEMICS
                </TabsTrigger>
                <TabsTrigger value="certifications" className="h-16 px-0 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary font-black text-[10px] tracking-[0.3em] uppercase transition-all whitespace-nowrap">
                  02/ CREDENTIALS
                </TabsTrigger>
             </TabsList>
          </div>

          <TabsContent value="courses" className="outline-none">
            <div className="space-y-0">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="group flex flex-col md:flex-row gap-6 md:gap-20 py-8 md:py-12 border-b border-foreground/5 hover:bg-primary/5 transition-colors px-0 md:px-4"
                >
                  <div className="md:w-32">
                     <span className="text-4xl font-black text-foreground/20 tabular-nums">{course.year}</span>
                  </div>
                  <div className="flex-grow space-y-4">
                     <div className="flex items-center gap-4 text-primary">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{course.provider}</span>
                     </div>
                     <h4 className="text-xl md:text-3xl font-black tracking-tight">{course.title.toUpperCase()}</h4>
                     <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed italic">
                        "{course.description}"
                     </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="outline-none">
            <div className="grid lg:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-background p-6 md:p-12 space-y-8 group hover:bg-primary/5 transition-colors relative h-full flex flex-col"
                >
                   <div className="flex justify-between items-start">
                      <div className="text-4xl sm:text-6xl font-black text-foreground/5 italic">0{index + 1}</div>
                      <span className="text-[10px] font-black text-primary border border-primary/20 px-4 py-1.5">{cert.year}</span>
                   </div>
                   
                   <div className="space-y-2 flex-grow">
                      <h4 className="text-xl md:text-2xl font-black leading-tight">{cert.title.toUpperCase()}</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{cert.issuer}</p>
                   </div>

                   <div className="pt-8 border-t border-foreground/5 space-y-6">
                      <div className="flex items-center gap-4 opacity-50">
                         <span className="text-[8px] font-black uppercase tracking-widest">UID:</span>
                         <span className="text-[9px] sm:text-[10px] font-mono break-all">{cert.credentialId}</span>
                      </div>
                      <Button asChild className="w-full h-12 sm:h-14 rounded-none bg-foreground text-background font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-primary hover:text-primary-foreground transition-all">
                        <Link href={cert.viewUrl} target="_blank" rel="noopener noreferrer">
                          VERIFY CREDENTIAL <ExternalLink className="ml-3 w-4 h-4" />
                        </Link>
                      </Button>
                   </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
  
}
