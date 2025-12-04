import { Outlet } from "react-router-dom";
import Sidebar from "../common/sidebar/Sidebar";
import Header from "../common/sidebar/Dashboard-header";

const DashboardLayout = () => {
  return (
    <main className="grid lg:grid-cols-[250px_1fr] min-h-screen md:h-screen overflow-hidden bg-white">
      <Sidebar />

      <div className="flex flex-col h-full overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
