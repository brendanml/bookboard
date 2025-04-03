// NotificationBadge.js
import { useTimedNotification } from "../contexts/NotificationContext"

const NotificationBadge = () => {
  const { notification, fadeOut } = useTimedNotification()
  // Determine background color based on notification status
  const backgroundColor =
    notification?.status === "success"
      ? "bg-[var(--primary-c)]"
      : "bg-[var(--color-remove)]"

  return (
    <div
      className={`h-10 w-full flex items-center justify-center text-white text-center px-4 rounded-md
        transition-opacity duration-500 ease-in-out ${backgroundColor}
        ${notification && !fadeOut ? "opacity-100" : "opacity-0"}`}
    >
      <p>{notification && notification.message}</p>
    </div>
  )
}

export default NotificationBadge
