"use client"

import React, { useState, useEffect } from "react"
import emailjs from "@emailjs/browser"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Send, MessageCircle, Phone } from "lucide-react"
import Link from "next/link"

import AOS from "aos"
import "aos/dist/aos.css"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: "ease-in-out",
    })
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!serviceId || !templateId || !publicKey) {
      toast.error("Email service configuration is missing.")
      setIsSubmitting(false)
      return
    }

    const templateParams = {
      from_name: formData.name,
      reply_to: formData.email,
      subject: formData.subject,
      message: formData.message,
    }

    try {
      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey)
      if (result.status === 200 || result.text === "OK") {
        toast.success("Message sent successfully!")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        toast.error("Failed to send message.")
      }
    } catch (error) {
      console.error("EmailJS Error:", error)
      toast.error("An error occurred while sending the message.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "muhammadalauddin24434@gmail.com",
      href: "mailto:muhammadalauddin24434@gmail.com",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Barisal, Bangladesh",
      href: "#",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+880 1635230838",
      href: "https://wa.me/8801635230838",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+880 1635230838",
      href: "tel:+8801635230838",
    },
  ]

  return (
    <section id="contact" className="py-16 md:py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 sm:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 mb-12 md:mb-24 items-baseline border-b border-foreground/10 pb-16">
          <div className="lg:w-1/2">
            <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] block mb-6">/ SAY HELLO</span>
            <h2 className="text-4xl sm:text-6xl lg:text-[7vw] text-display leading-none">
              LET'S <br />
              <span className="text-primary">CONNECT</span>
            </h2>
          </div>
          
        </div>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-4 space-y-16">
            <div className="space-y-12">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block space-y-2 border-l border-foreground/10 pl-6 sm:pl-10 hover:border-primary transition-all"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{info.title}</p>
                  <p className="text-sm md:text-lg font-black group-hover:italic transition-all">{info.value}</p>
                </a>
              ))}
            </div>

            <div className="pt-8 border-t border-foreground/10 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">DIRECTORY / SOCIAL</h4>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: "GITHUB", link: "https://github.com/alauddin24434" },
                  { name: "LINKEDIN", link: "https://linkedin.com/in/md-alauddin" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.link}
                    target="_blank"
                    className="text-[10px] font-black tracking-widest hover:text-primary transition-colors border-b border-foreground/20 hover:border-primary pb-1"
                  >
                    {social.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 p-6 sm:p-12 border border-foreground/10 relative">
            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-primary"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-primary"></div>

            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
              <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">YOUR NAME</label>
                  <Input
                    name="name"
                    placeholder="FULL NAME"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-14 sm:h-16 bg-transparent border-x-0 border-t-0 border-b border-foreground/10 focus:border-primary rounded-none px-0 text-sm font-bold tracking-widest transition-all focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">YOUR EMAIL</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="EMAIL@ADDRESS.COM"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-14 sm:h-16 bg-transparent border-x-0 border-t-0 border-b border-foreground/10 focus:border-primary rounded-none px-0 text-sm font-bold tracking-widest transition-all focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">SUBJECT</label>
                <Input
                  name="subject"
                  placeholder="COLLABORATION SUBJECT"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="h-14 sm:h-16 bg-transparent border-x-0 border-t-0 border-b border-foreground/10 focus:border-primary rounded-none px-0 text-sm font-bold tracking-widest transition-all focus-visible:ring-0"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">YOUR MESSAGE</label>
                <Textarea
                  name="message"
                  placeholder="DESCRIBE THE PROJECT CHALLENGE..."
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="bg-transparent border-x-0 border-t-0 border-b border-foreground/10 focus:border-primary rounded-none px-0 text-sm font-bold tracking-widest transition-all focus-visible:ring-0 resize-none min-h-[8rem]"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="group h-14 sm:h-20 px-8 sm:px-16 bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] text-[10px] rounded-none hover:bg-foreground hover:text-background transition-all w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "PROCESSING..." : (
                    <div className="flex items-center gap-6">
                      SEND MESSAGE
                      <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </section>
  )
}