import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "How do I book a hostel?",
    answer:
      "Simply search for hostels in your preferred location, select a property, choose your room type, and complete the booking process with secure payment.",
  },
  {
    question: "Are all hostels verified?",
    answer:
      "Yes, all hostels on our platform go through a rigorous verification process to ensure they meet our quality and safety standards.",
  },
  {
    question: "What if I need to cancel my booking?",
    answer:
      "You can cancel your booking according to the cancellation policy of the specific hostel. Most properties offer flexible cancellation options.",
  },
  {
    question: "How can I list my property?",
    answer:
      "Property owners can list their hostels by filling out our partner application form. Our team will guide you through the onboarding process.",
  },
  {
    question: "Is there a booking fee?",
    answer:
      "We don't charge any booking fees to students. Our revenue comes from a small commission paid by partner properties.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Quick answers to common questions. Can't find what you're looking
              for? Contact us directly.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
