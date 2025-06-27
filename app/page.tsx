"use client"

import type React from "react"
import type {Chat, Message as ChatMessage } from "@/lib/generated/prisma"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChefHat,
  Send,
  Clock,
  Users,
  Scale,
  Thermometer,
  MessageCircle,
  History,
  BookOpen,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Timer,
  Calculator,
  Lightbulb,
  Shield,
  Star,
  CheckCircle,
} from "lucide-react"

const quickPrompts = [
  { icon: Scale, text: "Scale this recipe for 50 people", category: "Scaling" },
  { icon: Clock, text: "Best timing for a 5-course meal?", category: "Timing" },
  { icon: Thermometer, text: "Safe internal temps for proteins", category: "Safety" },
  { icon: Users, text: "Substitute for heavy cream in sauce", category: "Substitution" },
]

const features = [
  {
    icon: Scale,
    title: "Recipe Scaling",
    description: "Instantly scale recipes up or down for any number of servings with precise measurements.",
  },
  {
    icon: Timer,
    title: "Kitchen Timing",
    description: "Get perfect timing coordination for complex multi-course meals and prep schedules.",
  },
  {
    icon: Calculator,
    title: "Cost Analysis",
    description: "Calculate food costs, portion sizes, and optimize your kitchen budget efficiently.",
  },
  {
    icon: Lightbulb,
    title: "Technique Tips",
    description: "Master professional cooking techniques with step-by-step guidance and troubleshooting.",
  },
  {
    icon: Shield,
    title: "Food Safety",
    description: "Stay compliant with food safety standards, temperatures, and storage guidelines.",
  },
  {
    icon: BookOpen,
    title: "Recipe Library",
    description: "Build and organize your personal collection of recipes, notes, and cooking references.",
  },
]

const testimonials = [
  {
    name: "Marcus Chen",
    role: "Sous Chef at Le Bernardin",
    content:
      "SousChef AI has revolutionized how I manage prep and scaling. It's like having a culinary calculator that actually understands cooking.",
    rating: 5,
  },
  {
    name: "Sarah Rodriguez",
    role: "Executive Sous Chef",
    content: "The timing coordination feature is incredible. I can plan entire banquet services with confidence now.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Kitchen Manager",
    content: "Perfect for training new cooks and maintaining consistency across all our dishes. Highly recommended.",
    rating: 5,
  },
]

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

interface Recipe {
  id: string
  title: string
  description: string
  timestamp: Date
}

async function getGeminiResponse(prompt: string){
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
  const data = await res.json()
  return data.text
}

// Use Chat and ChatMessage in your types:
type ChatWithMessages = Chat & { messages: ChatMessage[] }

