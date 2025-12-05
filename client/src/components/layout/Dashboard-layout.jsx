import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../common/sidebar/Sidebar";
import Header from "../common/sidebar/Dashboard-header";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />
      
      <main 
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
        `}
      >
        <Header 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed}
          setMobileOpen={setMobileSidebarOpen}
        />
        
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
