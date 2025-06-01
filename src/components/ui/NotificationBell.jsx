import { useState, useEffect } from 'react';
import axios from '@/api/axios';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Không thể lấy thông báo', error);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) fetchNotifications();
  };

  return (
    <div className="relative">
      <button onClick={handleBellClick} className="relative">
        🔔
        {notifications.some(n => !n.is_read) && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">!</span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded p-2 z-50">
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-sm">Không có thông báo</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="border-b py-2">
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-gray-600">{n.message}</div>
                <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
