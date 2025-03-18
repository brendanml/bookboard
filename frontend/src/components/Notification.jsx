import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

const Notification = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext);
  if (notification === null) return null;
  const color =
    notification.status === "success" ? "bg-blue-500" : "bg-red-500";
  return (
    <div
      className={`${color} text-white p-2 w-1/4 text-center rounded-md shadow-2md`}
    >
      <p>{notification.message}</p>
    </div>
  );
};

export default Notification;
