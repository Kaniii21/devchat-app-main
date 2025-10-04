"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm.jsx";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripeElements({ amount, onSuccess, onCancel }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!amount || typeof amount !== "number" || amount <= 0) {
        setError("Invalid payment amount.");
        setLoading(false);
        return;
      }

      console.log("Creating payment for amount:", amount);

      try {
        const response = await fetch("/api/create-payment-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
          const text = await response.text(); // ✅ now valid because the function is async
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Payment Intent Error:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Ensure loading state is reset
      }
    };

    createPaymentIntent();
  }, [amount]);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#6366f1",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8A8.009 8.009 0 0 1 12 20z"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error:", error);
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <p>Please try again later.</p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }
  if (clientSecret && stripePromise) {
    return (
      <div className="w-full">
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      </div>
    );
  } else if (clientSecret && !stripePromise) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-600 rounded-md">
        <p>Stripe is not loaded. Please try again later.</p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }  

  else if (!clientSecret) {
    return (
      <div className="w-full">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
          </Elements>
        )}
      </div>
    );
  }
}
