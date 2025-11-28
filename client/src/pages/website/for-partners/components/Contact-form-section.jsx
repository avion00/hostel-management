import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

const ContactFormSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-slate-600 text-lg">
              Fill out the form below and our team will get back to you within
              24 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Partner with Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Full Name
                    </label>
                    <Input placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Phone Number
                    </label>
                    <Input placeholder="Enter your phone number" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Email Address
                  </label>
                  <Input type="email" placeholder="Enter your email address" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Property Location
                  </label>
                  <Input placeholder="Enter your property location" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Number of Rooms
                  </label>
                  <Input type="number" placeholder="Enter number of rooms" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Additional Information
                  </label>
                  <Textarea
                    placeholder="Tell us more about your property..."
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
                  Submit Application
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-indigo-600 mr-4" />
                    <div>
                      <p className="font-medium text-slate-900">Phone</p>
                      <p className="text-slate-600">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-indigo-600 mr-4" />
                    <div>
                      <p className="font-medium text-slate-900">Email</p>
                      <p className="text-slate-600">partners@hostelhub.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-indigo-600 mr-4" />
                    <div>
                      <p className="font-medium text-slate-900">Address</p>
                      <p className="text-slate-600">
                        Mumbai, Maharashtra, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  Partnership Benefits
                </h4>
                <ul className="space-y-2">
                  {[
                    "Zero listing fees",
                    "Marketing support",
                    "24/7 customer service",
                    "Flexible commission structure",
                    "Regular performance reports",
                  ].map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center text-slate-600"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-3" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
