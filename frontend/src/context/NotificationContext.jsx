import {
  useCallback,
  useMemo,
  useState,
} from "react";

import NotificationContext
  from "./NotificationContext";


function NotificationProvider({
  children,
}) {
  const [
    notifications,
    setNotifications,
  ] = useState([]);


  const removeNotification =
    useCallback(
      (id) => {
        setNotifications(
          (
            currentNotifications
          ) =>
            currentNotifications.filter(
              (
                notification
              ) =>
                notification.id !==
                id
            )
        );
      },
      []
    );


  const showNotification =
    useCallback(
      (
        message,
        type = "info",
        duration = 4000
      ) => {
        const id =
          `${Date.now()}-${Math.random()}`;


        const notification = {
          id,
          message,
          type,
        };


        setNotifications(
          (
            currentNotifications
          ) => [
            ...currentNotifications,
            notification,
          ]
        );


        if (duration > 0) {
          window.setTimeout(
            () => {
              removeNotification(
                id
              );
            },
            duration
          );
        }


        return id;
      },
      [
        removeNotification,
      ]
    );


  const showSuccess =
    useCallback(
      (
        message,
        duration
      ) => {
        return showNotification(
          message,
          "success",
          duration
        );
      },
      [
        showNotification,
      ]
    );


  const showError =
    useCallback(
      (
        message,
        duration
      ) => {
        return showNotification(
          message,
          "error",
          duration
        );
      },
      [
        showNotification,
      ]
    );


  const showWarning =
    useCallback(
      (
        message,
        duration
      ) => {
        return showNotification(
          message,
          "warning",
          duration
        );
      },
      [
        showNotification,
      ]
    );


  const showInfo =
    useCallback(
      (
        message,
        duration
      ) => {
        return showNotification(
          message,
          "info",
          duration
        );
      },
      [
        showNotification,
      ]
    );


  const contextValue =
    useMemo(
      () => ({
        notifications,
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification,
      }),
      [
        notifications,
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification,
      ]
    );


  return (
    <NotificationContext.Provider
      value={
        contextValue
      }
    >
      {children}
    </NotificationContext.Provider>
  );
}


export default NotificationProvider;