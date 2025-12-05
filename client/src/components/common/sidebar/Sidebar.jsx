import NavItems from "./NavItems";
import { 
  Bed, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Bell
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { ScrollArea } from "../../ui/scroll-area";
import {
  adminNavItems,
  ownerNavItems,
  userNavItems,
} from "@/constant/staticData/Sidebar-data";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const { logout: handleLogout } = useAuth();
  const { role: userType, name: userName } = useSelector((state) => state?.auth?.user || {});

  const navItems =
    userType === "student"
      ? userNavItems
      : userType === "manager"
      ? ownerNavItems
      : adminNavItems;

  // Common sidebar content
  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100/80">
        <div 
          className={cn(
            "flex items-center gap-3.5 cursor-pointer group",
            collapsed && "justify-center w-full"
          )}
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
            <Bed className="w-5 h-5 text-white stroke-[2.5px]" />
          </div>
          {!collapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">HostelHub</h1>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">MANAGEMENT</p>
            </div>
          )}
        </div>
        
        {/* Desktop Collapse Toggle - Removed as it's redundant with header toggle */}
      </div>

      {/* User Profile Section */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        collapsed ? "px-2 py-4" : "px-5 py-6"
      )}>
        <div className={cn(
          "relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-300 group hover:border-indigo-100 hover:shadow-sm",
          collapsed ? "p-2 bg-transparent border-0" : "p-3.5"
        )}>
          <div className={cn(
            "flex items-center gap-3.5",
            collapsed && "justify-center"
          )}>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-700 font-bold text-sm border-2 border-white shadow-sm">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></span>
            </div>
            
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-1 duration-300">
                <p className="text-sm font-semibold text-slate-900 truncate">{userName || 'User'}</p>
                <p className="text-xs font-medium text-slate-500 capitalize truncate flex items-center gap-1.5">
                  {userType || 'Guest'}
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-emerald-600 text-[10px] uppercase tracking-wider font-bold">Active</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-4 pb-4">
        <div className={cn("space-y-1", collapsed && "px-0")}>
          <TooltipProvider delayDuration={0}>
            <NavItems items={navItems} collapsed={collapsed} />
          </TooltipProvider>
        </div>
      </ScrollArea>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="space-y-1">
          {!collapsed && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-10 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl font-medium transition-all duration-200"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-4 h-4 mr-3 stroke-[2px]" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-10 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl font-medium transition-all duration-200"
                onClick={() => navigate("/help")}
              >
                <HelpCircle className="w-4 h-4 mr-3 stroke-[2px]" />
                Help & Support
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start h-10 text-slate-600 hover:text-red-600 hover:bg-red-50/80 rounded-xl font-medium transition-all duration-200 group",
              collapsed && "justify-center px-0"
            )}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-0 lg:mr-3 stroke-[2px] group-hover:scale-110 transition-transform" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-slate-100 shadow-[2px_0_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out z-40",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
