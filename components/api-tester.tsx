"use client"

import { useState, useEffect, type FormEvent, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  X,
  Loader2,
  Copy,
  Clock,
  HardDrive,
  Search,
  ChevronDown,
  ChevronRight,
  Folder,
  Settings,
  User,
  GitBranch,
  Play,
  Eye,
  List,
  Cookie,
  History,
  FileUp,
  Edit,
  Trash2,
  Key,
  Code,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Syntax Highlighter imports
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism"

type Header = {
  id: number
  key: string
  value: string
}

type FormField = {
  id: number
  key: string
  value: string | File | null
  type: "text" | "file"
}

type EnvVariable = {
  id: number
  key: string
  value: string
}

type BackendApiConfig = {
  url: string
  method: string
  headers?: { key: string; value: string }[]
  bodyType?: "none" | "json" | "formData" | "multipart"
  jsonBody?: string
  formDataFields?: { key: string; value: string; type: "text" | "file" }[]
}

type StoredRequest = {
  id: string
  name: string
  method: string
  url: string
  headers: Header[]
  bodyType: "none" | "json" | "formData" | "multipart"
  jsonBody: string
  formDataFields: FormField[]
  category: string
}

// Import Collection Modal Component
function ImportCollectionModal({
  isOpen,
  onClose,
  onImport,
}: {
  isOpen: boolean
  onClose: () => void
  onImport: (jsonString: string) => void
}) {
  const [importText, setImportText] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText)
      if (!Array.isArray(parsed)) {
        setError("Imported JSON must be an array of requests.")
        return
      }
      onImport(importText)
      setImportText("")
      setError(null)
      onClose()
    } catch (e: any) {
      setError("Invalid JSON format: " + e.message)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 text-gray-100 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-primary">Import Collection</DialogTitle>
          <DialogDescription className="text-gray-400">Paste your collection JSON here</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Paste JSON collection here..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={15}
            className="font-mono bg-gray-900 border-gray-700 text-gray-100 resize-none"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="bg-gray-700 text-gray-100 hover:bg-gray-600">
            Cancel
          </Button>
          <Button onClick={handleImport} className="bg-primary hover:bg-primary/90">
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ApiTesterPage({ initialCollection }: { initialCollection?: any }) {
  const searchParams = useSearchParams()
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts")
  const [method, setMethod] = useState("GET")
  const [headers, setHeaders] = useState<Header[]>([{ id: 1, key: "Content-Type", value: "application/json" }])
  const [bodyType, setBodyType] = useState<"none" | "json" | "formData" | "multipart">("none")
  const [jsonBody, setJsonBody] = useState("")
  const [formDataFields, setFormDataFields] = useState<FormField[]>([{ id: 1, key: "", value: "", type: "text" }])
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([
    { id: 1, key: "BASE_URL", value: "https://jsonplaceholder.typicode.com" },
    { id: 2, key: "AUTH_TOKEN", value: "your-auth-token-here" },
  ])
  const [response, setResponse] = useState<string | null>(null)
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({})
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [responseCookies, setResponseCookies] = useState<string[]>([])
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [responseSize, setResponseSize] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeRequestTab, setActiveRequestTab] = useState("body")
  const [activeResponseTab, setActiveResponseTab] = useState("preview")

  // Dynamic Request Management State
  const [requests, setRequests] = useState<StoredRequest[]>([])
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const loadRequest = useCallback((request: StoredRequest) => {
    setUrl(request.url)
    setMethod(request.method)
    setHeaders(request.headers.map((h, i) => ({ ...h, id: i + 1 })))
    setBodyType(request.bodyType)
    setJsonBody(request.jsonBody)
    setFormDataFields(request.formDataFields.map((f, i) => ({ ...f, id: i + 1 })))
    setSelectedRequestId(request.id)
    setResponse(null)
    setResponseHeaders({})
    setStatusCode(null)
    setResponseCookies([])
    setResponseTime(null)
    setResponseSize(null)
    setError(null)
    toast({
      title: "Request Loaded",
      description: `Loaded "${request.name}" configuration.`,
    })
  }, [])

  // Auto-switch to body tab when method changes to POST, PUT, PATCH, DELETE
  useEffect(() => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      setActiveRequestTab("body")
      if (bodyType === "none") {
        setBodyType("json") // Default to JSON for these methods
      }
    }
  }, [method, bodyType])

  // Effect to pre-populate form from URL query params
  useEffect(() => {
    const configParam = searchParams.get("config")
    if (configParam) {
      try {
        const config: BackendApiConfig = JSON.parse(decodeURIComponent(configParam))
        const tempRequest: StoredRequest = {
          id: `project-loaded-${Date.now()}`,
          name: "Project API Request",
          method: config.method || "GET",
          url: config.url || "",
          headers: config.headers?.map((h, i) => ({ ...h, id: i + 1 })) || [],
          bodyType: config.bodyType || "none",
          jsonBody: config.jsonBody || "",
          formDataFields: config.formDataFields?.map((f, i) => ({ ...f, id: i + 1 })) || [],
          category: "Project Imports",
        }
        setRequests((prev) => {
          const existingIndex = prev.findIndex((req) => req.id.startsWith("project-loaded-"))
          if (existingIndex > -1) {
            return prev.map((req, idx) => (idx === existingIndex ? tempRequest : req))
          }
          return [...prev, tempRequest]
        })
        loadRequest(tempRequest)
        toast({
          title: "Configuration Loaded",
          description: "Request pre-filled from project configuration.",
        })
      } catch (e) {
        console.error("Failed to parse backend config from URL:", e)
        toast({
          title: "Error Loading Config",
          description: "Could not load request configuration from URL.",
          variant: "destructive",
        })
      }
    }
  }, [searchParams])

  // Add this useEffect after the existing useEffects
  useEffect(() => {
    if (initialCollection?.collection) {
      const collection = initialCollection.collection

      // Add environment variables
      if (collection.envVariables) {
        setEnvVariables(collection.envVariables.map((env: any, i: number) => ({ ...env, id: i + 1 })))
      }

      // Add requests to the collection
      if (collection.requests) {
        const importedRequests = collection.requests.map((req: any, i: number) => ({
          ...req,
          id: `imported-${Date.now()}-${i}`,
          category: req.category || collection.name || "Imported Collection",
          headers: req.headers?.map((h: any, j: number) => ({ ...h, id: j + 1 })) || [],
          formDataFields: req.formDataFields?.map((f: any, j: number) => ({ ...f, id: j + 1 })) || [],
        }))

        setRequests(importedRequests)

        // Load the first request
        if (importedRequests.length > 0) {
          loadRequest(importedRequests[0])
        }

        toast({
          title: "Collection Loaded",
          description: `${collection.name} API collection loaded with ${importedRequests.length} endpoints.`,
        })
      }
    }
  }, [initialCollection])

  const applyEnvVariables = useCallback(
    (input: string) => {
      let processedInput = input
      envVariables.forEach((env) => {
        if (env.key) {
          const regex = new RegExp(`\\{\\{${env.key}\\}\\}`, "g")
          processedInput = processedInput.replace(regex, env.value)
        }
      })
      return processedInput
    },
    [envVariables],
  )

  const handleAddHeader = () => {
    setHeaders([...headers, { id: Date.now(), key: "", value: "" }])
  }

  const handleRemoveHeader = (id: number) => {
    setHeaders(headers.filter((header) => header.id !== id))
  }

  const handleHeaderChange = (id: number, field: "key" | "value", value: string) => {
    setHeaders(headers.map((header) => (header.id === id ? { ...header, [field]: value } : header)))
  }

  const handleAddFormField = (type: "text" | "file") => {
    setFormDataFields([...formDataFields, { id: Date.now(), key: "", value: null, type }])
  }

  const handleRemoveFormField = (id: number) => {
    setFormDataFields(formDataFields.filter((field) => field.id !== id))
  }

  const handleFormFieldChange = (id: number, key: string, value: string) => {
    setFormDataFields(formDataFields.map((field) => (field.id === id ? { ...field, key, value } : field)))
  }

  const handleFileChange = (id: number, file: File | null) => {
    setFormDataFields(formDataFields.map((field) => (field.id === id ? { ...field, value: file } : field)))
  }

  const handleAddEnvVariable = () => {
    setEnvVariables([...envVariables, { id: Date.now(), key: "", value: "" }])
  }

  const handleRemoveEnvVariable = (id: number) => {
    setEnvVariables(envVariables.filter((env) => env.id !== id))
  }

  const handleEnvVariableChange = (id: number, field: "key" | "value", value: string) => {
    setEnvVariables(envVariables.map((env) => (env.id === id ? { ...env, [field]: value } : env)))
  }

  const clearRequest = () => {
    setUrl("https://jsonplaceholder.typicode.com/posts")
    setMethod("GET")
    setHeaders([{ id: 1, key: "Content-Type", value: "application/json" }])
    setBodyType("none")
    setJsonBody("")
    setFormDataFields([{ id: 1, key: "", value: "", type: "text" }])
    setResponse(null)
    setResponseHeaders({})
    setStatusCode(null)
    setResponseCookies([])
    setResponseTime(null)
    setResponseSize(null)
    setError(null)
    setSelectedRequestId(null)
    toast({
      title: "Request Cleared",
      description: "All request fields have been reset.",
    })
  }

  const addRequest = () => {
    const newRequest: StoredRequest = {
      id: `new-req-${Date.now()}`,
      name: "New Request",
      method: "GET",
      url: "",
      headers: [],
      bodyType: "none",
      jsonBody: "",
      formDataFields: [],
      category: "My Requests",
    }
    setRequests((prev) => [...prev, newRequest])
    loadRequest(newRequest)
    toast({
      title: "New Request Added",
      description: "A new empty request has been added to your collection.",
    })
  }

  const renameRequest = (id: string, newName: string) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, name: newName } : req)))
    toast({
      title: "Request Renamed",
      description: `Request renamed to "${newName}".`,
    })
  }

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((req) => req.id !== id))
    if (selectedRequestId === id) {
      clearRequest()
    }
    toast({
      title: "Request Deleted",
      description: "Request removed from collection.",
    })
  }

  const handleImportCollection = (jsonString: string) => {
    try {
      const importedRequests: StoredRequest[] = JSON.parse(jsonString)
      const newRequests = importedRequests.map((req) => ({
        ...req,
        id: `imported-${Date.now()}-${req.id || Math.random().toString(36).substring(7)}`,
        category: req.category || "Imported Collection",
        headers: req.headers?.map((h, i) => ({ ...h, id: i + 1 })) || [],
        formDataFields: req.formDataFields?.map((f, i) => ({ ...f, id: i + 1 })) || [],
      }))
      setRequests((prev) => [...prev, ...newRequests])
      toast({
        title: "Collection Imported",
        description: `${newRequests.length} requests added to your collection.`,
      })
    } catch (e: any) {
      toast({
        title: "Import Failed",
        description: `Error parsing JSON: ${e.message}`,
        variant: "destructive",
      })
    }
  }

  const beautifyJson = () => {
    try {
      const parsed = JSON.parse(jsonBody)
      setJsonBody(JSON.stringify(parsed, null, 2))
      setError(null)
      toast({
        title: "JSON Beautified",
        description: "Request body formatted.",
      })
    } catch (e: any) {
      setError("Invalid JSON: " + e.message)
      toast({
        title: "Invalid JSON",
        description: "Could not beautify. Please check your JSON syntax.",
        variant: "destructive",
      })
    }
  }

  const sendRequest = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponse(null)
    setResponseHeaders({})
    setStatusCode(null)
    setResponseCookies([])
    setResponseTime(null)
    setResponseSize(null)
    setError(null)

    const startTime = Date.now()

    try {
      const processedUrl = applyEnvVariables(url)
      const requestHeaders = new Headers()

      headers.forEach((h) => {
        if (h.key && h.value) {
          requestHeaders.append(applyEnvVariables(h.key), applyEnvVariables(h.value))
        }
      })

      let requestBody: BodyInit | null = null

      if (method !== "GET" && method !== "HEAD") {
        if (bodyType === "json") {
          try {
            JSON.parse(applyEnvVariables(jsonBody))
          } catch (e: any) {
            throw new Error("Invalid JSON in request body: " + e.message)
          }
          requestBody = applyEnvVariables(jsonBody)
          if (!requestHeaders.has("Content-Type")) {
            requestHeaders.set("Content-Type", "application/json")
          }
        } else if (bodyType === "formData") {
          const params = new URLSearchParams()
          formDataFields.forEach((field) => {
            if (field.key && typeof field.value === "string") {
              params.append(applyEnvVariables(field.key), applyEnvVariables(field.value))
            }
          })
          requestBody = params.toString()
          if (!requestHeaders.has("Content-Type")) {
            requestHeaders.set("Content-Type", "application/x-www-form-urlencoded")
          }
        } else if (bodyType === "multipart") {
          const formData = new FormData()
          formDataFields.forEach((field) => {
            if (field.key) {
              if (field.type === "text" && typeof field.value === "string") {
                formData.append(applyEnvVariables(field.key), applyEnvVariables(field.value))
              } else if (field.type === "file" && field.value instanceof File) {
                formData.append(applyEnvVariables(field.key), field.value)
              }
            }
          })
          requestBody = formData
          requestHeaders.delete("Content-Type")
        }
      }

      const res = await fetch(processedUrl, {
        method,
        headers: requestHeaders,
        body: requestBody,
      })

      const endTime = Date.now()
      setResponseTime(endTime - startTime)
      setStatusCode(res.status)

      const resHeaders: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        resHeaders[key] = value
      })
      setResponseHeaders(resHeaders)

      const setCookieHeader = res.headers.get("set-cookie")
      if (setCookieHeader) {
        setResponseCookies(setCookieHeader.split(",").map((cookie) => cookie.split(";")[0].trim()))
      } else {
        setResponseCookies([])
      }

      const contentType = res.headers.get("content-type")
      const responseText = await res.text()
      setResponseSize(new TextEncoder().encode(responseText).length)

      if (contentType && contentType.includes("application/json")) {
        try {
          const json = JSON.parse(responseText)
          setResponse(JSON.stringify(json, null, 2))
        } catch (parseError) {
          setResponse(responseText)
          console.warn("Failed to parse JSON response, showing as plain text.", parseError)
        }
      } else {
        setResponse(responseText)
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.")
      toast({
        title: "Request Failed",
        description: err.message || "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string | null) => {
    if (text) {
      navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      })
    }
  }

  // Group requests by category for sidebar display
  const groupedRequests = requests.reduce(
    (acc, request) => {
      if (!acc[request.category]) {
        acc[request.category] = []
      }
      acc[request.category].push(request)
      return acc
    },
    {} as Record<string, StoredRequest[]>,
  )

  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-800 bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">API Catalog</h2>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-100">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-3 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Filter requests..."
              className="w-full rounded-lg bg-gray-700 pl-8 text-sm focus:ring-0 focus:border-transparent border-transparent"
            />
          </div>
          <div className="flex justify-between mt-3">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100">
              <List className="h-4 w-4 mr-1" /> Sort
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100" onClick={addRequest}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-100"
              onClick={() => setIsImportModalOpen(true)}
            >
              <FileUp className="h-4 w-4 mr-1" /> Import
            </Button>
          </div>
        </div>

        {/* Request List */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 custom-scrollbar">
          {Object.entries(groupedRequests).length === 0 && (
            <p className="text-gray-500 text-center text-sm mt-4">No requests yet. Add one!</p>
          )}
          {Object.entries(groupedRequests).map(([category, requestsInCat]) => (
            <div key={category} className="mb-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-gray-100 px-2 py-1.5 text-sm font-medium"
                onClick={() =>
                  setCollapsedCategories((prev) => {
                    const newSet = new Set(prev)
                    if (newSet.has(category)) {
                      newSet.delete(category)
                    } else {
                      newSet.add(category)
                    }
                    return newSet
                  })
                }
              >
                {collapsedCategories.has(category) ? (
                  <ChevronRight className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-2" />
                )}
                <Folder className="h-4 w-4 mr-2 text-yellow-500" />
                {category}
              </Button>
              {!collapsedCategories.has(category) && (
                <div className="ml-4">
                  {requestsInCat.map((request) => (
                    <div key={request.id} className="flex items-center group">
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex-1 justify-start text-sm px-2 py-1.5 truncate",
                          selectedRequestId === request.id
                            ? "bg-primary/20 text-primary hover:bg-primary/30"
                            : "text-gray-300 hover:bg-gray-700 hover:text-gray-100",
                        )}
                        onClick={() => loadRequest(request)}
                      >
                        <span
                          className={cn(
                            "font-bold mr-2 w-10 text-left",
                            request.method === "GET" && "text-green-500",
                            request.method === "POST" && "text-yellow-500",
                            request.method === "PUT" && "text-blue-500",
                            request.method === "DELETE" && "text-red-500",
                            request.method === "PATCH" && "text-purple-500",
                          )}
                        >
                          {request.method}
                        </span>
                        {request.name}
                      </Button>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-gray-100"
                          onClick={() => {
                            const newName = prompt("Enter new name for request:", request.name)
                            if (newName) renameRequest(request.id, newName)
                          }}
                          aria-label="Rename request"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:text-red-300"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${request.name}"?`)) {
                              deleteRequest(request.id)
                            }
                          }}
                          aria-label="Delete request"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-gray-900">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-800">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">API Tester / Request Builder</span>
            <Tabs defaultValue="design">
              <TabsList className="bg-gray-700">
                <TabsTrigger
                  value="design"
                  className="data-[state=active]:bg-gray-600 data-[state=active]:text-gray-100"
                >
                  DESIGN
                </TabsTrigger>
                <TabsTrigger
                  value="debug"
                  className="data-[state=active]:bg-gray-600 data-[state=active]:text-gray-100"
                >
                  DEBUG
                </TabsTrigger>
                <TabsTrigger value="test" className="data-[state=active]:bg-gray-600 data-[state=active]:text-gray-100">
                  TEST
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100">
              <GitBranch className="h-4 w-4 mr-1" /> main
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-100">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-100">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Request & Response Panels */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* Request Panel */}
          <div className="flex flex-col border-r border-gray-800 p-4 overflow-y-auto custom-scrollbar">
            <div className="flex gap-2 mb-4">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-[120px] flex-shrink-0 bg-gray-700 border-gray-600 text-gray-100">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                  {["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"].map((m) => (
                    <SelectItem key={m} value={m} className="hover:bg-gray-600">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="url"
                placeholder="Enter API URL (e.g., {{BASE_URL}}/users)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-grow bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                aria-label="API URL"
              />
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={sendRequest}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">Send</span>
              </Button>
            </div>

            {/* Request Tabs */}
            <Tabs
              defaultValue="body"
              value={activeRequestTab}
              onValueChange={setActiveRequestTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-b border-gray-700 rounded-none">
                <TabsTrigger
                  value="body"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary text-gray-300 hover:text-gray-100"
                >
                  <Code className="h-4 w-4 mr-1" />
                  Body
                </TabsTrigger>
                <TabsTrigger
                  value="headers"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary text-gray-300 hover:text-gray-100"
                >
                  <List className="h-4 w-4 mr-1" />
                  Headers
                </TabsTrigger>
                <TabsTrigger
                  value="env"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary text-gray-300 hover:text-gray-100"
                >
                  <Key className="h-4 w-4 mr-1" />
                  Environment
                </TabsTrigger>
                <TabsTrigger
                  value="auth"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary text-gray-300 hover:text-gray-100"
                >
                  Auth
                </TabsTrigger>
                <TabsTrigger
                  value="query"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary text-gray-300 hover:text-gray-100"
                >
                  Query
                </TabsTrigger>
              </TabsList>

              <TabsContent value="body" className="mt-0 flex-1 flex flex-col p-0">
                <div className="flex justify-between items-center p-2 border-b border-gray-800 bg-gray-800">
                  <Select
                    value={bodyType}
                    onValueChange={(value: "none" | "json" | "formData" | "multipart") => setBodyType(value)}
                  >
                    <SelectTrigger className="w-[200px] bg-gray-700 border-gray-600 text-gray-100">
                      <SelectValue placeholder="Select Body Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-gray-100 border-gray-600">
                      <SelectItem value="none" className="hover:bg-gray-600">
                        None
                      </SelectItem>
                      <SelectItem value="json" className="hover:bg-gray-600">
                        Raw JSON
                      </SelectItem>
                      <SelectItem value="formData" className="hover:bg-gray-600">
                        Form Data (URL-encoded)
                      </SelectItem>
                      <SelectItem value="multipart" className="hover:bg-gray-600">
                        Form Data (multipart/form-data)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {bodyType === "json" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={beautifyJson}
                      className="text-gray-400 hover:text-gray-100"
                    >
                      Beautify / Validate JSON
                    </Button>
                  )}
                </div>

                {error && error.includes("JSON") && (
                  <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-2 text-sm" role="alert">
                    {error}
                  </div>
                )}

                {bodyType === "json" && (
                  <Textarea
                    placeholder='Enter JSON body (e.g., { "name": "John Doe", "email": "john@example.com" })'
                    value={jsonBody}
                    onChange={(e) => {
                      setJsonBody(e.target.value)
                      setError(null)
                    }}
                    rows={15}
                    className="flex-1 font-mono text-sm bg-gray-900 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-4"
                    aria-label="JSON Request Body"
                  />
                )}

                {(bodyType === "formData" || bodyType === "multipart") && (
                  <div className="flex-1 space-y-3 p-4 overflow-y-auto custom-scrollbar">
                    {formDataFields.map((field) => (
                      <div key={field.id} className="flex gap-2 items-center">
                        <Input
                          placeholder="Key"
                          value={field.key}
                          onChange={(e) =>
                            handleFormFieldChange(
                              field.id,
                              e.target.value,
                              typeof field.value === "string" ? field.value : "",
                            )
                          }
                          className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                          aria-label="Form Field Key"
                        />
                        {field.type === "text" ? (
                          <Input
                            placeholder="Value"
                            value={typeof field.value === "string" ? field.value : ""}
                            onChange={(e) => handleFormFieldChange(field.id, field.key, e.target.value)}
                            className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                            aria-label="Form Field Value"
                          />
                        ) : (
                          <Input
                            type="file"
                            onChange={(e) => handleFileChange(field.id, e.target.files ? e.target.files[0] : null)}
                            className="bg-gray-800 border-gray-700 text-gray-100 file:text-gray-100 file:bg-gray-700 file:border-none"
                            aria-label="Form File Input"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFormField(field.id)}
                          aria-label="Remove form field"
                          className="text-gray-400 hover:text-gray-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddFormField("text")}
                        className="flex-1 bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Text Field
                      </Button>
                      {bodyType === "multipart" && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddFormField("file")}
                          className="flex-1 bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add File Field
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {bodyType === "none" && (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No request body for this method.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="headers" className="mt-0 flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                  {headers.map((header) => (
                    <div key={header.id} className="flex gap-2 items-center">
                      <Input
                        placeholder="Header Key (e.g., Authorization)"
                        value={header.key}
                        onChange={(e) => handleHeaderChange(header.id, "key", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                        aria-label="Header Key"
                      />
                      <Input
                        placeholder="Header Value (e.g., Bearer {{AUTH_TOKEN}})"
                        value={header.value}
                        onChange={(e) => handleHeaderChange(header.id, "value", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                        aria-label="Header Value"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHeader(header.id)}
                        aria-label="Remove header"
                        className="text-gray-400 hover:text-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddHeader}
                    className="w-full bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Header
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="env" className="mt-0 flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">Environment Variables</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Use variables in your requests with the format:{" "}
                    <code className="bg-gray-800 px-1 rounded">{"{{VARIABLE_NAME}}"}</code>
                  </p>
                </div>
                <div className="space-y-3">
                  {envVariables.map((env) => (
                    <div key={env.id} className="flex gap-2 items-center">
                      <Input
                        placeholder="Variable Key (e.g., BASE_URL)"
                        value={env.key}
                        onChange={(e) => handleEnvVariableChange(env.id, "key", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                        aria-label="Environment Variable Key"
                      />
                      <Input
                        placeholder="Variable Value (e.g., https://api.example.com)"
                        value={env.value}
                        onChange={(e) => handleEnvVariableChange(env.id, "value", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                        aria-label="Environment Variable Value"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEnvVariable(env.id)}
                        aria-label="Remove environment variable"
                        className="text-gray-400 hover:text-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddEnvVariable}
                    className="w-full bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Environment Variable
                  </Button>
                </div>
              </TabsContent>

              {/* Placeholder Tabs */}
              <TabsContent
                value="auth"
                className="mt-0 flex-1 flex flex-col p-4 text-gray-400 justify-center items-center"
              >
                <p>Authentication settings go here.</p>
                <p className="text-sm mt-2">Bearer Token, API Key, OAuth, etc.</p>
              </TabsContent>
              <TabsContent
                value="query"
                className="mt-0 flex-1 flex flex-col p-4 text-gray-400 justify-center items-center"
              >
                <p>Query parameters go here.</p>
                <p className="text-sm mt-2">URL parameters like ?page=1&limit=10</p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Response Panel */}
          <div className="flex flex-col p-4 overflow-y-auto custom-scrollbar">
            {/* Response Summary Bar */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              {statusCode && (
                <Badge
                  className={cn(
                    "px-3 py-1 rounded-full font-semibold",
                    statusCode >= 200 && statusCode < 300 ? "bg-green-600 text-white" : "bg-red-600 text-white",
                  )}
                >
                  {statusCode} {statusCode >= 200 && statusCode < 300 ? "OK" : "Error"}
                </Badge>
              )}
              {responseTime !== null && (
                <div className="flex items-center text-gray-400">
                  <Clock className="h-4 w-4 mr-1" /> {responseTime} ms
                </div>
              )}
              {responseSize !== null && (
                <div className="flex items-center text-gray-400">
                  <HardDrive className="h-4 w-4 mr-1" /> {(responseSize / 1024).toFixed(2)} KB
                </div>
              )}
              <div className="text-gray-400 ml-auto">Last Updated: Just now</div>
            </div>

            {error && !error.includes("JSON") && (
              <div
                className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {/* Response Tabs */}
            <Tabs
              defaultValue="preview"
              value={activeResponseTab}
              onValueChange={setActiveResponseTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-b border-gray-700 rounded-none">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary text-gray-300 hover:text-gray-100"
                >
                  <Eye className="h-4 w-4 mr-1" /> Preview
                </TabsTrigger>
                <TabsTrigger
                  value="headers"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary text-gray-300 hover:text-gray-100"
                >
                  <List className="h-4 w-4 mr-1" /> Headers
                </TabsTrigger>
                <TabsTrigger
                  value="cookies"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary text-gray-300 hover:text-gray-100"
                >
                  <Cookie className="h-4 w-4 mr-1" /> Cookies
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary text-gray-300 hover:text-gray-100"
                >
                  <History className="h-4 w-4 mr-1" /> Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-0 flex-1 flex flex-col p-0">
                {response && (
                  <div className="relative flex-1">
                    {(() => {
                      try {
                        JSON.parse(response)
                        return (
                          <SyntaxHighlighter
                            language="json"
                            style={dark}
                            customStyle={{
                              background: "#111827",
                              padding: "1rem",
                              margin: "0",
                              height: "100%",
                              overflow: "auto",
                              fontSize: "0.875rem",
                            }}
                            codeTagProps={{
                              style: {
                                fontFamily: "monospace",
                              },
                            }}
                          >
                            {response}
                          </SyntaxHighlighter>
                        )
                      } catch (e) {
                        return (
                          <Textarea
                            readOnly
                            value={response}
                            rows={15}
                            className="flex-1 font-mono text-sm bg-gray-900 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-4"
                            aria-label="API Response Body"
                          />
                        )
                      }
                    })()}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
                      onClick={() => copyToClipboard(response)}
                      aria-label="Copy response body"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {!response && !loading && !error && (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Send a request to see the response here.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="headers" className="mt-0 flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                {Object.keys(responseHeaders).length > 0 ? (
                  <Table className="border border-gray-700 rounded-md text-gray-300">
                    <TableHeader className="bg-gray-800">
                      <TableRow>
                        <TableHead className="w-[120px] text-gray-400">Key</TableHead>
                        <TableHead className="text-gray-400">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(responseHeaders).map(([key, value]) => (
                        <TableRow key={key} className="border-gray-700 hover:bg-gray-800">
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell className="break-all">{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">No response headers.</div>
                )}
              </TabsContent>

              <TabsContent value="cookies" className="mt-0 flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar">
                {responseCookies.length > 0 ? (
                  <Table className="border border-gray-700 rounded-md text-gray-300">
                    <TableHeader className="bg-gray-800">
                      <TableRow>
                        <TableHead className="text-gray-400">Cookie</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {responseCookies.map((cookie, index) => (
                        <TableRow key={index} className="border-gray-700 hover:bg-gray-800">
                          <TableCell className="break-all">{cookie}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">No cookies received.</div>
                )}
              </TabsContent>

              <TabsContent
                value="timeline"
                className="mt-0 flex-1 flex flex-col p-4 text-gray-400 justify-center items-center"
              >
                <p>Request timeline details go here.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <ImportCollectionModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportCollection}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  )
}
