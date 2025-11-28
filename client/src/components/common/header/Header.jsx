import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Bed, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const navigation = [
    { name: "Find Hostels", href: "/find-hostels" },
    { name: "For Partners", href: "/for-partners" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={"/"} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Bed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">HostelHub</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all  duration-200${
                  pathname === item.href ? "text-purple-600 " : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Link to={"/login"}>
              <Button className="bg-gradient-to-r cursor-pointer from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200/60">
          <div className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 space-y-2">
              <Link to={"/"} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
