import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  Heart,
  Share2,
  Users,
  Bed,
  Bath,
  Building,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  Info,
  Home,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import apis from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";

function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);

      // Use public properties API: GET /api/properties/:id
      const response = await axios.get(apis.getPropertyById(id));

      if (!response.data?.success || !response.data?.data) {
        toast.error("Failed to load property details");
        navigate("/find-hostels");
        return;
      }

      const data = response.data.data;

      // Some backends wrap hostel + roomTypes; normalize to a flat property object
      const normalizedProperty = {
        // If data.hostel exists (adminHostelController format), use that, else use data itself
        ...(data.hostel || data),
      };

      // Normalize images & amenities to arrays
      normalizedProperty.images = normalizedProperty.images || [];
      normalizedProperty.amenities = normalizedProperty.amenities || [];

      // Map rating fields to what the UI expects
      normalizedProperty.rating =
        normalizedProperty.average_rating ?? normalizedProperty.rating ?? null;
      normalizedProperty.reviewCount =
        normalizedProperty.review_count ?? normalizedProperty.reviewCount ?? 0;

      // Prefer price_starting if present
      if (normalizedProperty.price_starting && !normalizedProperty.basePrice) {
        normalizedProperty.basePrice = normalizedProperty.price_starting;
      }

      // Derive simple room type list if available
      const roomTypesSource =
        data.roomTypes || // adminHostelController format
        data.rooms || // propertyController rooms array
        [];

      if (Array.isArray(roomTypesSource) && roomTypesSource.length > 0) {
        const mappedRoomTypes = roomTypesSource.map((room) => ({
          id: room.id,
          type: room.type || room.room_type || room.name || "Room",
          description: room.description || "Comfortable room for students.",
          price:
            room.price ||
            room.price_per_month ||
            normalizedProperty.price_starting ||
            0,
          capacity: room.capacity || room.total_beds || room.beds_available || 1,
          availability:
            room.is_available === 1 ||
            room.is_available === true ||
            room.beds_available > 0,
        }));

        normalizedProperty.roomTypes = mappedRoomTypes;
        setSelectedRoom(mappedRoomTypes[0]);
      } else {
        normalizedProperty.roomTypes = [];
        setSelectedRoom(null);
      }

      setProperty(normalizedProperty);
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error(error.response?.data?.message || "Failed to load property details");
      navigate("/find-hostels");
    } finally {
      setLoading(false);
    }
  };

  const handleImageNavigation = (direction) => {
    const totalImages = property?.images?.length || 0;
    if (totalImages === 0) return;

    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    // If already absolute, return as-is
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const apiBase =
      import.meta.env.VITE_BACKEND_DOMAIN || "http://localhost:5000/api";

    // Strip trailing /api from the base URL so we point to the backend root
    const apiIndex = apiBase.indexOf("/api");
    const backendBase = apiIndex !== -1 ? apiBase.slice(0, apiIndex) : apiBase;

    if (image.startsWith("/")) {
      return `${backendBase}${image}`;
    }

    return `${backendBase}/${image}`;
  };

  const amenityIcons = {
    WiFi: Wifi,
    Parking: Car,
    Cafeteria: Coffee,
    Security: Shield,
    Laundry: Home,
    "Study Room": Building,
    Gym: Users,
    "Power Backup": Shield,
    "Hot Water": Bath,
    AC: Building,
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleBookNow = () => {
    if (!isAuthenticated()) {
      toast.error("Please log in as a student to book this hostel.");
      navigate("/login", {
        state: {
          redirectTo: `/hostel/${id}`,
        },
      });
      return;
    }

    if (!hasRole("student")) {
      toast.error("Only student accounts can create bookings.");
      return;
    }

    const bookingContext = {
      propertyId: property.id,
      propertyName: property.name,
      propertyCity: property.city,
      propertyAddress: property.address,
      roomTypes: property.roomTypes || [],
      selectedRoomTypeId: selectedRoom?.id || null,
    };

    navigate("/dashboard/user/bookings", {
      state: {
        bookingContext,
      },
    });
  };

  const handleContactOwner = () => {
    const email = property?.contactEmail || property?.manager_email;

    if (email) {
      const subject = `Booking enquiry for ${property?.name || "hostel"}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
      return;
    }

    toast.error("Owner email address is not available.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/find-hostels")}>
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Button
              variant="ghost"
              className="p-0 h-auto"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <span className="text-gray-400">/</span>
            <Button
              variant="ghost"
              className="p-0 h-auto"
              onClick={() => navigate("/find-hostels")}
            >
              Properties
            </Button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{property.name}</span>
          </nav>
        </div>

        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {property.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {property.address}
                    {property.city && `, ${property.city}`}
                    {property.state && `, ${property.state}`}
                  </span>
                </div>
                {property.near_college && (
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span className="truncate max-w-xs">Near {property.near_college}</span>
                  </div>
                )}
                {property.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>
                      {property.rating.toFixed ? property.rating.toFixed(1) : property.rating} ({
                        property.reviewCount || 0
                      }{" "}
                      reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="hidden md:flex flex-col items-end text-right mr-2">
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  Starting from
                </span>
                <span className="text-2xl font-semibold text-primary">
                  {formatPrice(property.basePrice || property.price_starting || 0)}
                </span>
                <span className="text-xs text-gray-500">per month</span>
              </div>
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Property Status Badges */}
          <div className="flex gap-2 flex-wrap items-center">
            <Badge variant={property.status === "active" ? "success" : "secondary"}>
              {property.status}
            </Badge>
            {property.approved && (
              <Badge variant="success">
                Approved
              </Badge>
            )}
            {property.verified && (
              <Badge variant="outline" className="border-green-500 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {property.featured && (
              <Badge variant="outline" className="border-blue-500 text-blue-700">
                Featured
              </Badge>
            )}
            {property.created_at && (
              <Badge variant="secondary">
                Listed on {formatDate(property.created_at)}
              </Badge>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border bg-white px-4 py-3 shadow-sm flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Starting from
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(property.basePrice || property.price_starting || 0)}
              </span>
              <span className="text-xs text-gray-500">per month</span>
            </div>
            <div className="rounded-xl border bg-white px-4 py-3 shadow-sm flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-gray-500 flex items-center gap-1">
                <Home className="w-4 h-4 text-primary" /> Rooms
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {property.total_rooms || 0}
              </span>
              <span className="text-xs text-gray-500">
                {property.available_rooms || 0} available
              </span>
            </div>
            <div className="rounded-xl border bg-white px-4 py-3 shadow-sm flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-gray-500 flex items-center gap-1">
                <Bed className="w-4 h-4 text-primary" /> Beds
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {property.total_beds || 0}
              </span>
              <span className="text-xs text-gray-500">
                {property.available_beds || 0} available
              </span>
            </div>
            <div className="rounded-xl border bg-white px-4 py-3 shadow-sm flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-gray-500 flex items-center gap-1">
                <Users className="w-4 h-4 text-primary" /> Staff
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {property.staff_count || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
            {property.images && property.images.length > 0 ? (
              <>
                <div className="relative h-[500px]">
                  <img
                    src={getImageUrl(property.images[currentImageIndex])}
                    alt={`${property.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Buttons */}
                  {property.images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => handleImageNavigation("prev")}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => handleImageNavigation("next")}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>

                  {/* View Gallery Button */}
                  <Button
                    variant="outline"
                    className="absolute bottom-4 left-4 bg-white/90 hover:bg-white"
                    onClick={() => setShowGallery(true)}
                  >
                    <ZoomIn className="w-4 h-4 mr-2" />
                    View All Photos
                  </Button>
                </div>

                {/* Thumbnail Strip */}
                {property.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                          currentImageIndex === index
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-[400px] bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Building className="w-16 h-16 mx-auto mb-2" />
                  <p>No images available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location & Nearby</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">Address</p>
                      <p>{property.address}</p>
                      <p>
                        {property.city}
                        {property.state && `, ${property.state}`} {property.pincode}
                      </p>
                    </div>
                  </div>
                  {property.near_college && (
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Nearby College</p>
                        <p>{property.near_college}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Room Types */}
            {property.roomTypes && property.roomTypes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Room Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {property.roomTypes.map((room, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedRoom?.type === room.type
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedRoom(room)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{room.type}</h3>
                            <p className="text-gray-600 text-sm">{room.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {formatPrice(room.price)}
                            </p>
                            <p className="text-sm text-gray-500">per month</p>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{room.capacity} persons</span>
                          </div>
                          {room.availability && (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities?.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || CheckCircle;
                    return (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <Icon className="w-5 h-5 text-primary" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Rules & Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Rules & Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {property.rules && (
                    <div>
                      <h4 className="font-semibold mb-2">House Rules</h4>
                      <ul className="space-y-1 text-gray-600">
                        {property.rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 text-gray-400" />
                            <span className="text-sm">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {property.policies && (
                    <div>
                      <h4 className="font-semibold mb-2">Policies</h4>
                      <ul className="space-y-1 text-gray-600">
                        {property.policies.map((policy, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 text-gray-400" />
                            <span className="text-sm">{policy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
                {property.manager_name && (
                  <p className="mt-1 text-sm text-gray-500">
                    Hosted by <span className="font-medium text-gray-800">{property.manager_name}</span>
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Room Summary */}
                {selectedRoom ? (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="font-semibold">{selectedRoom.type}</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {formatPrice(selectedRoom.price)}
                      <span className="text-sm text-gray-500 font-normal"> /month</span>
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Starting from</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {formatPrice(property.basePrice || property.price_starting || 0)}
                      <span className="text-sm text-gray-500 font-normal"> /month</span>
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Contact Information</h4>
                  
                  {(property.contactPhone || property.manager_phone) && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{property.contactPhone || property.manager_phone}</span>
                    </div>
                  )}
                  
                  {(property.contactEmail || property.manager_email) && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{property.contactEmail || property.manager_email}</span>
                    </div>
                  )}
                  
                  {property.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a
                        href={property.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-3 text-sm text-gray-600">
                  <h4 className="font-semibold">Quick Facts</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wide text-gray-500">Rooms</span>
                      <span className="font-medium text-gray-900">{property.total_rooms || 0}</span>
                      <span className="text-xs text-gray-500">
                        {property.available_rooms || 0} available
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wide text-gray-500">Beds</span>
                      <span className="font-medium text-gray-900">{property.total_beds || 0}</span>
                      <span className="text-xs text-gray-500">
                        {property.available_beds || 0} available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Actions */}
                <div className="space-y-2 pt-4">
                  <Button className="w-full" size="lg" onClick={handleBookNow}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleContactOwner}>
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Owner
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="text-xs text-gray-500 text-center pt-2">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Secure booking with verified property
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailsPage;