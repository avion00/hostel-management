import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Sparkles, Users, MapPin, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apis from "@/lib/api/api";
import { toast } from "sonner";

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

const SearchHostelSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  // Fetch suggestions based on search query
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(apis.getProperties, {
        params: {
          search: query,
          limit: 5
        }
      });

      if (response.data.success) {
        setSuggestions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debouncing
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/find-hostels?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/find-hostels');
    }
    setShowSuggestions(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < suggestions.length - 1 ? prev + 1 : prev;
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > -1 ? prev - 1 : -1;
          return newIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (property) => {
    setSearchQuery(property.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    // Navigate to property details page
    navigate(`/hostel/${property.id || property._id}`);
  };

  // View all results
  const handleViewAll = () => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
    navigate(`/find-hostels?search=${encodeURIComponent(searchQuery)}`);
  };

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Handle quick location badge click
  const handleLocationClick = (location) => {
    navigate(`/find-hostels?city=${encodeURIComponent(location)}`);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 mr-2" />
            Trusted by 50,000+ Students
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {" "}
              Student Home
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover verified, affordable hostels near your college. Book
            instantly with real-time availability and secure payments designed
            for students.
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 max-w-3xl mx-auto border border-slate-200/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1" ref={searchRef}>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <Input
                    placeholder="Search by location, pin code, or college name..."
                    className="pl-12 h-14 text-base placeholder:text-sm border-0 focus-visible:ring-2 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (searchQuery && suggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && (searchQuery.length > 1) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 max-h-80 overflow-y-auto z-50">
                      {isLoading ? (
                        <div className="p-4 text-center text-slate-500">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                          <p className="mt-2 text-sm">Searching...</p>
                        </div>
                      ) : suggestions.length > 0 ? (
                        <div className="py-1">
                          {suggestions.map((property, index) => (
                            <div
                              key={property.id}
                              className={`flex items-start gap-3 px-3 py-2 cursor-pointer transition-all ${
                                selectedIndex === index
                                  ? 'bg-indigo-50 border-l-2 border-indigo-500'
                                  : 'hover:bg-slate-50 border-l-2 border-transparent'
                              }`}
                              onClick={() => handleSuggestionClick(property)}
                              onMouseEnter={() => setSelectedIndex(index)}
                            >
                              {/* Property Image */}
                              <div className="flex-shrink-0">
                                <img
                                  src={getImageUrl(property.images?.[0])}
                                  alt={property.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                              
                              {/* Property Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-slate-900 text-sm truncate">
                                      {property.name}
                                    </h4>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                      <p className="text-xs text-slate-600 truncate">
                                        {property.address}, {property.city}
                                      </p>
                                    </div>
                                    {property.near_college && (
                                      <p className="text-xs text-indigo-600 mt-0.5 truncate">
                                        Near {property.near_college}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {/* Price and Rating */}
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-indigo-600">
                                      ₹{property.price_starting?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-500">per month</p>
                                    {property.average_rating && (
                                      <div className="flex items-center justify-end gap-0.5 mt-0.5">
                                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                                        <span className="text-xs text-slate-600">
                                          {property.average_rating?.toFixed(1)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* View All Results */}
                          <div className="border-t border-slate-200 mt-1">
                            <div
                              className={`px-3 py-2 cursor-pointer transition-colors text-center ${
                                selectedIndex === suggestions.length
                                  ? 'bg-indigo-50'
                                  : 'hover:bg-slate-50'
                              }`}
                              onClick={handleViewAll}
                              onMouseEnter={() => setSelectedIndex(suggestions.length)}
                            >
                              <p className="text-xs font-medium text-indigo-600">
                                View all results for "{searchQuery}" →
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-slate-500 text-sm">No properties found</p>
                          <p className="text-xs text-slate-400 mt-1">Try searching with different keywords</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                className="h-14 px-8 bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Search Hostels
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {["Kathmandu", "Itahari", "Dharan", "Jhapa", "Pokhara"].map(
                (location) => (
                  <Badge
                    key={location}
                    variant="secondary"
                    className="cursor-pointer hover:bg-indigo-100 hover:text-indigo-700 transition-colors px-3 py-1"
                    onClick={() => handleLocationClick(location)}
                  >
                    {location}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-hostels">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 cursor-pointer to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Search className="w-5 h-5 mr-2" />
                Explore Hostels
              </Button>
            </Link>
            <Link to="/for-partners">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-200 cursor-pointer hover:bg-slate-50 bg-white text-slate-700 hover:text-slate-900 transition-all duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchHostelSection;
