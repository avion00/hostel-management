import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
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

const payments = [
  {
    id: "PAY001",
    type: "commission",
    amount: 23500,
    from: "Green Valley Student Hostel",
    date: "2024-03-15",
    status: "completed",
    method: "Bank Transfer",
    transactionId: "TXN123456789",
  },
  {
    id: "PAY002",
    type: "premium",
    amount: 5000,
    from: "Rajesh Kumar",
    date: "2024-03-16",
    status: "completed",
    method: "UPI",
    transactionId: "TXN123456790",
  },
  {
    id: "PAY003",
    type: "commission",
    amount: 17500,
    from: "Urban Living Hostel",
    date: "2024-03-17",
    status: "pending",
    method: "Bank Transfer",
    transactionId: "TXN123456791",
  },
];

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

const AdminPaymentPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Payment Management & Declaration
        </h2>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">Rs.45L</p>
            <p className="text-sm text-slate-600">Total Revenue</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">Rs.4.2L</p>
            <p className="text-sm text-slate-600">Commission Earned</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">Rs.58K</p>
            <p className="text-sm text-slate-600">Pending Payments</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">+18%</p>
            <p className="text-sm text-slate-600">Growth Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={systemStatsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`Rs.${value}`, "Revenue"]} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{payment.from}</p>
                    <p className="text-sm text-slate-600">
                      {payment.type} • {payment.method}
                    </p>
                    <p className="text-sm text-slate-500">
                      {payment.date} • {payment.transactionId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    Rs.{payment.amount.toLocaleString()}
                  </p>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentPage;
