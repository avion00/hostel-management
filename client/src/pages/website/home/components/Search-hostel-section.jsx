import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SearchHostelSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <Input
                    placeholder="Search by location, pin code, or college name..."
                    className="pl-12 h-14 text-base placeholder:text-sm border-0 focus-visible:ring-2 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Link to={""}>
                <Button
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Search Hostels
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {["Kathmandu", "Itahari", "Dharan", "Jhapa", "Pokhara"].map(
                (location) => (
                  <Badge
                    key={location}
                    variant="secondary"
                    className="cursor-pointer hover:bg-indigo-100 hover:text-indigo-700 transition-colors px-3 py-1"
                  >
                    {location}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={""}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 cursor-pointer to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Search className="w-5 h-5 mr-2" />
                Explore Hostels
              </Button>
            </Link>
            <Link to={""}>
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
