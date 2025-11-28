import { CheckCircle, Clock, CreditCard, Shield } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Real-Time Availability",
    description:
      "Check live room availability and book instantly without waiting",
    color: "from-emerald-400 to-emerald-500",
  },
  {
    icon: CheckCircle,
    title: "Easy Booking",
    description: "Simple 3-step booking process designed for students",
    color: "from-blue-400 to-blue-500",
  },
  {
    icon: Shield,
    title: "Verified Hostels",
    description: "All hostels are verified and meet our quality standards",
    color: "from-purple-400 to-purple-500",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Multiple payment options with bank-level security",
    color: "from-rose-400 to-rose-500",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Why Choose HostelHub?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            We make hostel booking simple, secure, and stress-free for students
            across India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
