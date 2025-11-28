import { Card } from "@/components/ui/card";
import { Award, Heart, Shield, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "We prioritize the safety and security of our students and partners through rigorous verification processes.",
  },
  {
    icon: Heart,
    title: "Student-First",
    description:
      "Every decision we make is centered around improving the student accommodation experience.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building a supportive community where students can thrive and property owners can succeed.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in everything we do, from our platform to our customer service.",
  },
];

const ValueSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Our Values
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            The principles that guide everything we do and shape our company
            culture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {value.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {value.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
