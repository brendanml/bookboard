import { useContext } from "react"
import { NotificationContext } from "../contexts/NotificationContext"

const NotificationBanner = () => {
  const [notification] = useContext(NotificationContext)

  if (!notification) return null

  const color =
    notification?.status === "success"
      ? "bg-[var(--primary-c)]"
      : "bg-[var(--color-remove)]"

  return (
    <div
      className={`w-full flex items-center justify-center text-white text-center
        transition-opacity duration-500 ease-in-out h-10 ${notification ? `opacity-100 ${color}` : "opacity-0"}
        `}
    >
      {notification && <p>{notification.message}</p>}
    </div>
  )
}

export default NotificationBanner
