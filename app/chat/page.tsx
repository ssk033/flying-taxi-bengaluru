"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat } from "lucide-react"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders()
      setProviders(response)
    }
    setUpProviders()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="text-center">
          <div className="p-3 bg-amber-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome to SousChef AI</CardTitle>
          <p className="text-slate-400">Sign in to access your kitchen assistant</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {providers &&
            Object.values(providers).map((provider: any) => (
              <Button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: "/chat" })}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                size="lg"
              >
                Sign in with {provider.name}
              </Button>
            ))}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}