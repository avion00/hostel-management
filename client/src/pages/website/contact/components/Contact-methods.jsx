import { Card } from "@/components/ui/card";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our support team",
    contact: "+91 98765 43210",
    availability: "Mon-Fri, 9 AM - 8 PM",
    color: "from-emerald-400 to-emerald-500",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us your queries and we'll respond within 24 hours",
    contact: "support@hostelhub.com",
    availability: "24/7 Response",
    color: "from-blue-400 to-blue-500",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help through our live chat",
    contact: "Available on website",
    availability: "Mon-Fri, 9 AM - 8 PM",
    color: "from-purple-400 to-purple-500",
  },
  {
    icon: MapPin,
    title: "Visit Our Office",
    description: "Meet us in person at our headquarters",
    contact: "Mumbai, Maharashtra",
    availability: "Mon-Fri, 10 AM - 6 PM",
    color: "from-rose-400 to-rose-500",
  },
];

const ContactMethods = () => {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            How Can We Help?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Choose the most convenient way to reach out to us. We're always
            ready to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center p-6"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
              >
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {method.title}
              </h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                {method.description}
              </p>
              <p className="font-medium text-slate-900 mb-1">
                {method.contact}
              </p>
              <p className="text-sm text-slate-500">{method.availability}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactMethods;
