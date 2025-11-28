import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Join Our Mission
        </h2>
        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Whether you're a student looking for accommodation or a property owner
          wanting to partner with us, we're here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/find-hostels">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Find Your Hostel
            </Button>
          </Link>
          <Link href="/for-partners">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-indigo-600 bg-transparent transition-all duration-200"
            >
              Become a Partner
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
