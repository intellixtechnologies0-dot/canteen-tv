import React from 'react';
import ReadyOrders from './ReadyOrders';
// Removed DigitalClock per request

const Dashboard = () => {
  return (
    <div className="fullscreen-dashboard light-theme bg-white w-screen h-screen overflow-hidden">
      {/* Fullscreen Token Display */}
      <main className="w-full h-full overflow-hidden">
        <ReadyOrders />
      </main>
    </div>
  );
};

export default Dashboard;
