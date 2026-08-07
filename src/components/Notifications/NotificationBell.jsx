import { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: notificationsRes, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axiosSecure.get('/notifications');
      return res.data;
    },
    refetchInterval: 30000,
  });

  const notifications = notificationsRes?.data || [];
  const unreadCount = notificationsRes?.meta?.unreadCount || 0;

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await axiosSecure.patch('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 rounded-xl hover:bg-[#F5F7F8] transition-colors text-[#45474B] flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#495E57]/10 z-50 animate-[slideDown_0.2s_ease-out]">
          <div className="px-5 py-4 border-b border-[#495E57]/10 bg-gradient-to-br from-[#F5F7F8] to-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#45474B]">Notifications</h3>
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllReadMutation.mutate()}
                className="text-xs text-[#495E57] hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-6 text-center text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">No notifications yet</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`p-4 transition-colors flex items-start justify-between gap-3 ${
                    !item.read ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#45474B]">{item.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}{' '}
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => markReadMutation.mutate(item._id)}
                      className="p-1 text-gray-400 hover:text-[#495E57] transition-colors"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
