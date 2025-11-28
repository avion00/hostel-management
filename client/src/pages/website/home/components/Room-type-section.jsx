import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

const roomTypes = [
  {
    title: "Single Room",
    price: "Rs. 8,000",
    period: "/month",
    features: ["Private bathroom", "Study desk", "Wi-Fi", "AC"],
    image: "https://m.media-amazon.com/images/I/91eeEacVzLL.jpg",
    popular: true,
  },
  {
    title: "Shared Room",
    price: "Rs. 4,500",
    period: "/month",
    features: ["2-3 sharing", "Common bathroom", "Wi-Fi", "Study area"],
    image:
      "https://i.pinimg.com/736x/42/21/7b/42217bcdfe74e4ca028385cd89a91f6c.jpg",
    popular: false,
  },
  {
    title: "Dormitory",
    price: "Rs. 2,800",
    period: "/month",
    features: ["6-8 sharing", "Common facilities", "Wi-Fi", "Locker"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRJ2ls0Bmmos4ecrsu40Zi9K3Cf2_8YgXsBQ&s",
    popular: false,
  },
];

const RoomTypeSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Choose Your Perfect Room
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            From private rooms to budget-friendly dormitories, find
            accommodation that fits your needs and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roomTypes.map((room, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white relative overflow-hidden"
            >
              {room.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600">
                    Most Popular
                  </Badge>
                </div>
              )}
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={room.image || "/placeholder.svg"}
                  alt={room.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-slate-900">
                    {room.title}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {room.price}
                    </div>
                    <div className="text-sm text-slate-500">{room.period}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {room.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomTypeSection;
