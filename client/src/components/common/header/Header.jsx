import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Bed, LogOut, Menu, User2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { logout: handleLogout, user, isLoggedIn } = useAuth();


  const navigation = [
    { name: "Find Hostels", href: "/find-hostels" },
    { name: "For Partners", href: "/for-partners" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 shadow-sm py-1">
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
            {isLoggedIn ? (
              <aside className="relative">
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setProfileModal((profile) => !profile)}
                >
                  <User2 className=" border-2 rounded-full border-gray-800 hover:border-indigo-500 transition-colors duration-200" />
                  <p className="text-sm font-medium mt-1">{user?.firstName}</p>
                </div>
                {profileModal && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg divide-y divide-gray-200 z-50">
                    <p
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/dashboard/user/overview")}
                    >
                      Dashboard
                    </p>
                    <p
                      className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout <LogOut className="w-4 h-4 text-red-500" />
                    </p>
                  </div>
                )}
              </aside>
            ) : (
              <Link to={"/login"}>
                <Button className="bg-gradient-to-r cursor-pointer from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-sm">
                  Get Started
                </Button>
              </Link>
            )}
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
              {isLoggedIn ? (
                <>
                  <p
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/dashboard/user/overview")}
                  >
                    Dashboard
                  </p>
                  <p
                    className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout <LogOut className="w-4 h-4 text-red-500" />
                  </p>
                </>
              ) : (
                <>
                  <Link to={"/login"} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 cursor-pointer">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
