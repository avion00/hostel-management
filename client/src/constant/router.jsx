import { createBrowserRouter } from "react-router-dom";

import WebsiteLayout from "@/components/layout/Website-layout";
import AuthenticationLayout from "@/components/layout/Authentication-layout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

import Login from "@/pages/authentication/login/Main";
import Signup from "@/pages/authentication/signup/Main";

import Home from "@/pages/website/home/Main";
import About from "@/pages/website/about/Main";
import Contact from "@/pages/website/contact/Main";
import ForPartners from "@/pages/website/for-partners/Main";
import FindHostelsPage from "@/pages/website/find-hostels/Main";
import PropertyDetailsPage from "@/pages/website/property-details/Main";
import DashboardLayout from "@/components/layout/Dashboard-layout";
import UserOverviewPage from "@/pages/dashboard/user/overview/Main";
import UserBookingPage from "@/pages/dashboard/user/booking/Main";
import UserPaymentPage from "@/pages/dashboard/user/payment/Main";
import UserNotificationPage from "@/pages/dashboard/user/notification/Main";
import UserProfilePage from "@/pages/dashboard/user/profile/Main";
import OwnerOverviewPage from "@/pages/dashboard/owner/overview/Main";
import OwnerPropertiesPage from "@/pages/dashboard/owner/properties/Main";
import OwnerBookingPage from "@/pages/dashboard/owner/bookings/Main";
import OwnerPaymentPage from "@/pages/dashboard/owner/payments/Main";
import OwnerProfilePage from "@/pages/dashboard/owner/profile/Main";
import AdminOverviewPage from "@/pages/dashboard/super-admin/overview/Main";
import AdminUserManagementPage from "@/pages/dashboard/super-admin/users/UserManagement";
import AdminPropertiesPage from "@/pages/dashboard/super-admin/properties/Main";
import AddPropertyPage from "@/pages/dashboard/super-admin/properties/AddProperty";
import ViewPropertyPage from "@/pages/dashboard/super-admin/properties/ViewProperty";
import EditPropertyPage from "@/pages/dashboard/super-admin/properties/EditProperty";
import AdminPaymentPage from "@/pages/dashboard/super-admin/payments/Main";
import AdminAnalyticsPage from "@/pages/dashboard/super-admin/analytics/Main";
import AdminSystemPage from "@/pages/dashboard/super-admin/system/Main";
import AdminSettingsPage from "@/pages/dashboard/super-admin/settings/Main";

const router = createBrowserRouter([
  {
    element: <AuthenticationLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/",
    element: <WebsiteLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/find-hostels",
        element: <FindHostelsPage />,
      },
      {
        path: "/hostel/:id",
        element: <PropertyDetailsPage />,
      },
      {
        path: "/for-partners",
        element: <ForPartners />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/dashboard/user/*",
    element: (
      <ProtectedRoute allowedRoles={['student']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "overview",
        element: <UserOverviewPage />,
      },
      {
        path: "bookings",
        element: <UserBookingPage />,
      },
      {
        path: "payments",
        element: <UserPaymentPage />,
      },
      {
        path: "notifications",
        element: <UserNotificationPage />,
      },
      {
        path: "profile",
        element: <UserProfilePage />,
      },
    ],
  },
  {
    path: "/dashboard/owner/*",
    element: (
      <ProtectedRoute allowedRoles={['manager']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "overview",
        element: <OwnerOverviewPage />,
      },
      {
        path: "properties",
        element: <OwnerPropertiesPage />,
      },
      {
        path: "bookings",
        element: <OwnerBookingPage />,
      },
      {
        path: "payments",
        element: <OwnerPaymentPage />,
      },
      {
        path: "profile",
        element: <OwnerProfilePage />,
      },
    ],
  },
  {
    path: "/dashboard/admin/*",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "overview",
        element: <AdminOverviewPage />,
      },
      {
        path: "users",
        element: <AdminUserManagementPage />,
      },
      {
        path: "properties",
        element: <AdminPropertiesPage />,
      },
      {
        path: "properties/add",
        element: <AddPropertyPage />,
      },
      {
        path: "properties/:id",
        element: <ViewPropertyPage />,
      },
      {
        path: "properties/:id/edit",
        element: <EditPropertyPage />,
      },
      {
        path: "payments",
        element: <AdminPaymentPage />,
      },
      {
        path: "analytics",
        element: <AdminAnalyticsPage />,
      },
      {
        path: "system",
        element: <AdminSystemPage />,
      },
      {
        path: "settings",
        element: <AdminSettingsPage />,
      },
    ],
  },
]);

export default router;
