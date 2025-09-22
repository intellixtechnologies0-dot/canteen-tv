import React from 'react';

const DebugBar = ({ connectionStatus, lastFetchTime }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'status-connected';
      case 'disconnected':
        return 'status-disconnected';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-disconnected';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'pending':
        return 'Connecting...';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="debug-bar">
      <div className="debug-status">
        <div className="flex items-center">
          <span className={`status-indicator ${getStatusColor(connectionStatus)}`}></span>
          <span className="text-debug-text">Connection: {getStatusText(connectionStatus)}</span>
        </div>
        <div className="text-debug-text">
          Last Fetch: {lastFetchTime || 'Never'}
        </div>
      </div>
      <div className="text-debug-text">
        DEV MODE | {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default DebugBar;

