import { createBrowserRouter } from "react-router-dom";

import WebsiteLayout from "@/components/layout/Website-layout";
import AuthenticationLayout from "@/components/layout/Authentication-layout";

import Login from "@/pages/authentication/login/Main";
import Signup from "@/pages/authentication/signup/Main";

import Home from "@/pages/website/home/Main";
import About from "@/pages/website/about/Main";
import Contact from "@/pages/website/contact/Main";
import ForPartners from "@/pages/website/for-partners/Main";
import FindHostelsPage from "@/pages/website/find-hostels/Main";

const router = createBrowserRouter([
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
]);

export default router;