export default function SousChefBot() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState<"chat" | "history" | "recipes">("chat")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [history, setHistory] = useState<ChatWithMessages[]>([])

  const isSignedIn = !!session

  // Fetch chat history when user signs in or switches to history view
  useEffect(() => {
    if (isSignedIn && currentView === "history") {
      fetch("/api/chat")
        .then(res => res.json())
        .then(data => setHistory(Array.isArray(data) ? data : []))
        .catch(() => setHistory([]))
    }
  }, [isSignedIn, currentView])

  // Save chat to DB after each conversation (when a new assistant message is added)
  useEffect(() => {
    if (
      isSignedIn &&
      messages.length > 1 &&
      messages[messages.length - 1]?.role === "assistant"
    ) {
      const title = messages[0]?.content?.slice(0, 40) || "Chat"
      fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          messages,
        }),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, messages.length, messages[messages.length - 1]?.role])

  // Handler functions
  const handleSignIn = () => {
    signIn("google")
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
    setMessages([])
    setCurrentView("chat")
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const aiContent = await getGeminiResponse(userMessage.content)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't get a response from the assistant.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-amber-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ChefHat className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-amber-600 rounded-lg">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">SousChef AI</h1>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {isSignedIn ? (
                <>
                  <Button
                    variant={currentView === "chat" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView("chat")}
                    className="text-slate-300 hover:text-white h-8 text-xs"
                  >
                    <MessageCircle className="h-3 w-3 mr-1.5" />
                    Chat
                  </Button>
                  <Button
                    variant={currentView === "history" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView("history")}
                    className="text-slate-300 hover:text-white h-8 text-xs"
                  >
                    <History className="h-3 w-3 mr-1.5" />
                    History
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-7 w-7 rounded-full">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={session.user?.image || ""}  />
                          <AvatarFallback className="bg-amber-600 text-white text-xs">
                            {session.user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800" align="end">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium text-white">{session.user?.name}</p>
                        <p className="text-xs text-slate-400">{session.user?.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-slate-800" />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={handleSignIn}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white h-8 text-xs"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {sidebarOpen && (
            <div className="md:hidden py-3 border-t border-slate-800">
              {isSignedIn ? (
                <div className="space-y-1">
                  <div className="space-y-1">
                    <Button
                      variant={currentView === "chat" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setCurrentView("chat")
                        setSidebarOpen(false)
                      }}
                      className="w-full justify-start text-slate-300 hover:text-white h-8"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    <Button
                      variant={currentView === "history" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setCurrentView("history")
                        setSidebarOpen(false)
                      }}
                      className="w-full justify-start text-slate-300 hover:text-white h-8"
                    >
                      <History className="h-4 w-4 mr-2" />
                      History
                    </Button>
                    <Button
                      variant={currentView === "recipes" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setCurrentView("recipes")
                        setSidebarOpen(false)
                      }}
                      className="w-full justify-start text-slate-300 hover:text-white h-8"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Recipes
                    </Button>
                  </div>
                  <div className="border-t border-slate-800 pt-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-slate-300 hover:text-white h-8"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start text-slate-300 hover:text-white h-8"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleSignIn}
                  size="sm"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white h-8"
                >
                  Sign In
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {!isSignedIn ? (
          <div>
            {/* Hero Section */}
            <div className="text-center py-12 mb-16">
              <div className="p-6 bg-amber-600 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <ChefHat className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Welcome to SousChef AI</h2>
              <p className="text-slate-300 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
                Your professional kitchen assistant powered by AI. Get expert help with recipe scaling, cooking
                techniques, timing coordination, and everything you need to excel in the kitchen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleSignIn} size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Get Started - Sign In
                </Button>
              </div>
            </div>
            {/* Features Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-white mb-4">Everything You Need for Professional Cooking</h3>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Streamline your kitchen operations with AI-powered assistance designed specifically for culinary
                  professionals.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-slate-900 border-slate-800 hover:border-amber-500 transition-colors">
                    <CardContent className="p-6">
                      <div className="p-3 bg-amber-600 rounded-lg w-fit mb-4">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            {/* Testimonials Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-white mb-4">Trusted by Professional Chefs</h3>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  See what culinary professionals are saying about SousChef AI.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-amber-500 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-300 mb-4 italic">"{testimonial.content}"</p>
                      <div>
                        <p className="text-white font-medium">{testimonial.name}</p>
                        <p className="text-slate-400 text-sm">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            {/* CTA Section */}
            <div className="text-center py-12 bg-slate-900 rounded-lg border border-slate-800">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Kitchen?</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Join thousands of professional chefs who are already using SousChef AI to streamline their kitchen
                operations and improve their culinary skills.
              </p>
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500" />
                  <span className="text-slate-300 text-sm">Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500" />
                  <span className="text-slate-300 text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-500" />
                  <span className="text-slate-300 text-sm">Instant access</span>
                </div>
              </div>
              <Button onClick={handleSignIn} size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
                Start Cooking Smarter Today
              </Button>
            </div>
          </div>
        ) : (
          <>
            {currentView === "chat" && (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome back, {session.user?.name?.split(" ")[0]}!
                  </h2>
                  <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Ask me about recipes, techniques, scaling, timing, and any culinary questions.
                  </p>
                </div>
                {/* Quick Prompts */}
                {messages.length === 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-slate-200">
                      Get started with these common questions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quickPrompts.map((prompt, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-slate-900 border-slate-800 hover:border-amber-500 hover:bg-slate-850"
                          onClick={() => handleQuickPrompt(prompt.text)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-600 rounded-lg">
                                <prompt.icon className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white mb-1">{prompt.text}</p>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-slate-800 text-slate-300 hover:bg-slate-800"
                                >
                                  {prompt.category}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {/* Chat Interface */}
                <Card className="shadow-lg bg-slate-900 border-slate-800">
                  <CardHeader className="bg-slate-900 border-b border-slate-800">
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <MessageCircle className="h-5 w-5 text-amber-400" />
                      Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Messages */}
                    <ScrollArea className="h-96 p-6">
                      {messages.length === 0 ? (
                        <div className="text-center text-slate-400 mt-12">
                          <div className="p-4 bg-slate-800 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <ChefHat className="h-10 w-10 text-amber-400" />
                          </div>
                          <p className="text-lg font-medium text-slate-300 mb-2">Ready to help in the kitchen</p>
                          <p className="text-sm text-slate-400">
                            Ask me about recipes, techniques, scaling, or any cooking questions.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                  message.role === "user"
                                    ? "bg-amber-600 text-white"
                                    : "bg-slate-800 text-slate-100 border border-slate-700"
                                }`}
                              >
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                              </div>
                            </div>
                          ))}
                          {isLoading && (
                            <div className="flex justify-start">
                              <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="animate-pulse h-2 w-2 bg-amber-400 rounded-full"></div>
                                  <div className="animate-pulse h-2 w-2 bg-amber-400 rounded-full animation-delay-200"></div>
                                  <div className="animate-pulse h-2 w-2 bg-amber-400 rounded-full animation-delay-400"></div>
                                  <span className="text-slate-300 text-sm ml-2">Thinking...</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </ScrollArea>
                    {/* Input Form */}
                    <div className="border-t border-slate-800 p-4 bg-slate-900">
                      <form onSubmit={handleSubmit} className="flex gap-3">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask about recipes, techniques, scaling, timing..."
                          className="flex-1 border-slate-700 focus:border-amber-500 bg-slate-800 text-white placeholder:text-slate-400"
                          disabled={isLoading}
                        />
                        <Button
                          type="submit"
                          disabled={isLoading || !input.trim()}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-4"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {currentView === "history" && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Chat History</h2>
                  <p className="text-slate-300">Review your previous conversations</p>
                </div>
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <p className="text-slate-400">No chat history found.</p>
                  ) : (
                    history.map((chat) => (
                      <Card
                        key={chat.id}
                        className="bg-slate-900 border-slate-800 hover:border-amber-500 cursor-pointer transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-white mb-1">{chat.title}</h3>
                              <p className="text-sm text-slate-400 mb-2">
                                {chat.messages?.[chat.messages.length - 1]?.content || ""}
                              </p>
                              <p className="text-xs text-slate-500">
                                  {new Date(chat.updatedAt ?? Date.now()).toLocaleDateString()}
                              </p>

                            </div>
                            <MessageCircle className="h-5 w-5 text-amber-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-xs text-slate-500">
            Professional kitchen assistant &bull; Always verify food safety guidelines
          </p>
        </div>
      </div>
    </div>
  )
}
