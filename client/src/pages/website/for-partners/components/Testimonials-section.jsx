import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Laxman Poudel",
    property: "Green Valley Hostel, Kathmandu",
    text: "HostelHub helped me increase my occupancy from 60% to 95% within 3 months. The quality of students is excellent.",
    rating: 5,
  },
  {
    name: "Sita Sharma",
    property: "Student Paradise, Pokhara",
    text: "The platform is so easy to use. I can manage bookings, payments, and communicate with tenants all in one place.",
    rating: 5,
  },
  {
    name: "Ram Karki",
    property: "Urban Living, Itahari",
    text: "Best decision I made was partnering with HostelHub. My revenue has doubled in the past year.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Success Stories
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Hear from our successful partners who have transformed their
            business with HostelHub.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {testimonial.property}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
