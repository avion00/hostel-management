import {
  Activity,
  BarChart3,
  Bell,
  Book,
  Building,
  Building2,
  Calendar,
  CreditCard,
  Database,
  LayoutDashboard,
  PieChartIcon,
  Settings,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { GrDashboard } from "react-icons/gr";

export const userNavItems = [
  {
    title: "OverView",
    href: "/dashboard/user/overview",
    icon: Activity,
  },
  {
    title: "Bookings",
    href: "/dashboard/user/bookings",
    icon: Book,
  },
  {
    title: "Payments",
    href: "/dashboard/user/payments",
    icon: Wallet,
  },
  {
    title: "Notifications",
    href: "/dashboard/user/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/dashboard/user/profile",
    icon: User,
  },
];

export const ownerNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard/owner/overview",
    icon: LayoutDashboard,
  },
  { title: "Properties", href: "/dashboard/owner/properties", icon: Building },
  { title: "Bookings", href: "/dashboard/owner/bookings", icon: Calendar },
  { title: "Payments", href: "/dashboard/owner/payments", icon: CreditCard },
  { title: "Profile", href: "/dashboard/owner/profile", icon: User },
];

export const adminNavItems = [
  { title: "Dashboard", href: "/dashboard/admin/overview", icon: BarChart3 },
  {
    title: "User Management",
    href: "/dashboard/admin/user-management",
    icon: Users,
  },
  { title: "Properties", href: "/dashboard/admin/properties", icon: Building2 },
  { title: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: PieChartIcon,
  },
  { title: "System", href: "/dashboard/admin/system", icon: Database },
  { title: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];
