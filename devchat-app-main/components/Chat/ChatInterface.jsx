"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "@/context/ChatContext"
import MessageList from "./MessageList"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Code, Sparkles } from "lucide-react"
import AIDebugger from "./AIDebugger"

const ChatInterface = () => {
  const { currentChannel, sendMessage, messages, loading } = useChat()
  const [messageText, setMessageText] = useState("")
  const [codeSnippet, setCodeSnippet] = useState("")
  const [isCodeMode, setIsCodeMode] = useState(false)
  const [language, setLanguage] = useState("javascript")
  const [showDebugger, setShowDebugger] = useState(false)
  const messagesEndRef = useRef(null)
  const debuggerRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Hide debugger when code changes
    if (showDebugger) {
      setShowDebugger(false);
    }
  }, [codeSnippet, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (isCodeMode && codeSnippet.trim()) {
      sendMessage({
        type: "code",
        content: codeSnippet,
        language,
      })
      setCodeSnippet("")
      setShowDebugger(false)
    } else if (messageText.trim()) {
      sendMessage({
        type: "text",
        content: messageText,
      })
      setMessageText("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleDebugClick = () => {
    if (codeSnippet.trim()) {
      setShowDebugger(true);
      setTimeout(() => {
        debuggerRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }

  if (!currentChannel) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to DevChat</h2>
          <p className="text-muted-foreground mb-4">Select a channel to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="border-b px-4 py-2">
        <h2 className="text-lg font-semibold">#{currentChannel.name}</h2>
        <p className="text-sm text-muted-foreground">{currentChannel.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <Tabs defaultValue="message" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="message" onClick={() => setIsCodeMode(false)} className="flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Message
            </TabsTrigger>
            <TabsTrigger value="code" onClick={() => setIsCodeMode(true)} className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Code Snippet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="message" className="space-y-4">
            <form onSubmit={handleSendMessage} className="flex flex-col space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!messageText.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <label htmlFor="language" className="text-sm font-medium">
                  Language:
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-sm rounded border border-input bg-background px-3 py-1"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="sql">SQL</option>
                </select>
              </div>

              <div className="relative border rounded-md">
                <Textarea
                  placeholder="// Paste your code here..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="font-mono min-h-[200px] p-4"
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDebugClick}
                  disabled={!codeSnippet.trim()}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Debug with AI
                </Button>
                <Button type="button" onClick={handleSendMessage} disabled={!codeSnippet.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Share Code
                </Button>
              </div>
            </div>

            {showDebugger && codeSnippet.trim() && (
              <div ref={debuggerRef} className="mt-4">
                <AIDebugger code={codeSnippet} language={language} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ChatInterface
