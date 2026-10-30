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

  return (
    <div className="crm-layout">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Container */}
      <div className="crm-main-area">
        <Header toggleSidebar={() => setCollapsed(!collapsed)} />

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

