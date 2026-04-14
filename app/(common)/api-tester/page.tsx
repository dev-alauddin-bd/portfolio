"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ApiTesterPage from "@/components/api-tester"

export default function ApiTesterPageWrapper() {
  const searchParams = useSearchParams()
  const [initialCollection, setInitialCollection] = useState(null)

  useEffect(() => {
    const collectionParam = searchParams.get("collection")
    if (collectionParam) {
      try {
        const collection = JSON.parse(decodeURIComponent(collectionParam))
        setInitialCollection(collection)
      } catch (error) {
        console.error("Failed to parse collection parameter:", error)
      }
    }
  }, [searchParams])

  return <ApiTesterPage initialCollection={initialCollection} />
}
