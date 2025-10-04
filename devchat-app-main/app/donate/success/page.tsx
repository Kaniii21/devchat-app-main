"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface PaymentDetails {
  id: string
  amount: number
  date: string
  last4: string
}

export default function DonationSuccessPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)

  useEffect(() => {
    // Check for payment_intent_client_secret in URL to verify it's a redirect from Stripe
    const isStripeRedirect = searchParams.get("payment_intent_client_secret")
    
    // Only redirect to login if not loading, no user, and not a Stripe redirect
    if (!loading && !user && !isStripeRedirect) {
      router.push("/auth/login")
      return
    }

    // Try to get payment details from session storage
    try {
      const storedDetails = sessionStorage.getItem("paymentDetails")
      if (storedDetails) {
        setPaymentDetails(JSON.parse(storedDetails))
      }
    } catch (error) {
      console.error("Error reading payment details:", error)
    }
  }, [user, loading, router, searchParams])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
          <CardDescription>Your donation has been successfully processed</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your support helps us continue to improve DevChat and provide better services to developers worldwide.
          </p>
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium">Transaction Details</p>
            <div className="mt-2 text-sm text-muted-foreground">
              {paymentDetails ? (
                <>
                  <div className="flex justify-between py-1">
                    <span>Transaction ID:</span>
                    <span>{paymentDetails.id}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Amount:</span>
                    <span>${paymentDetails.amount}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Date:</span>
                    <span>{new Date(paymentDetails.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Card:</span>
                    <span>•••• {paymentDetails.last4}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-2">
                  Payment successful! Thank you for your donation.
                </div>
              )}
            </div>
          </div>
          <p className="text-sm">A receipt has been sent to your email address.</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/chat">Return to Chat</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
