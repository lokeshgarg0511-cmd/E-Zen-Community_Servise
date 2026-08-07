import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

const DashboardLayout = ({ role, unreadCount, notificationsTo, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-navy-950 dark:bg-grid-glow">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} notificationsTo={notificationsTo} />
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
