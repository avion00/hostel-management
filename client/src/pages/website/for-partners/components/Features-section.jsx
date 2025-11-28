import { Card } from "@/components/ui/card";
import { BarChart3, Building, DollarSign, Headphones } from "lucide-react";

const features = [
  {
    icon: Building,
    title: "Property Management",
    description:
      "Easy-to-use dashboard to manage all your properties in one place",
  },
  {
    icon: DollarSign,
    title: "Dynamic Pricing",
    description: "AI-powered pricing recommendations to maximize your revenue",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Detailed reports on occupancy, revenue, and market trends",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Personal account manager to help you succeed on our platform",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Powerful Tools for Success
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Everything you need to manage and grow your hostel business
            efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
