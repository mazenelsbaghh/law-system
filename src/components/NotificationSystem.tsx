import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  className?: string;
}

const notificationIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info
};

const notificationColors = {
  success: 'text-success bg-success/10 border-success/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  error: 'text-destructive bg-destructive/10 border-destructive/20',
  info: 'text-info bg-info/10 border-info/20'
};

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  className = ""
}) => {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('crm-notifications', []);
  const [isOpen, setIsOpen] = useState(false);

  // إضافة تنبيهات تلقائية
  useEffect(() => {
    const checkForNotifications = () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      // تنبيهات المهام المستحقة
      const tasksDue = JSON.parse(localStorage.getItem('crm-tasks') || '[]')
        .filter((task: any) => {
          const dueDate = new Date(task.dueDate);
          return dueDate <= tomorrow && task.status !== 'completed';
        });

      if (tasksDue.length > 0) {
        const currentNotifications = JSON.parse(localStorage.getItem('crm-notifications') || '[]');
        const existingNotification = currentNotifications.find((n: Notification) => n.id === 'tasks-due-reminder');
        if (!existingNotification) {
          addNotification({
            type: 'warning',
            title: 'مهام مستحقة',
            message: `لديك ${tasksDue.length} مهمة مستحقة خلال 24 ساعة`,
          });
        }
      }

      // تنبيهات السبونسر منتهية الصلاحية
      const expiredSponsors = JSON.parse(localStorage.getItem('crm-sponsors') || '[]')
        .filter((sponsor: any) => sponsor.usedCases >= sponsor.packageSize);

      if (expiredSponsors.length > 0) {
        const currentNotifications = JSON.parse(localStorage.getItem('crm-notifications') || '[]');
        const existingNotification = currentNotifications.find((n: Notification) => n.id === 'sponsors-expired');
        if (!existingNotification) {
          addNotification({
            type: 'error',
            title: 'سبونسر انتهت باقاتهم',
            message: `${expiredSponsors.length} سبونسر استنفدوا باقاتهم`,
          });
        }
      }
    };

    checkForNotifications();
    const interval = setInterval(checkForNotifications, 60000); // كل دقيقة

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // احتفظ بآخر 50 تنبيه
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`relative ${className}`}>
      {/* زر التنبيهات */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-bounce-gentle"
            variant="destructive"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* قائمة التنبيهات */}
      {isOpen && (
        <Card className="absolute left-0 top-12 w-80 max-w-[90vw] z-50 shadow-lg animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-arabic">التنبيهات</CardTitle>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs h-7"
                >
                  مسح الكل
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm font-arabic">
                لا توجد تنبيهات جديدة
              </div>
            ) : (
              <ScrollArea className="h-80">
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => {
                    const IconComponent = notificationIcons[notification.type];
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-muted/50 ${
                          !notification.read ? 'bg-muted/30' : ''
                        } ${notificationColors[notification.type]}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-medium font-arabic">
                                {notification.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="h-5 w-5 opacity-60 hover:opacity-100"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <p className="text-xs text-muted-foreground font-arabic">
                              {notification.message}
                            </p>
                            
                            <p className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>

                            {notification.action && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action?.onClick();
                                }}
                                className="h-7 text-xs mt-2"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};