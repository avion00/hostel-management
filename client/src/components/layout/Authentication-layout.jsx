import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

import AuthImage from "@/assets/images/auth-bg.svg";

export default function AuthenticationLayout() {
  return (
    <div className="relative h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0 ">
      <div className="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex items-center justify-center">
        <div
          style={{
            background: `url(${AuthImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
          className="absolute inset-0 z-0"
        ></div>
      </div>
      <div className="h-full flex items-center justify-center relative">
        <Link to={"/"}>
          <div className=" absolute top-2 left-0 border-2 border-primary rounded-full p-1">
            <ArrowLeft className="text-primary" />
          </div>
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
