import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const UserPresence = ({ status }) => {
  let statusColor = "bg-gray-400" // Default: offline/unknown
  let statusText = "Offline"

  switch (status) {
    case "online":
      statusColor = "bg-green-500"
      statusText = "Online"
      break
    case "away":
      statusColor = "bg-yellow-500"
      statusText = "Away"
      break
    case "busy":
      statusColor = "bg-red-500"
      statusText = "Do Not Disturb"
      break
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="ml-2 inline-block h-2 w-2 rounded-full ring-1 ring-white/20"
            style={{ backgroundColor: statusColor }}
          ></span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default UserPresence
