"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "./AuthContext"
import { initializeApp, getApps } from "firebase/app"
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  limit,
} from "firebase/firestore"

// Initialize Firebase only if it hasn't been initialized already
let app
let db

if (typeof window !== 'undefined') {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  db = getFirestore(app)
}

const ChatContext = createContext()

export const useChat = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const [channels, setChannels] = useState([])
  const [currentChannel, setCurrentChannel] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [loadingChannels, setLoadingChannels] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState([])

  // Fetch Channels
  useEffect(() => {
    if (!db || loadingChannels === false) return

    setLoadingChannels(true)
    const channelsRef = collection(db, 'channels')
    const q = query(channelsRef, orderBy('name', 'asc'))

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const channelList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setChannels(channelList)
        
        if (!currentChannel && channelList.length > 0) {
          setCurrentChannel(channelList[0])
        }
        setLoadingChannels(false)
      },
      (error) => {
        console.error("Error fetching channels:", error)
        setLoadingChannels(false)
      }
    )

    return unsubscribe
  }, [currentChannel])

  // Load Messages for Current Channel
  useEffect(() => {
    if (!db || !currentChannel?.id || !user?.uid) {
      setMessages([])
      setLoadingMessages(false)
      return
    }

    setLoadingMessages(true)
    const messagesRef = collection(db, 'channels', currentChannel.id, 'messages')
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(50))

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const messageList = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
          }
        })
        setMessages(messageList)
        setLoadingMessages(false)
      },
      (error) => {
        console.error(`Error fetching messages for ${currentChannel.id}:`, error)
        setLoadingMessages(false)
      }
    )

    setOnlineUsers([
      { uid: "user1", displayName: "Alice Johnson", status: "online" },
      { uid: user.uid, displayName: user.displayName || "You", status: "online" },
    ])

    return unsubscribe
  }, [currentChannel?.id, user?.uid])

  // Send a Message
  const sendMessage = useCallback(async (messageData) => {
    if (!db || !currentChannel?.id || !user?.uid) {
      throw new Error("Cannot send message: No current channel or user.")
    }

    const messagesRef = collection(db, 'channels', currentChannel.id, 'messages')

    try {
      await addDoc(messagesRef, {
        sender: {
          uid: user.uid,
          displayName: user.displayName || "Anonymous",
          photoURL: user.photoURL || "/placeholder.svg?height=40&width=40",
        },
        content: messageData.content,
        type: messageData.type || "text",
        language: messageData.language || null,
        timestamp: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }, [currentChannel?.id, user])

  // Create a New Channel
  const createChannel = useCallback(async (channelData) => {
    if (!db || !channelData?.name || !channelData?.description) {
      throw new Error("Channel name and description are required")
    }

    const channelId = channelData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, '')
    
    const channelRef = doc(db, 'channels', channelId)

    try {
      await setDoc(channelRef, {
        name: channelData.name,
        description: channelData.description,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || 'unknown',
      })
      return channelId
    } catch (error) {
      console.error("Error creating channel:", error)
      throw error
    }
  }, [user?.uid])

  const value = {
    channels,
    currentChannel,
    setCurrentChannel,
    messages,
    loading: loadingChannels || loadingMessages,
    onlineUsers,
    sendMessage,
    createChannel,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatContext