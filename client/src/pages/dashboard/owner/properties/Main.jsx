import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/api/axiosInstance";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Eye, MapPin, Plus, Star, Trash2 } from "lucide-react";
import AddPropertyForm from "./components/add-property-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import apis from "@/lib/api/api";

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

const getOccupancyColor = (occupancy) => {
  if (occupancy >= 90) return "text-emerald-600";
  if (occupancy >= 70) return "text-amber-600";
  return "text-red-600";
};

const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);
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

const OwnerPropertiesPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const managerId = user?.id;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const fetchProperties = async () => {
    if (!managerId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        apis.getManagerProperties(managerId)
      );
      setProperties(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (propertyId) => {
    if (!propertyId) return;
    navigate(`/hostel/${propertyId}`);
  };

  useEffect(() => {
    fetchProperties();
  }, [managerId]);

  const handleAdd = () => {
    setSelectedProperty(null);
    setModalOpen(true);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const handleDelete = (property) => {
    setPropertyToDelete(property);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await axiosInstance.delete(apis.deleteProperty(propertyToDelete.id));
      setProperties((prev) =>
        prev.filter((p) => p.id !== propertyToDelete.id)
      );
      setDeleteConfirmOpen(false);
      setPropertyToDelete(null);
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Property Management
        </h2>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-indigo-500 to-purple-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <AddPropertyForm
            initialData={selectedProperty}
            onSuccess={(property) => {
              if (selectedProperty) {
                setProperties((prev) =>
                  prev?.map((p) => (p.id === property.id ? property : p))
                );
              } else {
                setProperties((prev) => [property, ...prev]);
              }
              setModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm text-center">
          <p className="text-lg mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{propertyToDelete?.name}</span>?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <p>Loading properties...</p>
      ) : properties?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            You have no properties yet
          </h3>
          <p className="text-slate-600 mb-4 text-center max-w-md">
            Start by adding your first property so students can find and book your hostel.
          </p>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {properties?.map((property) => (
            <Card
              key={property.id}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <img
                      src={getImageUrl(property.images?.[0])}
                      alt={property.name}
                      width={120}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {property.name}
                        </h3>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-slate-500 space-x-4 mb-3">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.city
                            ? `${property.city}${
                                property.state ? `, ${property.state}` : ""
                              }`
                            : property.address}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-amber-400" />
                          {property.average_rating
                            ? property.average_rating.toFixed(1)
                            : "No ratings"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {property?.amenities?.map((amenity) => (
                          <Badge
                            key={amenity}
                            variant="secondary"
                            className="text-xs"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-center lg:text-right">
                      <div>
                        <p className="text-sm text-slate-600">Occupancy</p>
                        <p
                          className={`text-lg font-bold ${getOccupancyColor(
                            property.total_rooms
                              ? ((property.total_rooms - (property.available_rooms || 0)) /
                                  property.total_rooms) * 100
                              : 0
                          )}`}
                        >
                          {property.total_rooms
                            ? Math.round(
                                ((property.total_rooms - (property.available_rooms || 0)) /
                                  property.total_rooms) * 100
                              )
                            : 0}
                          %
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Rooms</p>
                        <p className="text-lg font-bold text-slate-900">
                          {(property.total_rooms || 0) -
                            (property.available_rooms || 0)}
                          /{property.total_rooms || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Revenue</p>
                        <p className="text-lg font-bold text-indigo-600">
                          {formatPrice(
                            (property.price_starting || 0) *
                              ((property.total_rooms || 0) -
                                (property.available_rooms || 0))
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handleViewDetails(property.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handleEdit(property)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(property)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerPropertiesPage;
