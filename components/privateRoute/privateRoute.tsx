"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface PrivateRouteProps {
  children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")  // localStorage থেকে token নিন

    if (!token) {
      router.replace("/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  if (!authorized) {
    return null 
  }

  return <>{children}</>
}
