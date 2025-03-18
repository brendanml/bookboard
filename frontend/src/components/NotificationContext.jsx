import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return action.payload;
    case "REMOVE_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationProvider = (props) => {
  const [notification, dispatchNotification] = useReducer(
    notificationReducer,
    null,
  );

  return (
    <NotificationContext.Provider value={[notification, dispatchNotification]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useTimedNotification = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext);
  const setTimedNotification = (message, status, time) => {
    dispatchNotification({
      type: "ADD_NOTIFICATION",
      payload: { message, status },
    });
    setTimeout(() => {
      dispatchNotification({ type: "REMOVE_NOTIFICATION" });
    }, time);
  };
  return [notification, setTimedNotification];
};

export { NotificationContext };
