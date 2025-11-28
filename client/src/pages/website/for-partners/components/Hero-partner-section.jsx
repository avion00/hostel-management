import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const HeroPartnerSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Partner with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {" "}
              HostelHub
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join India's largest student accommodation network. List your hostel
            and connect with thousands of verified students looking for quality
            accommodation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              List Your Property
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-slate-200 hover:bg-slate-50 bg-white text-slate-700"
            >
              <Phone className="w-5 h-5 mr-2" />
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPartnerSection;
