import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  Filter,
  Heart,
  Share2,
  CheckCircle,
  Users,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import apis from "@/lib/api/api";
import { useSearchParams, useNavigate } from "react-router-dom";

function FindHostelsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [priceRange, setPriceRange] = useState([2000, 15000]);
  const [isPriceFilterApplied, setIsPriceFilterApplied] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const debounceTimer = useRef(null);

  const amenityIcons = {
    WiFi: Wifi,
    AC: CheckCircle,
    Parking: Car,
    Kitchen: Coffee,
    Security: Shield,
    Gym: Users,
    "Common Area": Users,
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

  // Fetch hostels with filters
  const fetchHostels = async (params = {}) => {
    setIsLoading(true);
    try {
      const queryParams = {
        ...params,
        page: currentPage,
        limit: 10
      };

      // Only add price filters if explicitly applied by user
      if (isPriceFilterApplied) {
        queryParams.min_price = priceRange[0];
        queryParams.max_price = priceRange[1];
      }

      // Remove empty parameters
      Object.keys(queryParams).forEach(key => {
        if (!queryParams[key] || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const res = await axios.get(apis.getProperties, {
        params: queryParams
      });

      if (res.data.success) {
        setHostels(res.data.data || []);
        setFilteredHostels(res.data.data || []);
        setTotalCount(res.data.pagination?.total || 0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching hostels");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize and react to URL search parameters
  // Always fetch when the search params change (including initial load)
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';

    setSearchQuery(search);
    setCityFilter(city);

    fetchHostels({
      search,
      city,
    });
  }, [searchParams]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for debouncing - don't navigate, just fetch
    debounceTimer.current = setTimeout(() => {
      fetchHostels({
        search: value,
        city: cityFilter
      });
    }, 500);
  };

  // Handle search button click
  const handleSearch = () => {
    // Update URL when search button is clicked
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (cityFilter) params.set('city', cityFilter);
    
    const queryString = params.toString();
    navigate(`/find-hostels${queryString ? '?' + queryString : ''}`, { replace: true });
    
    fetchHostels({
      search: searchQuery,
      city: cityFilter
    });
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Apply filters
  const applyFilters = () => {
    // Don't fetch if already loading
    if (isLoading) return;
    
    // Mark price filter as applied when user clicks apply
    setIsPriceFilterApplied(true);
    
    fetchHostels({
      search: searchQuery,
      city: cityFilter
    });
    
    // Filter by amenities locally if needed
    if (selectedAmenities.length > 0) {
      const filtered = hostels.filter(hostel => {
        return selectedAmenities.every(amenity => 
          hostel.amenities?.includes(amenity)
        );
      });
      setFilteredHostels(filtered);
    }
  };

  // Toggle amenity selection
  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setCityFilter('');
    setPriceRange([2000, 15000]);
    setIsPriceFilterApplied(false);
    setSelectedAmenities([]);
    navigate('/find-hostels', { replace: true });
    
    // Fetch with default parameters
    fetchHostels({});
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <>
      <section className="bg-white border-b border-slate-200/60 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              Find Your Perfect Hostel
            </h1>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search by location, college, or hostel name..."
                    className="pl-12 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-6 border-slate-200"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {(selectedAmenities.length > 0 || cityFilter) && (
                    <Badge className="ml-2 bg-indigo-100 text-indigo-700">
                      {selectedAmenities.length + (cityFilter ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
                <Button 
                  onClick={handleSearch}
                  className="h-12 px-8 bg-gradient-to-r from-indigo-500 to-purple-500"
                >
                  Search
                </Button>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(searchQuery || cityFilter || selectedAmenities.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-slate-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => {
                        setSearchQuery('');
                        navigate('/find-hostels');
                      }}
                    />
                  </Badge>
                )}
                {cityFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    City: {cityFilter}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => {
                        setCityFilter('');
                        const params = new URLSearchParams(searchParams);
                        params.delete('city');
                        navigate(`/find-hostels${params.toString() ? '?' + params.toString() : ''}`);
                      }}
                    />
                  </Badge>
                )}
                {selectedAmenities.map(amenity => (
                  <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                    {amenity}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => toggleAmenity(amenity)}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">
                    Price Range: Rs.{priceRange[0]} - Rs.{priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={20000}
                    min={1000}
                    step={500}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">
                    City
                  </label>
                  <Input
                    placeholder="Enter city name"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">
                    Room Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Room</SelectItem>
                      <SelectItem value="shared">Shared Room</SelectItem>
                      <SelectItem value="dormitory">Dormitory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    {[
                      "WiFi",
                      "AC",
                      "Parking",
                      "Kitchen",
                      "Security",
                      "Gym",
                    ].map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-300"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                        />
                        <span className="text-sm text-slate-600">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={applyFilters}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
                >
                  Apply Filters
                </Button>
                {(selectedAmenities.length > 0 || cityFilter || priceRange[0] !== 2000 || priceRange[1] !== 15000) && (
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {/* Results Summary */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600">
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"></div>
                    Searching...
                  </span>
                ) : (
                  <span>
                    Found <strong>{filteredHostels.length}</strong> properties
                    {searchQuery && ` for "${searchQuery}"`}
                    {cityFilter && ` in ${cityFilter}`}
                  </span>
                )}
              </p>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hostels List */}
            <div className="space-y-6">
              {isLoading ? (
                // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-80 h-48 bg-slate-200 animate-pulse"></div>
                      <div className="flex-1 p-6">
                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-3 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4 animate-pulse"></div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-slate-200 rounded w-20 animate-pulse"></div>
                          <div className="h-8 bg-slate-200 rounded w-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : filteredHostels.length === 0 ? (
                // No results message
                <Card className="border-0 shadow-lg p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No properties found
                    </h3>
                    <p className="text-slate-600 mb-6">
                      {searchQuery 
                        ? `We couldn't find any properties matching "${searchQuery}". Try adjusting your search or filters.`
                        : "No properties available with the current filters. Try adjusting your criteria."}
                    </p>
                    <Button 
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </Card>
              ) : (
                // Hostels list
                filteredHostels.map((hostel) => (
                  <Card
                    key={hostel.id || hostel._id}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-80 h-48 md:h-auto">
                      <img
                        src={getImageUrl(hostel.images?.[0] || hostel.image)}
                        alt={hostel.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-3 left-3">
                        {hostel.verified && (
                          <Badge className="bg-emerald-500 hover:bg-emerald-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-1">
                            {hostel.name}
                          </h3>
                          <div className="flex items-center text-slate-600 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {hostel.address}, {hostel.city} {hostel.pincode && `- ${hostel.pincode}`}
                          </div>
                          {hostel.near_college && (
                            <div className="text-sm text-indigo-600 mb-2">
                              Near {hostel.near_college}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {hostel.average_rating ? (
                              <>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                                  <span className="text-sm font-medium ml-1">
                                    {hostel.average_rating?.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-sm text-slate-500">
                                  ({hostel.review_count || 0} reviews)
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-slate-500">No reviews yet</span>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {hostel.roomType || "Single Room"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            ₹{hostel.price_starting?.toLocaleString() || hostel.price?.toLocaleString()}
                          </div>
                          <div className="text-sm text-slate-500">/month</div>
                          {hostel.total_rooms && (
                            <div className="text-xs text-slate-500 mt-1">
                              {hostel.total_rooms} rooms available
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {hostel.amenities?.map((amenity) => {
                          const IconComponent =
                            amenityIcons[amenity] || CheckCircle;
                          return (
                            <div
                              key={amenity}
                              className="flex items-center text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md"
                            >
                              <IconComponent className="w-3 h-3 mr-1" />
                              {amenity}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          onClick={() => navigate(`/hostel/${hostel.id || hostel._id}`)}
                          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="px-6 bg-transparent"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                  </Card>
                ))
              )}
            </div>
            {/* Pagination */}
            {!isLoading && filteredHostels.length > 0 && totalCount > 10 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {currentPage} of {Math.ceil(totalCount / 10)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage >= Math.ceil(totalCount / 10)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FindHostelsPage;
