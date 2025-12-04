import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  MapPin,
  MoreVertical,
  Star,
} from "lucide-react";

const properties = [
  {
    id: 1,
    name: "Green Valley Student Hostel",
    owner: "Rajesh Kumar",
    location: "Sector 15, Noida",
    totalRooms: 50,
    occupiedRooms: 47,
    monthlyRevenue: 235000,
    commission: 23500,
    rating: 4.8,
    status: "approved",
    verificationStatus: "verified",
    joinDate: "2023-08-20",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Urban Living Hostel",
    owner: "Amit Singh",
    location: "Karol Bagh, Delhi",
    totalRooms: 40,
    occupiedRooms: 35,
    monthlyRevenue: 175000,
    commission: 17500,
    rating: 4.6,
    status: "approved",
    verificationStatus: "verified",
    joinDate: "2023-09-15",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Student Paradise",
    owner: "Priya Gupta",
    location: "Laxmi Nagar, Delhi",
    totalRooms: 60,
    occupiedRooms: 55,
    monthlyRevenue: 220000,
    commission: 22000,
    rating: 4.4,
    status: "pending",
    verificationStatus: "pending",
    joinDate: "2024-03-01",
    image: "/placeholder.svg?height=80&width=80",
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

const AdminPropertiesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Property Management
        </h2>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">720</p>
            <p className="text-sm text-slate-600">Approved Properties</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">45</p>
            <p className="text-sm text-slate-600">Pending Approval</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">12</p>
            <p className="text-sm text-slate-600">Rejected Properties</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">Rs.4.2L</p>
            <p className="text-sm text-slate-600">Monthly Commission</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <Card
            key={property.id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {property.name}
                      </h3>
                      <Badge className={getStatusColor(property.status)}>
                        {property.status}
                      </Badge>
                      <Badge
                        className={getStatusColor(property.verificationStatus)}
                      >
                        {property.verificationStatus}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.location}
                        </p>
                        <p>Owner: {property.owner}</p>
                        <p>Joined: {property.joinDate}</p>
                      </div>
                      <div>
                        <p className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-amber-400" />
                          {property.rating} Rating
                        </p>
                        <p>
                          Occupancy:{" "}
                          {Math.round(
                            (property.occupiedRooms / property.totalRooms) * 100
                          )}
                          %
                        </p>
                        <p>
                          Rooms: {property.occupiedRooms}/{property.totalRooms}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-center lg:text-right">
                    <div>
                      <p className="text-sm text-slate-600">Monthly Revenue</p>
                      <p className="text-lg font-bold text-slate-900">
                        Rs.{property.monthlyRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Our Commission</p>
                      <p className="text-lg font-bold text-indigo-600">
                        Rs.{property.commission.toLocaleString()}
                      </p>
                    </div>
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
                    {property.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent text-emerald-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent text-red-600"
                        >
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
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

export default AdminPropertiesPage;
