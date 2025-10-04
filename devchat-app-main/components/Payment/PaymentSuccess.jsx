import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

const PaymentSuccess = ({ transactionId }) => {
  return (
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
            <div className="flex justify-between py-1">
              <span>Transaction ID:</span>
              <span>{transactionId || `DCH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Payment Method:</span>
              <span>Credit Card</span>
            </div>
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
  )
}

export default PaymentSuccess
