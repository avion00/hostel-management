import { Clock, Shield, TrendingUp, Users } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Revenue",
    description:
      "Boost your occupancy rates by up to 40% with our verified student network",
    color: "from-emerald-400 to-emerald-500",
  },
  {
    icon: Users,
    title: "Quality Tenants",
    description:
      "Connect with verified students from top colleges and universities",
    color: "from-blue-400 to-blue-500",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Guaranteed payments with our secure escrow system and insurance coverage",
    color: "from-purple-400 to-purple-500",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support for you and your tenants",
    color: "from-rose-400 to-rose-500",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Why Partner with Us?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Join thousands of successful hostel owners who have transformed
            their business with HostelHub.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div
                className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
