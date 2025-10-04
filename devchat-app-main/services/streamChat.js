// This is a simplified mock of a Stream Chat service
// In a real application, you would use the Stream Chat SDK

class StreamChatService {
  constructor() {
    this.connected = false
    this.user = null
    this.channels = new Map()
    this.listeners = new Map()
  }

  // Connect to Stream Chat
  async connect(user) {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    this.connected = true
    this.user = user

    console.log(`Connected to Stream Chat as ${user.displayName || user.email}`)

    return this
  }

  // Disconnect from Stream Chat
  async disconnect() {
    if (!this.connected) return

    this.connected = false
    this.user = null
    this.channels.clear()
    this.listeners.clear()

    console.log("Disconnected from Stream Chat")
  }

  // Get or create a channel
  async getChannel(channelId, channelName) {
    if (!this.connected) throw new Error("Not connected to Stream Chat")

    if (!this.channels.has(channelId)) {
      // Simulate channel creation delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      this.channels.set(channelId, {
        id: channelId,
        name: channelName,
        messages: [],
        members: new Set([this.user.uid]),
      })
    }

    return this.channels.get(channelId)
  }

  // Send a message to a channel
  async sendMessage(channelId, messageData) {
    if (!this.connected) throw new Error("Not connected to Stream Chat")

    const channel = this.channels.get(channelId)
    if (!channel) throw new Error(`Channel ${channelId} not found`)

    const message = {
      id: Date.now().toString(),
      user: this.user,
      ...messageData,
      createdAt: new Date(),
    }

    channel.messages.push(message)

    // Notify listeners
    if (this.listeners.has(channelId)) {
      this.listeners.get(channelId).forEach((callback) => callback(message))
    }

    return message
  }

  // Listen for new messages in a channel
  onMessage(channelId, callback) {
    if (!this.listeners.has(channelId)) {
      this.listeners.set(channelId, new Set())
    }

    this.listeners.get(channelId).add(callback)

    return () => {
      const listeners = this.listeners.get(channelId)
      if (listeners) {
        listeners.delete(callback)
      }
    }
  }
}

// Create a singleton instance
const streamChat = new StreamChatService()

export default streamChat
