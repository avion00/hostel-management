import { cn } from "@/lib/utils";
import MobileSidebar from "./Mobile-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center bg-background justify-between py-4 px-4 w-full shadow-md">
      <div className="flex items-center gap-4">
        <div className={cn("block lg:hidden!")}>
          <MobileSidebar />
        </div>
        <div>
          <h4 className="text-sm text-slate-600">Welcome,</h4>
          <h1 className="text-base font-medium">
            {user?.name || 'User'}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
