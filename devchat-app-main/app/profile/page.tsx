"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Navbar from "@/components/Layout/Navbar"
import Sidebar from "@/components/Layout/Sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Camera, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateProfile } from "firebase/auth"
import { db } from "@/services/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function ProfilePage() {
  const { user, authUser, loading } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    } else if (user) {
      setDisplayName(user.displayName || "")
      setPhotoURL(user.authPhotoURL || "")
      setPreviewURL(user.photoURL || "")
    }
  }, [user, loading, router])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 1MB for Firestore)
      if (file.size > 1024 * 1024) {
        setError("Image is too large. Please select an image under 1MB.")
        return
      }
      
      setAvatarFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewURL(url)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsUpdating(true)

    try {
      // Check if we have the Firebase auth user
      if (!authUser) {
        throw new Error("You must be logged in to update your profile")
      }
      
      // First, update auth profile with just the display name (not the image)
      await updateProfile(authUser, { 
        displayName
      })
      
      // Handle avatar and Firestore updates separately
      if (avatarFile) {
        try {
          // Convert file to base64
          const base64Image = await convertToBase64(avatarFile)
          
          // Update user document in Firestore
          const userDocRef = doc(db, "users", authUser.uid)
          await updateDoc(userDocRef, {
            avatarImage: base64Image,
            displayName: displayName,
            updatedAt: new Date()
          })
          
          // Store locally for display
          setPreviewURL(base64Image)
        } catch (error) {
          console.error("Error storing avatar in Firestore:", error)
          throw new Error("Failed to save avatar image")
        }
      } else if (photoURL) {
        // Only update the photoURL in auth if it's a URL and not a base64 string
        if (photoURL.startsWith('http') && photoURL.length < 500) {
          try {
            await updateProfile(authUser, { photoURL })
          } catch (error) {
            console.error("Error updating auth photo URL:", error)
          }
        }
        
        // Update other profile fields in Firestore
        const userDocRef = doc(db, "users", authUser.uid)
        await updateDoc(userDocRef, {
          displayName: displayName,
          photoURL: photoURL,
          updatedAt: new Date()
        })
      }
      
      setSuccess("Profile updated successfully")
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

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
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Update your profile information and how others see you on DevChat</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                        <AvatarImage src={previewURL} alt={displayName} />
                        <AvatarFallback>
                          {displayName?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                        onClick={handleAvatarClick}
                        type="button"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground max-w-[80%] text-center">
                      Click on avatar to upload an image (max 1MB). 
                      Images are stored in your profile data.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted" />
                    <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photoURL">
                      External Avatar URL <span className="text-xs text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="photoURL"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter a URL to an image (use this only if you don't want to upload an image directly)
                    </p>
                  </div>

                  <Button type="submit" disabled={isUpdating} className="w-full">
                    {isUpdating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account security and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">Change your password to keep your account secure</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
