import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function saveDonation(
  userId: string,
  paymentIntentId: string,
  amount: number,
  status: string
) {
  try {
    const donationsRef = collection(db, "donations")
    await addDoc(donationsRef, {
      userId,
      paymentIntentId,
      amount,
      status,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error saving donation:", error)
    throw error
  }
} 