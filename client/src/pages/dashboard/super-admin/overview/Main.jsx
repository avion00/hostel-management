import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const systemStatsData = [
  {
    month: "Jan",
    users: 4200,
    owners: 180,
    revenue: 2500000,
    properties: 450,
  },
  {
    month: "Feb",
    users: 4800,
    owners: 210,
    revenue: 2800000,
    properties: 520,
  },
  {
    month: "Mar",
    users: 5400,
    owners: 240,
    revenue: 3200000,
    properties: 580,
  },
  {
    month: "Apr",
    users: 6100,
    owners: 280,
    revenue: 3600000,
    properties: 640,
  },
  {
    month: "May",
    users: 6800,
    owners: 320,
    revenue: 4100000,
    properties: 720,
  },
  {
    month: "Jun",
    users: 7500,
    owners: 360,
    revenue: 4500000,
    properties: 800,
  },
];

const revenueBreakdown = [
  { name: "Commission", value: 65, color: "#6366f1" },
  { name: "Premium Features", value: 20, color: "#8b5cf6" },
  { name: "Advertising", value: 10, color: "#06b6d4" },
  { name: "Other", value: 5, color: "#10b981" },
];

const cityDistribution = [
  { city: "Delhi", users: 1500, properties: 180 },
  { city: "Mumbai", users: 1200, properties: 150 },
  { city: "Bangalore", users: 1100, properties: 140 },
  { city: "Pune", users: 900, properties: 120 },
  { city: "Chennai", users: 800, properties: 100 },
  { city: "Hyderabad", users: 700, properties: 90 },
];

const systemActivities = [
  {
    id: 1,
    type: "user_registration",
    description: "New student registered: Arjun Mehta",
    timestamp: "2 minutes ago",
    severity: "info",
  },
  {
    id: 2,
    type: "property_approval",
    description: "Property approved: Elite Student Residence",
    timestamp: "15 minutes ago",
    severity: "success",
  },
  {
    id: 3,
    type: "payment_failed",
    description: "Payment failed for booking BK12345",
    timestamp: "1 hour ago",
    severity: "warning",
  },
  {
    id: 4,
    type: "security_alert",
    description: "Multiple failed login attempts detected",
    timestamp: "2 hours ago",
    severity: "error",
  },
];

const getSeverityColor = (severity) => {
  switch (severity) {
    case "error":
      return "text-red-600";
    case "warning":
      return "text-amber-600";
    case "success":
      return "text-emerald-600";
    case "info":
      return "text-blue-600";
    default:
      return "text-slate-600";
  }
};

const getSeverityIcon = (severity) => {
  switch (severity) {
    case "error":
      return <AlertTriangle className="w-4 h-4" />;
    case "warning":
      return <Clock className="w-4 h-4" />;
    case "success":
      return <CheckCircle className="w-4 h-4" />;
    case "info":
      return <Activity className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "active":
    case "approved":
    case "completed":
    case "verified":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "suspended":
    case "rejected":
    case "failed":
      return "bg-red-100 text-red-700";
    case "inactive":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const AdminOverviewPage = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-slate-900">7,500</p>
                <p className="text-sm text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Properties
                </p>
                <p className="text-3xl font-bold text-slate-900">800</p>
                <p className="text-sm text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Monthly Revenue
                </p>
                <p className="text-3xl font-bold text-slate-900">Rs.45L</p>
                <p className="text-sm text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +18% from last month
                </p>
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
                  Active Bookings
                </p>
                <p className="text-3xl font-bold text-slate-900">2,340</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -3% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={systemStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="#6366f1"
                  fill="#6366f1"
                />
                <Area
                  type="monotone"
                  dataKey="owners"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
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
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* City Distribution */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>City-wise Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#6366f1" name="Users" />
              <Bar dataKey="properties" fill="#8b5cf6" name="Properties" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Recent System Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg"
              >
                <div className={getSeverityColor(activity.severity)}>
                  {getSeverityIcon(activity.severity)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {activity.description}
                  </p>
                  <p className="text-sm text-slate-500">{activity.timestamp}</p>
                </div>
                <Badge className={getStatusColor(activity.severity)}>
                  {activity.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewPage;
