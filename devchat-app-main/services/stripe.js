import { db } from "../services/firebase"
import { collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore"

// Helper function to format amount in cents for Stripe
export const formatAmountForStripe = (amount, currency) => {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

// Create a payment intent
export const createPaymentIntent = async (amount, currency = "USD", metadata = {}) => {
  const response = await fetch("/api/create-stripe-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: formatAmountForStripe(amount, currency),
      currency,
      metadata,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  return response.json()
}

// Save donation to Firestore
export const saveDonation = async (userId, paymentIntentId, amount, status = "completed") => {
  try {
    const donationRef = await addDoc(collection(db, "donations"), {
      userId,
      paymentIntentId,
      amount,
      status,
      created: new Date(),
    })
    return donationRef.id
  } catch (error) {
    console.error("Error saving donation:", error)
    throw error
  }
}

// Get user donations
export const getUserDonations = async (userId) => {
  try {
    const donationsRef = collection(db, "donations")
    const q = query(donationsRef, where("userId", "==", userId), orderBy("created", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created: doc.data().created.toDate(),
    }))
  } catch (error) {
    console.error("Error fetching donations:", error)
    return []
  }
}
