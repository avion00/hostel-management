import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Users,
  Star,
  Building2,
  Home,
  Wifi,
  CheckCircle,
  X,
  AlertTriangle,
  Loader2,
  Edit,
  Trash2,
  Image as ImageIcon,
  MapPinned,
  School,
  BedDouble,
  TrendingUp,
  Clock,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axiosInstance";
import AlertDialog from "@/components/common/alert-dialog";

const getStatusColor = (status) => {
  const colors = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
};

const ViewProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.accessToken);
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewBookingDetails, setViewBookingDetails] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
    fetchPropertyBookings();
  }, [id]);

  const fetchPropertyDetails = async () => {
    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/hostels/${id}`);

      if (response.data.success) {
        // Backend returns data.hostel, not just data
        setProperty(response.data.data.hostel);
      } else {
        toast.error(response.data.message || "Failed to fetch property details");
      }
    } catch (error) {
      toast.error("Failed to fetch property details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyBookings = async () => {
    if (!token) return;

    try {
      setBookingsLoading(true);
      const response = await axiosInstance.get(`/admin/bookings?hostel=${id}&limit=50`);

      if (response.data.success) {
        setBookings(response.data.data.bookings || []);
      }
    } catch (error) {
      console.error("Failed to fetch bookings for property", error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const openViewBooking = async (booking) => {
    setSelectedBooking(booking);
    setViewDialogOpen(true);
    setViewLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/bookings/${booking.id}`);
      if (response.data.success) {
        setViewBookingDetails(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to load booking details");
      }
    } catch (error) {
      console.error("Failed to load booking details", error);
      toast.error("Failed to load booking details");
    } finally {
      setViewLoading(false);
    }
  };

  const openEditStudent = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      name: booking.student_name || "",
      email: booking.student_email || "",
      phone: booking.student_phone || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditStudentSave = async () => {
    if (!selectedBooking) return;
    setEditSaving(true);
    try {
      const response = await axiosInstance.put(`/admin/users/${selectedBooking.student_id}`, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
      });

      if (response.data.success) {
        toast.success("Student details updated");
        setBookings((prev) =>
          prev.map((b) =>
            b.id === selectedBooking.id
              ? {
                  ...b,
                  student_name: editForm.name,
                  student_email: editForm.email,
                  student_phone: editForm.phone,
                }
              : b
          )
        );
        setEditDialogOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update student");
      }
    } catch (error) {
      console.error("Failed to update student", error);
      toast.error("Failed to update student");
    } finally {
      setEditSaving(false);
    }
  };

  const handleSuspendBooking = async (booking) => {
    try {
      const response = await axiosInstance.patch(`/admin/bookings/${booking.id}/cancel`);
      if (response.data.success) {
        toast.success("Booking suspended");
        setBookings((prev) =>
          prev.map((b) =>
            b.id === booking.id
              ? {
                  ...b,
                  booking_status: "suspended",
                }
              : b
          )
        );
      } else {
        toast.error(response.data.message || "Failed to suspend booking");
      }
    } catch (error) {
      console.error("Failed to suspend booking", error);
      toast.error("Failed to suspend booking");
    }
  };

  const handleDeleteBooking = async (booking) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const response = await axiosInstance.delete(`/admin/bookings/${booking.id}`);
      if (response.data.success) {
        toast.success("Booking deleted");
        setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      } else {
        toast.error(response.data.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Failed to delete booking", error);
      toast.error("Failed to delete booking");
    }
  };

  const approveProperty = async () => {
    try {
      const response = await axiosInstance.patch(`/admin/hostels/${id}/approve`);

      if (response.data.success) {
        toast.success("Property approved successfully!");
        fetchPropertyDetails();
      } else {
        toast.error(response.data.message || "Failed to approve property");
      }
    } catch (error) {
      toast.error("Failed to approve property");
      console.error(error);
    }
  };

  const rejectProperty = async () => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const response = await axiosInstance.patch(`/admin/hostels/${id}/reject`, {
        reason,
      });

      if (response.data.success) {
        toast.success("Property rejected successfully!");
        fetchPropertyDetails();
      } else {
        toast.error(response.data.message || "Failed to reject property");
      }
    } catch (error) {
      toast.error("Failed to reject property");
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/admin/hostels/${id}`);

      if (response.data.success) {
        toast.success("Property deleted successfully!");
        navigate("/dashboard/admin/properties");
      } else {
        toast.error(response.data.message || "Failed to delete property");
      }
    } catch (error) {
      toast.error("Failed to delete property");
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-600 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <Building2 className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-600 font-medium text-lg mb-2">Property not found</p>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/admin/properties")}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const amenities = property.amenities || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <AlertDialog
        open={deleteDialogOpen}
        title="Delete property?"
        description="Are you sure you want to delete this property? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmVariant="destructive"
      />
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/admin/properties")}
          className="mb-4 bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {property.name}
              </h1>
              <Badge className={`${getStatusColor(property.status)} border px-3 py-1 text-sm font-semibold`}>
                {property.status.toUpperCase()}
              </Badge>
              {property.status === 'approved' && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm font-semibold">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  VERIFIED
                </Badge>
              )}
            </div>
            <div className="flex items-center text-slate-600 gap-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.city}, {property.state}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Added {new Date(property.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {property.status === "pending" && (
              <>
                <Button
                  onClick={approveProperty}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={rejectProperty}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            <Button
              onClick={() => setDeleteDialogOpen(true)}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              {images.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div className="relative h-96 bg-slate-100">
                    <img
                      src={`http://localhost:5000${images[selectedImage]}`}
                      alt={property.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23f0f0f0' width='800' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {selectedImage + 1} / {images.length}
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="p-4 flex gap-2 overflow-x-auto">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? "border-blue-500 shadow-lg"
                              : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <img
                            src={`http://localhost:5000${image}`}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%23f0f0f0' width='80' height='80'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='10' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center bg-slate-100">
                  <ImageIcon className="w-16 h-16 text-slate-300 mb-2" />
                  <p className="text-slate-500">No images available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                About This Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">
                {property.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <MapPinned className="w-5 h-5 mr-2 text-blue-600" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Full Address</p>
                  <p className="font-medium text-slate-900">{property.address}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">City</p>
                  <p className="font-medium text-slate-900">{property.city}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">State</p>
                  <p className="font-medium text-slate-900">{property.state}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Pincode</p>
                  <p className="font-medium text-slate-900">{property.pincode}</p>
                </div>
              </div>

              {property.near_college && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center text-slate-700">
                    <School className="w-5 h-5 mr-2 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600">Near College/University</p>
                      <p className="font-medium">{property.near_college}</p>
                    </div>
                  </div>
                </div>
              )}

              {(property.latitude && property.longitude) && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">Coordinates</p>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-slate-500">Latitude:</span>
                      <p className="font-medium text-slate-900">{property.latitude}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Longitude:</span>
                      <p className="font-medium text-slate-900">{property.longitude}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          {amenities.length > 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Wifi className="w-5 h-5 mr-2 text-blue-600" />
                  Amenities & Facilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 text-sm"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Room Types */}
          {roomTypes.length > 0 && (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Home className="w-5 h-5 mr-2 text-blue-600" />
                  Room Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="w-[70px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price / Month</TableHead>
                        <TableHead>Total Beds</TableHead>
                        <TableHead>Available Beds</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roomTypes.map((rt) => (
                        <TableRow key={rt.id}>
                          <TableCell className="text-xs text-slate-500">{rt.id}</TableCell>
                          <TableCell className="font-medium">{rt.name}</TableCell>
                          <TableCell>
                            {rt.price_per_month
                              ? `₹${rt.price_per_month.toLocaleString()}`
                              : "-"}
                          </TableCell>
                          <TableCell>{rt.total_beds}</TableCell>
                          <TableCell>{rt.beds_available}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                rt.beds_available > 0 && rt.is_available
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }
                            >
                              {rt.beds_available > 0 && rt.is_available
                                ? "Available"
                                : "Full"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bookings / Students */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Student Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-8 text-slate-500">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading bookings...
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No bookings found for this property yet.
                </p>
              ) : (
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.student_name}</TableCell>
                          <TableCell className="text-slate-600 text-sm">{booking.student_email}</TableCell>
                          <TableCell className="text-sm">{booking.room_type_name}</TableCell>
                          <TableCell className="text-sm">
                            {booking.check_in_date
                              ? new Date(booking.check_in_date).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {booking.duration_value && booking.duration_type
                              ? `${booking.duration_value} (${booking.duration_type})`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                booking.booking_status === "confirmed"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : booking.booking_status === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : booking.booking_status === "cancelled" || booking.booking_status === "suspended"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }
                            >
                              {booking.booking_status === "suspended" ? "suspended" : booking.booking_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                  <span className="sr-only">Open actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => openViewBooking(booking)}>
                                  <Eye className="w-4 h-4 mr-2" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditStudent(booking)}>
                                  <Edit className="w-4 h-4 mr-2" /> Edit student
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleSuspendBooking(booking)}
                                  className="text-amber-600 focus:bg-amber-50 focus:text-amber-700"
                                >
                                  Suspend
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteBooking(booking)}
                                  className="text-red-600 focus:bg-red-50 focus:text-red-700"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Owner Info */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Starting Price</p>
                  <p className="text-3xl font-bold">Rs.{property.price_starting?.toLocaleString()}</p>
                  <p className="text-blue-100 text-xs">per month</p>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-100 text-sm">Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold">{property.average_rating || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100 text-sm">Occupancy</span>
                    <span className="font-semibold">{property.occupancy_percent || 0}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Details */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BedDouble className="w-5 h-5 mr-2 text-blue-600" />
                Room Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-600">Total Rooms</span>
                </div>
                <span className="font-semibold text-slate-900">{property.total_rooms ?? 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-600">Available Rooms</span>
                </div>
                <span className="font-semibold text-emerald-600">{property.available_rooms ?? 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span className="text-slate-600">Occupied Rooms</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {(property.total_rooms || 0) - (property.available_rooms || 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Stats */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Revenue Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-xs text-slate-600 mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-slate-900">
                  Rs.{(property.monthly_revenue || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <p className="text-xs text-slate-600 mb-1">Our Commission</p>
                <p className="text-2xl font-bold text-emerald-600">
                  Rs.{(property.commission || 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Owner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-600 mb-1">Owner Name</p>
                <p className="font-medium text-slate-900">{property.manager_name}</p>
              </div>
              {property.manager_email && (
                <div className="flex items-center text-slate-700">
                  <Mail className="w-4 h-4 mr-2 text-slate-500" />
                  <span className="text-sm">{property.manager_email}</span>
                </div>
              )}
              {property.manager_phone && (
                <div className="flex items-center text-slate-700">
                  <Phone className="w-4 h-4 mr-2 text-slate-500" />
                  <span className="text-sm">{property.manager_phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-600 mb-1">Created At</p>
                <p className="font-medium text-slate-900">
                  {new Date(property.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Last Updated</p>
                <p className="font-medium text-slate-900">
                  {new Date(property.updated_at).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rejection Reason (if rejected) */}
          {property.status === 'rejected' && property.rejection_reason && (
            <Card className="border-0 shadow-lg bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-red-700">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">{property.rejection_reason}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={(open) => {
        setViewDialogOpen(open);
        if (!open) {
          setViewBookingDetails(null);
          setSelectedBooking(null);
        }
      }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
            <DialogDescription>
              View full details for the selected student booking.
            </DialogDescription>
          </DialogHeader>
          {viewLoading ? (
            <div className="flex items-center justify-center py-6 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading details...
            </div>
          ) : viewBookingDetails ? (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">Student</p>
                <p className="font-medium text-slate-900">
                  {viewBookingDetails.student_name} ({viewBookingDetails.student_email})
                </p>
                {viewBookingDetails.student_phone && (
                  <p className="text-slate-600">{viewBookingDetails.student_phone}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Property</p>
                  <p className="font-medium text-slate-900">{viewBookingDetails.property_name}</p>
                  <p className="text-slate-600 text-xs">{viewBookingDetails.address}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Room</p>
                  <p className="font-medium text-slate-900">{viewBookingDetails.room_type}</p>
                  {viewBookingDetails.room_number && (
                    <p className="text-slate-600 text-xs">Room #{viewBookingDetails.room_number}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Check-in</p>
                  <p className="font-medium text-slate-900">
                    {viewBookingDetails.start_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Check-out</p>
                  <p className="font-medium text-slate-900">
                    {viewBookingDetails.end_date}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="font-medium text-slate-900">
                    {viewBookingDetails.duration_value} ({viewBookingDetails.duration_type})
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Occupants</p>
                  <p className="font-medium text-slate-900">{viewBookingDetails.occupants}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Total amount</p>
                  <p className="font-medium text-slate-900">Rs.{viewBookingDetails.total_amount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="font-medium text-slate-900">{viewBookingDetails.booking_status || viewBookingDetails.status}</p>
                </div>
              </div>
              {viewBookingDetails.special_requests && (
                <div>
                  <p className="text-xs text-slate-500">Special requests</p>
                  <p className="text-slate-900">{viewBookingDetails.special_requests}</p>
                </div>
              )}
              {viewBookingDetails.notes_internal && (
                <div>
                  <p className="text-xs text-slate-500">Internal notes</p>
                  <p className="text-slate-900">{viewBookingDetails.notes_internal}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No booking details available.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) {
          setSelectedBooking(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit student details</DialogTitle>
            <DialogDescription>
              Update basic information for this student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Name</p>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Email</p>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Phone</p>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={editForm.phone}
                onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={editSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleEditStudentSave} disabled={editSaving}>
              {editSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewProperty;
