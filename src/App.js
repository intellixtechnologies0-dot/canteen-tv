import React, { useState, useEffect } from 'react';
import './App.css';
import DebugBar from './components/DebugBar';
import DebugOverlay from './components/DebugOverlay';
import Dashboard from './components/Dashboard';

function App() {
  const [isDevMode, setIsDevMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastFetchTime, setLastFetchTime] = useState(null);

  useEffect(() => {
    // Detect development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    setIsDevMode(isDevelopment);

    // Simulate connection status changes
    const interval = setInterval(() => {
      const statuses = ['connected', 'disconnected', 'pending'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
      
      if (randomStatus === 'connected') {
        setLastFetchTime(new Date().toLocaleTimeString());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`App ${isDevMode ? 'dev-mode' : 'production-mode'}`}>
      <Dashboard />
      {isDevMode && (
        <DebugBar 
          connectionStatus={connectionStatus}
          lastFetchTime={lastFetchTime}
        />
      )}
      <DebugOverlay 
        isDevMode={isDevMode}
        connectionStatus={connectionStatus}
        lastFetchTime={lastFetchTime}
      />
    </div>
  );
}

export default App;
