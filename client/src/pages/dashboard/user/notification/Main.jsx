import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Bell, CheckCircle } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Payment Due Reminder",
    message: "Your monthly rent payment of ₹8,500 is due on March 15th",
    type: "warning",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Booking Confirmed",
    message: "Your booking at Elite Student Residence has been confirmed",
    type: "success",
    time: "1 day ago",
    read: false,
  },
  {
    id: 3,
    title: "New Hostel Recommendation",
    message: "Check out Student Paradise near your college",
    type: "info",
    time: "3 days ago",
    read: true,
  },
  {
    id: 4,
    title: "Profile Update Required",
    message: "Please update your emergency contact information",
    type: "warning",
    time: "1 week ago",
    read: true,
  },
];

const getNotificationIcon = (type) => {
  switch (type) {
    case "warning":
      return <AlertCircle className="w-5 h-5 text-amber-500" />;
    case "success":
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    case "info":
      return <Bell className="w-5 h-5 text-blue-500" />;
    default:
      return <Bell className="w-5 h-5 text-slate-500" />;
  }
};

const UserNotificationPage = () => {
  return (
    <>
      <div className="flex justify-between items-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
        <Button variant="outline" className="bg-transparent">
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`border-0 shadow-lg transition-all duration-300 ${
              !notification.read
                ? "bg-blue-50 border-l-4 border-l-blue-500"
                : "hover:shadow-xl"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">
                      {notification.title}
                    </h3>
                    <span className="text-sm text-slate-500">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-3">{notification.message}</p>
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default UserNotificationPage;
