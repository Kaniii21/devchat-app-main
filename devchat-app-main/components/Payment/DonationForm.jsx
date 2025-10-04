"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart } from "lucide-react";
import StripeElements from "./StripeElements.jsx";

const DONATION_AMOUNTS = [5, 10, 25, 50, 100];

export default function DonationForm() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [error, setError] = useState("");

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setError("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      setError("");
    }
  };

  const handleContinue = () => {
    const amount = selectedAmount || Number.parseFloat(customAmount);
    if (!amount || amount < 1) {
      setError("Please enter a valid donation amount (minimum $1)");
      return;
    }
    setShowStripeForm(true);
  };

  const handlePaymentSuccess = () => {
    router.push("/donate/success");
  };

  const handleCancel = () => {
    setShowStripeForm(false);
  };

  const finalAmount = selectedAmount || (customAmount ? Number.parseFloat(customAmount) : 0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Support DevChat</CardTitle>
        <CardDescription className="text-center">
          Your donation helps us improve and maintain the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showStripeForm ? (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="donation-amount">Select an amount</Label>
                <RadioGroup
                  id="donation-amount"
                  className="grid grid-cols-3 gap-4 mt-2"
                  value={selectedAmount?.toString()}
                  onValueChange={(value) => handleAmountSelect(Number.parseInt(value))}
                >
                  {DONATION_AMOUNTS.map((amount) => (
                    <div key={amount}>
                      <RadioGroupItem value={amount.toString()} id={`amount-${amount}`} className="peer sr-only" />
                      <Label
                        htmlFor={`amount-${amount}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                      >
                        ${amount}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-amount">Or enter a custom amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id="custom-amount"
                    type="text"
                    placeholder="Enter amount"
                    className="pl-7"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                  />
                </div>
              </div>

              {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
            </div>
          </>
        ) : (
          <StripeElements
            amount={finalAmount}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
          />
        )}
      </CardContent>
      {!showStripeForm && (
        <CardFooter>
          <Button className="w-full" onClick={handleContinue} disabled={!selectedAmount && !customAmount}>
            <Heart className="mr-2 h-4 w-4" />
            Continue to Payment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
