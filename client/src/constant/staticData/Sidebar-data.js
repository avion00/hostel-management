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
  FileText,
  Home,
  LayoutDashboard,
  PieChart,
  Search,
  Settings,
  ShieldCheck,
  User,
  Users,
  Wallet,
} from "lucide-react";

// ✅ 1. STUDENT DASHBOARD (User Panel)
// For students searching & booking hostels
export const userNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard/user/overview",
    icon: LayoutDashboard,
    description: "Overview & quick stats"
  },
  {
    title: "My Bookings",
    href: "/dashboard/user/bookings",
    icon: Book,
    description: "View booking history"
  },
  {
    title: "Payments",
    href: "/dashboard/user/payments",
    icon: Wallet,
    description: "Payment history & invoices"
  },
  {
    title: "Notifications",
    href: "/dashboard/user/notifications",
    icon: Bell,
    description: "Alerts & reminders"
  },
  {
    title: "Profile",
    href: "/dashboard/user/profile",
    icon: User,
    description: "Update profile & documents"
  },
];

// ✅ 2. HOSTEL OWNER DASHBOARD (Manager Panel)
// For hostel owners managing their properties
export const ownerNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard/owner/overview",
    icon: LayoutDashboard,
    description: "Overview & analytics"
  },
  { 
    title: "My Properties", 
    href: "/dashboard/owner/properties", 
    icon: Building,
    description: "Manage hostels & rooms"
  },
  { 
    title: "Bookings", 
    href: "/dashboard/owner/bookings", 
    icon: Calendar,
    description: "Manage reservations"
  },
  { 
    title: "Payments", 
    href: "/dashboard/owner/payments", 
    icon: CreditCard,
    description: "Revenue & transactions"
  },
  { 
    title: "Profile", 
    href: "/dashboard/owner/profile", 
    icon: User,
    description: "Account settings"
  },
];

// ✅ 3. SUPER ADMIN DASHBOARD (Platform Owner Panel)
// For platform owner to control everything
export const adminNavItems = [
  { 
    title: "Dashboard", 
    href: "/dashboard/admin/overview", 
    icon: BarChart3,
    description: "Platform analytics"
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
    description: "Manage all users & roles"
  },
  { 
    title: "Properties", 
    href: "/dashboard/admin/properties", 
    icon: Building2,
    description: "Approve & manage hostels"
  },
  { 
    title: "Payments", 
    href: "/dashboard/admin/payments", 
    icon: CreditCard,
    description: "Platform revenue"
  },
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: PieChart,
    description: "Reports & insights"
  },
  { 
    title: "System", 
    href: "/dashboard/admin/system", 
    icon: Database,
    description: "System management"
  },
  { 
    title: "Settings", 
    href: "/dashboard/admin/settings", 
    icon: Settings,
    description: "Platform settings"
  },
];
