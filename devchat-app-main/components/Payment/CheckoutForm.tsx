"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { saveDonation } from "@/services/stripe"
import { useAuth } from "@/context/AuthContext"
import { PaymentIntent } from "@stripe/stripe-js"

interface CheckoutFormProps {
  amount: number
  onSuccess: (paymentIntent: PaymentIntent) => void
  onCancel: () => void
}

export default function CheckoutForm({ amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !user) {
      return
    }

    setIsLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate/success`,
      },
      redirect: "if_required",
    })

    if (error) {
      setErrorMessage(error.message ?? "An error occurred during payment.")
      setIsLoading(false)
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await saveDonation(user.uid, paymentIntent.id, amount, "completed")

        const paymentDetails = {
          id: paymentIntent.id,
          amount: amount,
          date: new Date().toISOString(),
          last4: "4242", // In a real app, you'd get this from paymentMethod
        }
        sessionStorage.setItem("paymentDetails", JSON.stringify(paymentDetails))

        onSuccess(paymentIntent)
      } catch (err) {
        console.error("Error saving donation:", err)
        setErrorMessage("Payment succeeded but there was an error recording your donation.")
      }
    } else {
      setErrorMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{errorMessage}</div>}

      <div className="flex justify-between space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="w-1/2">
          Back
        </Button>
        <Button type="submit" disabled={isLoading || !stripe || !elements} className="w-1/2">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
              Processing...
            </div>
          ) : (
            `Pay $${amount}`
          )}
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>Your payment is secure. We use Stripe for secure payment processing.</p>
        <p className="mt-1">You'll receive a receipt via email after your donation is processed.</p>
      </div>
    </form>
  )
} 