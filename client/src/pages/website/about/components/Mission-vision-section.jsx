import { Card } from "@/components/ui/card";
import { Eye, Target } from "lucide-react";

const MissionVisionSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Card className="border-0 shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              To revolutionize the student accommodation experience by
              connecting students with verified, quality hostels through a
              seamless, technology-driven platform that prioritizes safety,
              affordability, and convenience.
            </p>
          </Card>

          <Card className="border-0 shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              To become India's most trusted student accommodation platform,
              empowering every student to find their perfect home away from home
              while enabling property owners to build sustainable, profitable
              businesses.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
