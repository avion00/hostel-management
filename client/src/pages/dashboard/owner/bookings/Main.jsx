import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  Edit,
  Eye,
  Filter,
  Mail,
  MoreVertical,
  Phone,
} from "lucide-react";

const bookings = [
  {
    id: "BK001",
    studentName: "Priya Sharma",
    property: "Green Valley Student Hostel",
    roomNumber: "A-101",
    checkIn: "2024-01-15",
    checkOut: "2024-06-15",
    amount: 8500,
    status: "active",
    studentPhone: "+91 98765 43210",
    studentEmail: "priya.sharma@email.com",
  },
  {
    id: "BK002",
    studentName: "Rahul Kumar",
    property: "Urban Living Hostel",
    roomNumber: "B-205",
    checkIn: "2024-02-01",
    checkOut: "2024-07-01",
    amount: 6500,
    status: "active",
    studentPhone: "+91 98765 43211",
    studentEmail: "rahul.kumar@email.com",
  },
  {
    id: "BK003",
    studentName: "Sneha Patel",
    property: "Student Paradise",
    roomNumber: "C-301",
    checkIn: "2024-03-01",
    checkOut: "2024-08-01",
    amount: 4200,
    status: "pending",
    studentPhone: "+91 98765 43212",
    studentEmail: "sneha.patel@email.com",
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

const OwnerBookingPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Booking Management
        </h2>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card
            key={booking.id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {booking.studentName}
                    </h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>
                      <p className="font-medium text-slate-900 mb-1">
                        Property Details
                      </p>
                      <p>{booking.property}</p>
                      <p>Room: {booking.roomNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">
                        Contact Information
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {booking.studentPhone}
                      </p>
                      <p className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {booking.studentEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
                    <span>Check-in: {booking.checkIn}</span>
                    <span>Check-out: {booking.checkOut}</span>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end space-y-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">
                      Rs.{booking.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">/month</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OwnerBookingPage;
