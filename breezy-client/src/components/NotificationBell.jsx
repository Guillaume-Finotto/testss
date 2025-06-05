import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/interaction/users/${user.id}/notifications`);
      setNotifications(response.data.notifications);
    } catch (err) {
      console.error("Erreur fetchNotifications:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (notifId) => {
    try {
      await api.post(`/interaction/notifications/${notifId}/read`);
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    } catch (err) {
      console.error("Erreur markAsRead:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      <button onClick={() => setShowList((prev) => !prev)}>
        🔔{unreadCount > 0 && <span className="text-red-500"> {unreadCount}</span>}
      </button>
      {showList && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-10">
          {notifications.length === 0 ? (
            <p className="p-2">Aucune notification</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 border-b ${n.is_read ? "bg-gray-100" : "bg-white"}`}
              >
                <p className="text-sm">{n.type}</p>
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Marquer comme lu
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
