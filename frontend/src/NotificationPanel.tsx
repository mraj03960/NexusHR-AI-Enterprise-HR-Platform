import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import api from "./api";

type Notification = {
  id?: number;
  username?: string;
  message: string;
  type?: string;
  readStatus?: boolean;
  createdAt?: string;
};

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const username = localStorage.getItem("username") || "";

  const loadNotifications = async () => {
    if (!username) return;

    try {
      const response = await api.get(`/notifications/${username}`);
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const client = new Client({
      brokerURL: "ws://localhost:8082/ws",
      reconnectDelay: 5000
    });

    client.onConnect = () => {
      client.subscribe("/topic/notifications", (message) => {
        const notification = JSON.parse(message.body);

        setNotifications((current) => [
          notification,
          ...current
        ]);
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [username]);

  const markAsRead = async (id?: number) => {
    if (!id) return;

    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, readStatus: true }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="panel">
      <div className="panel-title">
        <h2>Notifications</h2>
        <button onClick={loadNotifications}>Refresh</button>
      </div>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <div>
          {notifications.map((notification, index) => (
            <div
              key={notification.id ?? index}
              className="notification-item"
            >
              <strong>
                {notification.type || "Notification"}
              </strong>

              <p>{notification.message}</p>

              {notification.createdAt && (
                <small>{notification.createdAt}</small>
              )}

              {notification.id && !notification.readStatus && (
                <button onClick={() => markAsRead(notification.id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
