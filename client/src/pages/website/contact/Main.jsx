import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
  FileText,
  Users,
} from "lucide-react";
import ContactHero from "./components/Contact-hero";
import ContactMethods from "./components/Contact-methods";
import ContactForm from "./components/Contact-form";
import FaqSection from "./components/Faq-section";

function Contact() {
  return (
    <>
      <ContactHero />
      <ContactMethods />
      <ContactForm />
      <FaqSection />
    </>
  );
}

export default Contact;
