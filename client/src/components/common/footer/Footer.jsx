import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Bed,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Bed className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">HostelHub</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Making student accommodation search simple and secure across
              Nepal.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <Icon
                  key={index}
                  className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors duration-200"
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">For Students</h3>
            <ul className="space-y-3 text-slate-400">
              {[
                { name: "Find Hostels", href: "/find-hostels" },
                { name: "How it Works", href: "/about" },
                { name: "Safety Guidelines", href: "/about" },
                { name: "Student Resources", href: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">For Partners</h3>
            <ul className="space-y-3 text-slate-400">
              {[
                { name: "List Your Hostel", href: "/for-partners" },
                { name: "Partner Dashboard", href: "/for-partners" },
                { name: "Pricing", href: "/for-partners" },
                { name: "Support", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-3 text-slate-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3" />
                <span>+977 9876543210</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3" />
                <span>support@hostelhub.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3" />
                <span>Sunsari, Nepal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} HostelHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (link) => (
                <Link
                  key={link}
                  to={""}
                  className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
