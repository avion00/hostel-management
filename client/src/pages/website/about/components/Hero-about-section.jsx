import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const HeroAboutSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Transforming Student
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {" "}
              Accommodation
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make quality student housing accessible,
            affordable, and hassle-free for every student in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/find-hostels">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Explore Hostels
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-200 hover:bg-slate-50 bg-white text-slate-700"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAboutSection;
