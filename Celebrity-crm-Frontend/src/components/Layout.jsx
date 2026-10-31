import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from './Toast';
import AddCelebrityModal from './Modals/AddCelebrityModal';
import CreateCampaignModal from './Modals/CreateCampaignModal';
import CreateContractModal from './Modals/CreateContractModal';
import ScheduleShootModal from './Modals/ScheduleShootModal';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    // If mobile screen, toggle mobile drawer; else toggle desktop collapse
    if (window.innerWidth <= 992) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <div className="crm-layout">
      {/* Sidebar with Mobile Drawer & Desktop Collapse Support */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        closeMobileSidebar={closeMobileSidebar}
      />

      {/* Main Container */}
      <div className="crm-main-area">
        <Header toggleSidebar={toggleSidebar} />

        <main className="crm-page-content">
          <Outlet />
        </main>
      </div>

      {/* Interactive Global Modals */}
      <AddCelebrityModal />
      <CreateCampaignModal />
      <CreateContractModal />
      <ScheduleShootModal />

      {/* Floating Toast Alerts */}
      <Toast />
    </div>
  );
}
