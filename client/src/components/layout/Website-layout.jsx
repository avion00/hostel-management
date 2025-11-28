import { Link, Outlet } from "react-router-dom";

import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";

import { ArrowLeft, ChevronLeft } from "lucide-react";

export default function WebsiteLayout() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-100px)] max-w-[1536px] mx-auto">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
