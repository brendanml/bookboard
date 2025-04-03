import { createContext, useReducer, useContext, useState } from "react"

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return action.payload
    case "REMOVE_NOTIFICATION":
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationProvider = (props) => {
  const [notification, dispatchNotification] = useReducer(
    notificationReducer,
    null,
  )

  return (
    <NotificationContext.Provider value={[notification, dispatchNotification]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useTimedNotification = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext)

  const setTimedNotification = (message, status, time) => {
    // Reset fadeOut state when adding a new notification
    console.log("Setting notification:", message, status, time)
    dispatchNotification({
      type: "ADD_NOTIFICATION",
      payload: { message, status },
    })

    // setTimeout(() => {
    //   setFadeOut(true) // Start fade-out effect
    // }, time - 500) // Fade out starts 500ms before the removal time

    setTimeout(() => {
      dispatchNotification({ type: "REMOVE_NOTIFICATION" })
    }, time)
  }

  return { notification, setTimedNotification }
}

export { NotificationContext }
