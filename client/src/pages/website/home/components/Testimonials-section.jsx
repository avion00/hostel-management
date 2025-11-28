import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Kp Oli",
    college: "Tribhuvan University",
    rating: 5,
    text: "Found the perfect hostel near my college within minutes. The booking process was super smooth and hassle-free!",
    avatar: "https://randomuser.me/api/portraits/men/63.jpg",
  },
  {
    name: "Puspa Kamal Dahal",
    college: "Kathmandu University",
    rating: 5,
    text: "Great platform! Helped me find affordable accommodation with all the amenities I needed as a student.",
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
  },
  {
    name: "Baburam Bhattarai",
    college: "Pokhara University",
    rating: 5,
    text: "Verified hostels gave me peace of mind. My parents were also satisfied with the security features.",
    avatar: "https://randomuser.me/api/portraits/men/66.jpg",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            What Students Say
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Join thousands of satisfied students who found their perfect hostel
            through HostelHub.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
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
                  {testimonial.text}
                </p>
                <div className="flex items-center">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {testimonial.college}
                    </p>
                  </div>
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
