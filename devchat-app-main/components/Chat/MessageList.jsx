import MessageItem from "./MessageItem"

const MessageList = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p>No messages yet</p>
        <p className="text-sm">Be the first to send a message!</p>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground">{date}</span>
            <div className="flex-grow border-t"></div>
          </div>

          {dateMessages.map((message, index) => (
            <MessageItem key={message.id || index} message={message} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default MessageList
