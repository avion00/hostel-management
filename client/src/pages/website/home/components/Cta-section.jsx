import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready to Find Your Perfect Hostel?
        </h2>
        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of students who have found their ideal accommodation
          through HostelHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={""}>
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Search className="w-5 h-5 mr-2" />
              Start Searching
            </Button>
          </Link>
          <Link to={""}>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-indigo-600 bg-transparent transition-all duration-200"
            >
              <Users className="w-5 h-5 mr-2" />
              List Your Hostel
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
