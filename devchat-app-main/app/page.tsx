import type { Metadata } from "next"
import HomeClient from "./HomeClient"

export const metadata: Metadata = {
  title: "DevChat - Home",
  description: "Welcome to DevChat - A real-time messaging platform for developers",
}

export default function Home() {
  return <HomeClient />
}
