import { useState } from "react";
import NavItems from "./NavItems";
import { Bed, MenuIcon, LogOut } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  adminNavItems,
  ownerNavItems,
  userNavItems,
} from "@/constant/staticData/Sidebar-data";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@/hooks/useAuth";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="!px-0 w-[260px] flex flex-col h-screen"
      >
        <div className="flex items-center justify-center gap-4 my-4">
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
        <div className="flex flex-col flex-1 overflow-hidden  ">
          <ScrollArea className="flex-1 px-3">
            <NavItems items={navItems} setOpen={setOpen} />
          </ScrollArea>
          <p
            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={handleLogout}
          >
            Logout <LogOut className="w-4 h-4 text-red-500" />
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
