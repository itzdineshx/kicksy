import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2, AlertCircle, Percent, Gift, Star } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { notificationService } from '../services/notificationService';

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { 
    notifications, 
    getUnreadCount, 
    markNotificationAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAllNotifications,
    addNotification // Add this missing function
  } = useApp();

  const unreadCount = getUnreadCount();

  // Initialize notification service and generate sample notifications
  useEffect(() => {
    // Set the app context for the notification service
    notificationService.appContext = { addNotification };
    
    // Generate sample notifications if none exist
    if (notifications.length === 0) {
      // Start the notification simulation
      notificationService.startNotificationSimulation();
    }

    // Cleanup on unmount
    return () => {
      notificationService.stopNotificationSimulation();
    };
  }, [notifications.length, addNotification]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'discount':
        return <Percent className="w-4 h-4 text-green-500" />;
      case 'price_drop':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'new_event':
        return <Star className="w-4 h-4 text-purple-500" />;
      case 'reminder':
        return <Gift className="w-4 h-4 text-orange-500" />;
      case 'booking_confirmation':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'payment_success':
        return <Gift className="w-4 h-4 text-green-500" />;
      case 'loyalty_reward':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <div 
        className="relative cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear all
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                  <p className="text-sm">We'll notify you about discounts, price drops, and new events!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-blue-50' : ''
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              {notification.action && (
                                <button
                                  onClick={() => {
                                    markNotificationAsRead(notification.id);
                                    // Handle action based on notification type
                                    console.log('Action clicked:', notification.action);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {notification.action}
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    // Navigate to notifications page if it exists
                    console.log('View all notifications');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;