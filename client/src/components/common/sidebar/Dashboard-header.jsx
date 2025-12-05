import { cn } from "@/lib/utils";
import MobileSidebar from "./Mobile-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LogOut, 
  Menu,
  Bell,
  Search,
  Settings,
  User,
  HelpCircle,
  ChevronDown,
  Sun,
  Moon,
  Home,
  Calendar,
  Bed
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header({ collapsed, setCollapsed, setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get current page title from path
  const getPageTitle = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length > 0) {
      return path[path.length - 1].charAt(0).toUpperCase() + path[path.length - 1].slice(1);
    }
    return 'Dashboard';
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-200">
        <nav className="flex items-center justify-between h-[72px] px-4 sm:px-6 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-600"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo for Mobile */}
            <div className="flex lg:hidden items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Bed className="w-5 h-5 text-white stroke-[2.5px]" />
              </div>
              <span className="text-lg font-bold text-slate-900 hidden sm:block tracking-tight">HostelHub</span>
            </div>

            {/* Breadcrumb - Desktop Only */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-slate-50 border border-slate-200/60">
                <Home className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-slate-300 font-light">/</span>
              <span className="text-sm font-medium text-slate-700">{getPageTitle()}</span>
            </div>
          </div>

          {/* Center Section - Search (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Type to search..."
                className="pl-10 pr-4 py-2.5 w-full bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <span className="hidden lg:block text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">⌘K</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Icon - Mobile Only */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 rounded-xl text-slate-500"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Date & Time - Desktop */}
            <div className="hidden xl:flex flex-col items-end mr-2">
              <span className="text-xs font-semibold text-slate-700">{formatTime(currentTime)}</span>
              <span className="text-[11px] font-medium text-slate-400">{formatDate(currentTime)}</span>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden xl:block mx-2"></div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </Button>

            {/* Theme Toggle - Hidden on small mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-10 w-10 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-orange-500 transition-colors"
            >
              <Sun className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-3 pl-2 pr-1 py-1 h-auto hover:bg-slate-50 rounded-full sm:rounded-xl border border-transparent hover:border-slate-100 transition-all"
                >
                  <div className="hidden md:block text-right leading-tight">
                    <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                    <p className="text-[11px] font-medium text-slate-500 capitalize">{user?.role || 'Guest'}</p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/help')}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Mobile Search Bar - Expandable */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-100",
          searchOpen ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
