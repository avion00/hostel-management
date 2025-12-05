import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Edit, Eye, Home, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/api/axiosInstance";
import apis from "@/lib/api/api";
import { toast } from "sonner";

const getStatusColor = (status) => {
  switch (status) {
    case "active":
    case "confirmed":
      return "bg-emerald-100 text-emerald-700";
    case "completed":
      return "bg-slate-100 text-slate-700";
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getImageUrl = (image) => {
  if (!image) return "/placeholder.svg";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const apiBase =
    import.meta.env.VITE_BACKEND_DOMAIN || "http://localhost:5000/api";
  const apiIndex = apiBase.indexOf("/api");
  const backendBase = apiIndex !== -1 ? apiBase.slice(0, apiIndex) : apiBase;

  if (image.startsWith("/")) {
    return `${backendBase}${image}`;
  }

  return `${backendBase}/${image}`;
};

const UserBookingPage = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialisedFromContext, setInitialisedFromContext] = useState(false);
  const [roomOptions, setRoomOptions] = useState([]);
  const [selectedPropertyInfo, setSelectedPropertyInfo] = useState(null);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    property_id: "",
    room_type_id: "",
    start_date: "",
    duration_type: "monthly",
    duration_value: 6,
    occupants: 1,
    special_requests: "",
    payment_method: "cash",
    pay_mode: "partial",
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(apis.getStudentBookings);

      if (res.data?.success) {
        setBookings(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!initialisedFromContext && location.state?.bookingContext) {
      const ctx = location.state.bookingContext;
      setInitialisedFromContext(true);
      setDialogOpen(true);

      setSelectedPropertyInfo({
        name: ctx.propertyName,
        address: ctx.propertyAddress,
        city: ctx.propertyCity,
      });

      setRoomOptions(ctx.roomTypes || []);

      setFormData((prev) => ({
        ...prev,
        property_id: ctx.propertyId || "",
        room_type_id: ctx.selectedRoomTypeId || "",
      }));
    }
  }, [initialisedFromContext, location.state]);

  const openNewBookingDialog = () => {
    setSelectedPropertyInfo(null);
    setRoomOptions([]);
    setFormData({
      property_id: "",
      room_type_id: "",
      start_date: "",
      duration_type: "monthly",
      duration_value: 6,
      occupants: 1,
      special_requests: "",
      payment_method: "cash",
      pay_mode: "partial",
    });
    setDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    console.log("[Booking] Submitting form with data:", formData);

    const missingFields = [];
    if (!formData.property_id) missingFields.push("property");
    if (!formData.room_type_id) missingFields.push("room type");
    if (!formData.start_date) missingFields.push("start date");
    if (!formData.duration_type) missingFields.push("duration type");
    if (!formData.duration_value) missingFields.push("duration value");

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following required fields: ${missingFields.join(", ")}.`
      );
      return;
    }

    try {
      setCreating(true);

      const payload = {
        property_id: formData.property_id,
        room_type_id: formData.room_type_id,
        start_date: formData.start_date,
        duration_type: formData.duration_type,
        duration_value: Number(formData.duration_value),
        occupants: Number(formData.occupants) || 1,
        special_requests: formData.special_requests || null,
        payment_method: formData.payment_method || null,
        pay_mode: formData.pay_mode || null,
      };

      const res = await axiosInstance.post(apis.createBooking, payload);

      if (res.data?.success) {
        toast.success(res.data?.message || "Booking created successfully.");
        setDialogOpen(false);
        fetchBookings();
      } else {
        toast.error(res.data?.message || "Failed to create booking.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error.response?.data?.message || "Failed to create booking.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">My Bookings</h2>
        <Button
          className="bg-linear-to-r from-indigo-500 to-purple-500"
          onClick={openNewBookingDialog}
        >
          <Home className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-slate-500">Loading your bookings...</p>
      )}

      <div className="space-y-4 mt-4">
        {bookings.map((booking) => {
          const image = booking.images?.[0];
          const propertyName = booking.property_name || "Hostel";
          const roomType = booking.room_type_name || "Room";
          const locationText =
            booking.city || booking.address || "Location not available";
          const status = booking.booking_status || booking.status;

          return (
            <Card
              key={booking.id}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <img
                      src={getImageUrl(image)}
                      alt={propertyName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {propertyName}
                        </h3>
                        <Badge className={getStatusColor(status)}>{status}</Badge>
                      </div>
                      <p className="text-slate-600 mb-1">{roomType}</p>
                      <div className="flex items-center text-sm text-slate-500 space-x-4">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {locationText}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(booking.start_date)} to
                          {" "}
                          {formatDate(booking.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:flex-col lg:items-end lg:space-y-2">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        {formatCurrency(booking.total_amount)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {booking.duration_type || "monthly"}
                      </p>
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
                      {status === "active" && (
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
          );
        })}

        {!loading && bookings.length === 0 && (
          <p className="text-sm text-slate-500 mt-4">
            You do not have any bookings yet. Browse hostels and click
            {" "}
            <span className="font-semibold">Book Now</span> to get started.
          </p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>New Booking</DialogTitle>
          </DialogHeader>

          <form className="space-y-4 mt-2" onSubmit={handleCreateBooking}>
            {selectedPropertyInfo && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900">
                  {selectedPropertyInfo.name}
                </p>
                <p className="text-xs text-slate-500">
                  {[selectedPropertyInfo.address, selectedPropertyInfo.city]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}

            {!selectedPropertyInfo && (
              <div>
                <Label>Property ID</Label>
                <Input
                  name="property_id"
                  value={formData.property_id}
                  onChange={handleInputChange}
                  placeholder="Property ID"
                />
              </div>
            )}

            {roomOptions.length > 0 ? (
              <div>
                <Label>Room Type</Label>
                <Select
                  value={formData.room_type_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, room_type_id: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomOptions.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label>Room Type ID</Label>
                <Input
                  name="room_type_id"
                  value={formData.room_type_id}
                  onChange={handleInputChange}
                  placeholder="Room type ID"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Occupants</Label>
                <Input
                  type="number"
                  name="occupants"
                  min={1}
                  value={formData.occupants}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration Type</Label>
                <Select
                  value={formData.duration_type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, duration_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration Value</Label>
                <Input
                  type="number"
                  name="duration_value"
                  min={1}
                  value={formData.duration_value}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Payment Method</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, payment_method: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pay Mode</Label>
                <Select
                  value={formData.pay_mode}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, pay_mode: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Special Requests (optional)</Label>
              <Textarea
                name="special_requests"
                value={formData.special_requests}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-500"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Booking"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserBookingPage;
