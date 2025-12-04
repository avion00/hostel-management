import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Edit, Eye, Home, MapPin } from "lucide-react";

const bookings = [
  {
    id: "BK001",
    hostelName: "Green Valley Student Hostel",
    roomType: "Single Room",
    checkIn: "2024-01-15",
    checkOut: "2024-06-15",
    status: "active",
    amount: 8500,
    location: "Sector 15, Noida",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "BK002",
    hostelName: "Urban Living Hostel",
    roomType: "Shared Room",
    checkIn: "2023-12-01",
    checkOut: "2024-01-10",
    status: "completed",
    amount: 6500,
    location: "Karol Bagh, Delhi",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "BK003",
    hostelName: "Elite Student Residence",
    roomType: "Single Room",
    checkIn: "2024-07-01",
    checkOut: "2024-12-01",
    status: "upcoming",
    amount: 12000,
    location: "Rajouri Garden, Delhi",
    image: "/placeholder.svg?height=80&width=80",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700";
    case "completed":
      return "bg-slate-100 text-slate-700";
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const UserBookingPage = () => {
  return (
    <>
      <div className="flex justify-between items-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">My Bookings</h2>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <Home className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card
            key={booking.id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4">
                  <img
                    src={booking.image || "/placeholder.svg"}
                    alt={booking.hostelName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {booking.hostelName}
                      </h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-1">{booking.roomType}</p>
                    <div className="flex items-center text-sm text-slate-500 space-x-4">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {booking.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {booking.checkIn} to {booking.checkOut}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:flex-col lg:items-end lg:space-y-2">
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
                    {booking.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modify
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default UserBookingPage;
