import React from 'react';
import ReadyOrders from './ReadyOrders';
import DigitalClock from './DigitalClock';

const Dashboard = () => {
  return (
    <div className="fullscreen-dashboard light-theme bg-white">
      {/* Header with Digital Clock */}
      <header className="flex justify-between items-center p-6">
        <div className="text-4xl xl:text-6xl font-bold text-black">
          READY ORDERS
        </div>
        <DigitalClock />
      </header>

        {/* Main Content Area - Token Display */}
        <main className="flex-1 overflow-hidden flex items-center justify-center h-full fixed inset-0 top-16">
          <ReadyOrders />
        </main>
    </div>
  );
};

export default Dashboard;
