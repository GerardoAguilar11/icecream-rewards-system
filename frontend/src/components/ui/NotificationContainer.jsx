import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  useNotification,
} from "../../context/useNotification";


const NOTIFICATION_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
};


function NotificationContainer() {
  const {
    notifications,
    removeNotification,
  } = useNotification();


  if (
    notifications.length === 0
  ) {
    return null;
  }


  return (
    <div
      className="notification-container"
      aria-live="polite"
      aria-atomic="false"
    >
      {notifications.map(
        (
          notification
        ) => {
          const Icon =
            NOTIFICATION_ICONS[
              notification.type
            ] ?? Info;


          return (
            <div
              key={
                notification.id
              }
              className={
                `notification-toast notification-${notification.type}`
              }
              role={
                notification.type ===
                "error"
                  ? "alert"
                  : "status"
              }
            >

              <div className="notification-icon">
                <Icon
                  size={20}
                />
              </div>


              <div className="notification-content">

                <span className="notification-title">
                  {
                    notification.type ===
                      "success"
                      ? "Correcto"
                      : notification.type ===
                          "error"
                        ? "Error"
                        : notification.type ===
                            "warning"
                          ? "Atención"
                          : "Información"
                  }
                </span>


                <p>
                  {
                    notification.message
                  }
                </p>

              </div>


              <button
                type="button"
                className="notification-close"
                onClick={() =>
                  removeNotification(
                    notification.id
                  )
                }
                aria-label="Cerrar notificación"
              >
                <X
                  size={18}
                />
              </button>

            </div>
          );
        }
      )}
    </div>
  );
}


export default NotificationContainer;