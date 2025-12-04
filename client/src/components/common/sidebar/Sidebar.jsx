import NavItems from "./NavItems";
import { Bed, LogOut } from "lucide-react";
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

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout: handleLogout } = useAuth();
  const { role: userType } = useSelector((state) => state?.auth?.user);

  const navItems =
    userType === "User"
      ? userNavItems
      : userType === "Owner"
      ? ownerNavItems
      : adminNavItems;


  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen w-[250px] flex-shrink-0 bg-background py-4 relative shadow-md"
      )}
    >
      <div className="flex items-center justify-center gap-4 py-2">
        <div
          onClick={() => navigate("/")}
          className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
        >
          <Bed className="w-5 h-5 text-white" />
        </div>
        <span
          className="text-xl font-bold text-slate-800"
          onClick={() => navigate("/")}
        >
          HostelHub
        </span>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden py-6">
        <ScrollArea className="flex-1 px-3">
          <NavItems items={navItems} />
        </ScrollArea>
        <p
          className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
          onClick={handleLogout}
        >
          Logout <LogOut className="w-4 h-4 text-red-500" />
        </p>
      </div>
    </aside>
  );
}
