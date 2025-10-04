"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DonationForm from "@/components/Payment/DonationForm"
import { useAuth } from "@/context/AuthContext"

export default function DonatePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Support DevChat</h1>
          <p className="text-lg text-muted-foreground">
            Your donation helps us continue to improve DevChat and provide better services to developers worldwide.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Why Donate?</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">🚀</span>
                  <span>Help us develop new features</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🛠️</span>
                  <span>Support ongoing maintenance and improvements</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🌐</span>
                  <span>Keep DevChat free for everyone</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💻</span>
                  <span>Contribute to the developer community</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Where Your Money Goes</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Server Costs</span>
                    <span>40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Development</span>
                    <span>35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>AI Services</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Community Support</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "10%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <DonationForm />
          </div>
        </div>
      </div>
    </div>
  )
}
