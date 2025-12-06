import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Plus,
  X,
  ArrowLeft,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axiosInstance";

const AddProperty = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.accessToken);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [managers, setManagers] = useState([]);
  
  const [formData, setFormData] = useState({
    manager_id: "",
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    near_college: "",
    total_rooms: "",
    price_starting: "",
    amenities: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");

  // Predefined amenities
  const commonAmenities = [
    "WiFi",
    "AC",
    "Parking",
    "Kitchen",
    "Security",
    "Laundry",
    "Gym",
    "Swimming Pool",
    "Study Room",
    "Common Area",
  ];

  useEffect(() => {
    fetchCurrentUser();
    fetchManagers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      if (response.data.success) {
        setCurrentUser(response.data.data);
        // If user is a manager, set them as the default manager
        if (response.data.data.role === 'manager') {
          setFormData(prev => ({ ...prev, manager_id: response.data.data.id }));
        }
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
      console.error(error);
    }
  };

  const fetchManagers = async () => {
    try {
      // Fetch users with manager role
      const response = await axiosInstance.get("/admin/users?role=manager");
      if (response.data.success) {
        setManagers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch managers:", error);
      // For now, set empty array to prevent errors
      setManagers([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAmenity = (amenity) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 10 images
    if (imageFiles.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("User data not loaded");
      return;
    }

    // Validation
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.total_rooms || !formData.price_starting) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check manager selection for admin
    if (currentUser.role === 'admin' && !formData.manager_id) {
      toast.error("Please select a manager for this property");
      return;
    }

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      
      // Add manager_id - for admin, use selected manager or fallback to a default
      if (currentUser.role === 'admin' && formData.manager_id) {
        formDataToSend.append('manager_id', formData.manager_id);
      } else if (currentUser.role === 'manager') {
        formDataToSend.append('manager_id', currentUser.id);
      } else {
        // For admin without selection, we need a manager
        toast.error("Please select a manager for this property");
        setLoading(false);
        return;
      }
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('pincode', formData.pincode);
      if (formData.latitude) formDataToSend.append('latitude', formData.latitude);
      if (formData.longitude) formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('near_college', formData.near_college);
      formDataToSend.append('total_rooms', formData.total_rooms);
      formDataToSend.append('price_starting', formData.price_starting);
      formDataToSend.append('amenities', JSON.stringify(formData.amenities));
      
      // Add image files
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Create property with multipart/form-data
      // Don't set Content-Type header - browser will set it automatically with boundary
      const response = await axiosInstance.post("/admin/hostels", formDataToSend);

      if (response.data.success) {
        const propertyId = response.data.data.id;
        
        // Auto-approve if user is admin
        if (currentUser.role === "admin") {
          try {
            await axiosInstance.patch(`/admin/hostels/${propertyId}/approve`);
            toast.success("Property created and approved successfully!");
          } catch (approveError) {
            toast.success("Property created successfully! (Auto-approval pending)");
          }
        } else {
          toast.success("Property created successfully!");
        }

        // Navigate back to properties list
        setTimeout(() => {
          navigate("/dashboard/admin/properties");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create property");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/admin/properties")}
          className="mb-4 bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Add New Property
            </h1>
            <p className="text-slate-600">
              Create a new hostel property on the platform
            </p>
          </div>
          {currentUser?.role === "admin" && (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-2">
              Auto-Approve Enabled
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Manager Selection - Only show for admin */}
                {currentUser?.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Manager <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="manager_id"
                      value={formData.manager_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">-- Select a Manager --</option>
                      {managers.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name} ({manager.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Green Valley Student Hostel"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Total Rooms <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="total_rooms"
                      value={formData.total_rooms}
                      onChange={handleInputChange}
                      placeholder="15"
                      min="1"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Starting Price (Rs.) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price_starting"
                      value={formData.price_starting}
                      onChange={handleInputChange}
                      placeholder="8500"
                      min="0"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Chowk Road, Near DU"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Dharan"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Province 1"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="56700"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Near College/University
                  </label>
                  <input
                    type="text"
                    name="near_college"
                    value={formData.near_college}
                    onChange={handleInputChange}
                    placeholder="Dharan University"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Latitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      placeholder="26.8124"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Longitude (Optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      placeholder="87.2847"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Amenities & Images */}
          <div className="space-y-6">
            {/* Amenities */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  Amenities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Add Buttons */}
                <div className="flex flex-wrap gap-2">
                  {commonAmenities.map((amenity) => (
                    <Button
                      key={amenity}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addAmenity(amenity)}
                      disabled={formData.amenities.includes(amenity)}
                      className={`${
                        formData.amenities.includes(amenity)
                          ? "bg-blue-50 border-blue-200 text-blue-600"
                          : "bg-white"
                      }`}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {amenity}
                    </Button>
                  ))}
                </div>

                {/* Custom Amenity */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add custom amenity"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAmenity(newAmenity);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addAmenity(newAmenity)}
                    className="bg-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Selected Amenities */}
                {formData.amenities.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">
                      Selected ({formData.amenities.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenity) => (
                        <Badge
                          key={amenity}
                          className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className="ml-2 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Property Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Images (Max 10, 5MB each)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">
                      Selected Images ({imagePreviews.length}/10)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative group"
                        >
                          <img
                            src={preview}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="text-xs text-center mt-1 text-slate-600 truncate">
                            {imageFiles[index]?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Property...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Create Property
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
