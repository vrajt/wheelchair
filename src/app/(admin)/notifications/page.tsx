import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockNotifications } from "@/lib/mock-data";
import type { Notification } from "@/types";
import { BellRing, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

// This would be a client component in a real app to handle marking as read
function NotificationsList() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    // In a real app, this would be an API call
    // setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
    console.log(`Marking notification ${id} as read (placeholder).`);
  };

  const markAllAsRead = () => {
    // setNotifications(prev => prev.map(n => ({...n, read: true})));
    console.log("Marking all notifications as read (placeholder).");
  };


  return (
    <>
    <PageTitle title="Notifications">
      <Button onClick={markAllAsRead} variant="outline"><CheckCheck className="mr-2 h-4 w-4" />Mark All As Read</Button>
    </PageTitle>
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
        <CardDescription>Stay updated with the latest activities on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <BellRing className="mx-auto h-12 w-12 mb-2" />
            No new notifications.
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start p-3 rounded-md border transition-colors ${
                    notification.read ? 'bg-muted/50' : 'bg-card hover:bg-muted/30'
                  }`}
                >
                  <BellRing className={`mt-1 h-5 w-5 flex-shrink-0 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
                  <div className="ml-3 flex-grow">
                    <p className={`font-semibold ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.date).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="ml-auto self-start text-xs">
                      Mark as read
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
    </>
  );
}

// For state management, this page effectively becomes a client component if we add state to it.
// For now, let's keep it simple. If we were to add `useState` for notifications directly here,
// we'd mark this 'use client'. Instead, `NotificationsList` handles its own state (mocked).
import React from 'react'; // Needed for NotificationsList state if it were in this file
export default function NotificationsPage() {
  return <NotificationsList />;
}
