import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  Calendar,
  CheckCircle,
  DollarSign,
  Home,
  TrendingUp,
  User,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statsData = [
  { name: "Jan", bookings: 2, amount: 15000 },
  { name: "Feb", bookings: 1, amount: 8500 },
  { name: "Mar", bookings: 3, amount: 22000 },
  { name: "Apr", bookings: 2, amount: 16000 },
  { name: "May", bookings: 1, amount: 9500 },
  { name: "Jun", bookings: 2, amount: 18000 },
];

const expenseData = [
  { name: "Rent", value: 12000, color: "#6366f1" },
  { name: "Food", value: 3000, color: "#8b5cf6" },
  { name: "Transport", value: 1500, color: "#06b6d4" },
  { name: "Others", value: 2000, color: "#10b981" },
];

const UserOverviewPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 space-y-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-slate-900">12</p>
                <p className="text-sm text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +2 this month
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Spent
                </p>
                <p className="text-3xl font-bold text-slate-900">₹89,500</p>
                <p className="text-sm text-slate-500 mt-1">Last 6 months</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Active Booking
                </p>
                <p className="text-3xl font-bold text-slate-900">1</p>
                <p className="text-sm text-blue-600 mt-1">
                  Green Valley Hostel
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg h-[178px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Notifications
                </p>
                <p className="text-3xl font-bold text-slate-900">2</p>
                <p className="text-sm text-amber-600 mt-1">Unread messages</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Payment completed",
                description: "Monthly rent for Green Valley Hostel",
                time: "2 hours ago",
                icon: CheckCircle,
                color: "text-emerald-500",
              },
              {
                action: "Booking confirmed",
                description: "Elite Student Residence booking confirmed",
                time: "1 day ago",
                icon: Calendar,
                color: "text-blue-500",
              },
              {
                action: "Profile updated",
                description: "Emergency contact information updated",
                time: "3 days ago",
                icon: User,
                color: "text-purple-500",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg"
              >
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-slate-600">
                    {activity.description}
                  </p>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UserOverviewPage;
