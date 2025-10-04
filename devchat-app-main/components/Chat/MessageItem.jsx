import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import CodeSnippet from "./CodeSnippet"
import UserPresence from "./UserPresence"

const MessageItem = ({ message }) => {
  const { sender, content, timestamp, type, language } = message

  const formattedTime = timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : "just now"

  return (
    <div className="flex items-start space-x-4">
      <Avatar>
        <AvatarImage src={sender.photoURL || `/placeholder.svg?height=40&width=40`} alt={sender.displayName} />
        <AvatarFallback>{sender.displayName?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center">
          <span className="font-medium">{sender.displayName}</span>
          <UserPresence status={sender.status} />
          <span className="text-xs text-muted-foreground ml-2">{formattedTime}</span>
        </div>

        {type === "code" ? (
          <Card className="p-0 overflow-hidden">
            <CodeSnippet code={content} language={language || "javascript"} />
          </Card>
        ) : (
          <div className="text-sm whitespace-pre-wrap">{content}</div>
        )}
      </div>
    </div>
  )
}

export default MessageItem
