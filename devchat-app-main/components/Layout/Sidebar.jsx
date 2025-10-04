"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import ChannelList from "@/components/Chat/ChannelList"
import { BarChart, Heart, Home, MessageSquare, Settings, User } from "lucide-react"

const Sidebar = () => {
  const { user } = useAuth()
  const pathname = usePathname()

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      variant: "ghost",
    },
    {
      label: "Chat",
      icon: MessageSquare,
      href: "/chat",
      variant: "ghost",
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
      variant: "ghost",
    },
    {
      label: "Analytics",
      icon: BarChart,
      href: "/analytics",
      variant: "ghost",
    },
    {
      label: "Donate",
      icon: Heart,
      href: "/donate",
      variant: "ghost",
    },
  ]

  if (!user) {
    return null
  }

  return (
    <div className="group flex h-full w-60 flex-col border-r bg-background">
      <div className="p-2">
        <div className="flex h-12 items-center px-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
            </svg>
            <span>DevChat</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="px-1 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navigation</h2>
            <div className="space-y-1">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : route.variant}
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={route.href}>
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <Separator className="my-2" />
          <ChannelList />
        </ScrollArea>
      </div>
      <div className="mt-auto p-4">
        <Separator className="mb-4" />
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
