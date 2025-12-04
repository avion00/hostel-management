import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  TrendingUp,
} from "lucide-react";

const payments = [
  {
    id: "PAY001",
    bookingId: "BK001",
    studentName: "Priya Sharma",
    amount: 8500,
    date: "2024-03-15",
    status: "completed",
    method: "UPI",
    property: "Green Valley Student Hostel",
  },
  {
    id: "PAY002",
    bookingId: "BK002",
    studentName: "Rahul Kumar",
    amount: 6500,
    date: "2024-03-16",
    status: "completed",
    method: "Credit Card",
    property: "Urban Living Hostel",
  },
  {
    id: "PAY003",
    bookingId: "BK003",
    studentName: "Sneha Patel",
    amount: 4200,
    date: "2024-03-17",
    status: "pending",
    method: "Bank Transfer",
    property: "Student Paradise",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700";
    case "completed":
      return "bg-slate-100 text-slate-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "maintenance":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const OwnerPaymentPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Payment Management
        </h2>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">Rs.19,200</p>
            <p className="text-sm text-slate-600">Received Today</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">Rs.4,200</p>
            <p className="text-sm text-slate-600">Pending</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">Rs.6.3L</p>
            <p className="text-sm text-slate-600">This Month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">+12%</p>
            <p className="text-sm text-slate-600">Growth</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
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
                    <p className="font-medium text-slate-900">
                      {payment.studentName}
                    </p>
                    <p className="text-sm text-slate-600">{payment.property}</p>
                    <p className="text-sm text-slate-500">
                      {payment.method} • {payment.date}
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

export default OwnerPaymentPage;
