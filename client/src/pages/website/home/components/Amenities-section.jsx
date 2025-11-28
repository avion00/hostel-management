import { Book, Car, Coffee, Shield, Users, Wifi } from "lucide-react";

const AmenitiesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Premium Amenities
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            All our partner hostels provide essential amenities for a
            comfortable student life.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {[
            {
              icon: Wifi,
              label: "High-Speed WiFi",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Car,
              label: "Parking",
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              icon: Coffee,
              label: "Common Kitchen",
              color: "bg-amber-50 text-amber-600",
            },
            {
              icon: Book,
              label: "Study Rooms",
              color: "bg-purple-50 text-purple-600",
            },
            {
              icon: Shield,
              label: "24/7 Security",
              color: "bg-red-50 text-red-600",
            },
            {
              icon: Users,
              label: "Common Areas",
              color: "bg-indigo-50 text-indigo-600",
            },
          ].map((amenity, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div
                className={`w-14 h-14 ${amenity.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}
              >
                <amenity.icon className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {amenity.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
