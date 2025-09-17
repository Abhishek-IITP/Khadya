"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { BellIcon } from "./icons";
import { AlertTriangle, Package, Clock, X } from "lucide-react";

interface ExpiredPromotionNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  productName: string;
  productCategory: string;
  promotionName: string;
  endDate: string;
  timestamp: string;
  read: boolean;
}

export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ExpiredPromotionNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const isMobile = useIsMobile();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/notifications/expired-promotions");
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications || []);
        setNotificationCount(data.count || 0);
        setLastFetchTime(new Date());
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await fetch("/api/notifications/expired-promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    setNotificationCount(prev => Math.max(0, prev - 1));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up interval for repeated notifications (3 times, 30 minutes apart)
  useEffect(() => {
    if (notificationCount === 0) return;

    const intervals: NodeJS.Timeout[] = [];
    
    // Schedule 2 more notifications at 30 and 60 minutes
    intervals.push(
      setTimeout(() => {
        if (notificationCount > 0) {
          fetchNotifications();
        }
      }, 30 * 60 * 1000) // 30 minutes
    );
    
    intervals.push(
      setTimeout(() => {
        if (notificationCount > 0) {
          fetchNotifications();
        }
      }, 60 * 60 * 1000) // 60 minutes
    );

    // Cleanup intervals
    return () => {
      intervals.forEach(interval => clearTimeout(interval));
    };
  }, [notificationCount, fetchNotifications]);

  // Auto-refresh notifications every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const formatEndDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);
      }}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />

          {notificationCount > 0 && (
            <span
              className={cn(
                "absolute right-0 top-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[24rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Notifications
          </span>
          {notificationCount > 0 && (
            <span className="rounded-md bg-orange-500 px-[9px] py-0.5 text-xs font-medium text-white">
              {notificationCount} expired
            </span>
          )}
        </div>

        <div className="mb-3 max-h-[23rem] space-y-1.5 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
              <span className="ml-2 text-sm text-gray-600">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-gray-500">
              No expired promotion notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border-l-4 border-orange-500 bg-orange-50 p-3 transition-all duration-300 ${
                  notification.read ? 'opacity-60' : 'opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-semibold text-orange-800">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-orange-600"></span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-orange-700">
                        {notification.message}
                      </p>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-1 text-xs text-orange-600">
                          <Package className="h-3 w-3" />
                          <span>{notification.productName} ({notification.productCategory})</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-orange-600">
                          <Clock className="h-3 w-3" />
                          <span>Expired: {formatEndDate(notification.endDate)}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="rounded bg-orange-600 px-2 py-1 text-xs font-medium text-white hover:bg-orange-700"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="flex-shrink-0 text-orange-400 hover:text-orange-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {lastFetchTime && (
          <div className="border-t border-gray-200 px-2 py-2">
            <p className="text-xs text-gray-500">
              Last updated: {lastFetchTime.toLocaleTimeString()}
            </p>
          </div>
        )}

        <button
          onClick={() => setIsOpen(false)}
          className="block w-full rounded-lg border border-primary p-2 text-center text-sm font-medium tracking-wide text-primary outline-none transition-colors hover:bg-blue-light-5 focus:bg-blue-light-5 focus:text-primary focus-visible:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-dark-5 dark:hover:bg-dark-3 dark:hover:text-dark-7 dark:focus-visible:border-dark-5 dark:focus-visible:bg-dark-3 dark:focus-visible:text-dark-7"
        >
          Close notifications
        </button>
      </DropdownContent>
    </Dropdown>
  );
}
