import {
  Clock,
  FileText,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supportCategories = [
  {
    icon: Users,
    title: "For Students",
    description: "Help with finding hostels, bookings, and account issues",
    email: "students@hostelhub.com",
  },
  {
    icon: Headphones,
    title: "For Partners",
    description: "Support for property owners and hostel managers",
    email: "partners@hostelhub.com",
  },
  {
    icon: FileText,
    title: "General Inquiries",
    description: "Questions about our services, policies, or partnerships",
    email: "info@hostelhub.com",
  },
];

const ContactForm = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-slate-600">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      First Name
                    </label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Last Name
                    </label>
                    <Input placeholder="Enter your last name" />
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
                    Phone Number
                  </label>
                  <Input placeholder="Enter your phone number" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Subject
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Booking Support</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="partnership">
                        Partnership Inquiry
                      </SelectItem>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us how we can help you..."
                    rows={5}
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-indigo-600 mr-4 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Phone</p>
                      <p className="text-slate-600">+977 9876545367</p>
                      <p className="text-sm text-slate-500">
                        Mon-Fri, 9 AM - 8 PM NST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-indigo-600 mr-4 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Email</p>
                      <p className="text-slate-600">support@hostelhub.com</p>
                      <p className="text-sm text-slate-500">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-indigo-600 mr-4 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Address</p>
                      <p className="text-slate-600">
                        HostelHub Technologies Pvt. Ltd.
                        <br />
                        Itahari chowk, Sunsari
                        <br />
                        Itahari, Nepal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-indigo-600 mr-4 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900 mb-1">
                        Business Hours
                      </p>
                      <p className="text-slate-600">
                        Monday - Friday: 9:00 AM - 8:00 PM
                        <br />
                        Saturday: 10:00 AM - 6:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Categories */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">
                  Specialized Support
                </h4>
                <div className="space-y-4">
                  {supportCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-slate-50 rounded-lg"
                    >
                      <category.icon className="w-5 h-5 text-indigo-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {category.title}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          {category.description}
                        </p>
                        <p className="text-sm text-indigo-600">
                          {category.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
