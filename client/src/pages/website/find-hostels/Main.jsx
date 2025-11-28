import { useState } from "react";

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
} from "lucide-react";

function FindHostelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([2000, 15000]);
  const [showFilters, setShowFilters] = useState(false);

  const hostels = [
    {
      id: 1,
      name: "Green Valley Student Hostel",
      location: "Dharan, Nepal",
      distance: "0.5 km from chowk",
      rating: 4.8,
      reviews: 124,
      price: 8500,
      image:
        "https://media.designcafe.com/wp-content/uploads/2023/07/05141750/aesthetic-room-decor.jpg",
      amenities: ["WiFi", "AC", "Parking", "Kitchen"],
      roomType: "Single Room",
      verified: true,
      liked: false,
    },
    {
      id: 2,
      name: "Urban Living Hostel",
      location: "Biratnagar, Nepal",
      distance: "1.2 km from Chowk",
      rating: 4.6,
      reviews: 89,
      price: 6500,
      image:
        "https://i.pinimg.com/736x/2e/92/57/2e9257f6c7d679ee0d0dfdd5636bd327.jpg",
      amenities: ["WiFi", "Kitchen", "Security"],
      roomType: "Shared Room",
      verified: true,
      liked: true,
    },
    {
      id: 3,
      name: "Student Paradise",
      location: "Pokhara, Nepal",
      distance: "2.1 km from chowk",
      rating: 4.4,
      reviews: 67,
      price: 4200,
      image:
        "https://i.pinimg.com/564x/fe/ce/52/fece5293cef4572b965d41eda2de8a32.jpg",
      amenities: ["WiFi", "Common Area"],
      roomType: "Dormitory",
      verified: true,
      liked: false,
    },
    {
      id: 4,
      name: "Elite Student Residence",
      location: "Kathmandu, Nepal",
      distance: "1.8 km from chowk",
      rating: 4.9,
      reviews: 156,
      price: 12000,
      image:
        "https://media.istockphoto.com/id/484706362/photo/luxurious-living-room-in-new-home.jpg?s=612x612&w=0&k=20&c=4puAmBhX-a303hlxZzTy2ZXmN70FE0GOmDILDGZxq5Y=",
      amenities: ["WiFi", "AC", "Parking", "Kitchen", "Gym"],
      roomType: "Single Room",
      verified: true,
      liked: false,
    },
  ];

  const amenityIcons = {
    WiFi: Wifi,
    AC: CheckCircle,
    Parking: Car,
    Kitchen: Coffee,
    Security: Shield,
    Gym: Users,
    "Common Area": Users,
  };

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
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                </Button>
                <Button className="h-12 px-8 bg-gradient-to-r from-indigo-500 to-purple-500">
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "Near DU",
                "Under Rs.5000",
                "Single Room",
                "AC Available",
                "Parking",
              ].map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="cursor-pointer hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                >
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <Card className="sticky top-24 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
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

                {/* Room Type */}
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

                {/* Amenities */}
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
                        />
                        <span className="text-sm text-slate-600">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">
                    Distance from College
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1km">Within 1 km</SelectItem>
                      <SelectItem value="2km">Within 2 km</SelectItem>
                      <SelectItem value="5km">Within 5 km</SelectItem>
                      <SelectItem value="any">Any distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-600">
                Showing <span className="font-semibold">{hostels.length}</span>{" "}
                hostels in Delhi
              </p>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="distance">Nearest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {hostels.map((hostel) => (
                <Card
                  key={hostel.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-80 h-48 md:h-auto">
                      <img
                        src={hostel.image}
                        alt={hostel.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        {hostel.verified && (
                          <Badge className="bg-emerald-500 hover:bg-emerald-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              hostel.liked ? "fill-red-500 text-red-500" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
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
                            {hostel.location} • {hostel.distance}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="text-sm font-medium ml-1">
                                {hostel.rating}
                              </span>
                            </div>
                            <span className="text-sm text-slate-500">
                              ({hostel.reviews} reviews)
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {hostel.roomType}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            Rs.{hostel.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-slate-500">/month</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {hostel.amenities.map((amenity) => {
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
                        <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500">
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="px-6 bg-transparent"
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                className="px-8 bg-transparent"
              >
                Load More Hostels
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindHostelsPage;
