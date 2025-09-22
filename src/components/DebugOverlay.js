import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';

const DebugOverlay = ({ isDevMode, connectionStatus, lastFetchTime }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date().toLocaleTimeString());

  // Real data from Supabase
  const [realTimeData, setRealTimeData] = useState({
    orders: [],
    lastFetch: null,
    supabaseStatus: 'connecting'
  });

  // Fetch real data for debug display
  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        await orderService.fetchReadyOrders();
        const orders = orderService.getReadyOrders();
        setRealTimeData({
          orders: orders,
          lastFetch: orderService.getLastFetchTime(),
          supabaseStatus: 'connected'
        });
      } catch (error) {
        setRealTimeData(prev => ({
          ...prev,
          supabaseStatus: 'error',
          error: error.message
        }));
      }
    };

    fetchDebugData();
    const interval = setInterval(fetchDebugData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update window size
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Update refresh timestamp every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTimestamp(new Date().toLocaleTimeString());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    if (isDevMode) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, isDevMode]);

  if (!isDevMode || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 text-green-400 font-mono text-xs z-50 overflow-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-green-400 pb-2">
          <h2 className="text-lg font-bold">DEBUG OVERLAY (Ctrl+D to toggle)</h2>
          <button 
            onClick={() => setIsVisible(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Close
          </button>
        </div>

        {/* Debug Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* System Information */}
          <div className="bg-gray-900 p-4 rounded border border-green-400">
            <h3 className="text-lg font-bold mb-3 text-green-300">System Information</h3>
            <div className="space-y-2">
              <div><span className="text-green-400">Window Size:</span> {windowSize.width} × {windowSize.height}</div>
              <div><span className="text-green-400">Last Refresh:</span> {refreshTimestamp}</div>
              <div><span className="text-green-400">Supabase Status:</span> <span className={realTimeData.supabaseStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{realTimeData.supabaseStatus}</span></div>
              <div><span className="text-green-400">Last Fetch:</span> {realTimeData.lastFetch ? new Date(realTimeData.lastFetch).toLocaleTimeString() : 'Never'}</div>
              <div><span className="text-green-400">Environment:</span> {process.env.NODE_ENV}</div>
              <div><span className="text-green-400">User Agent:</span> {navigator.userAgent.substring(0, 50)}...</div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-900 p-4 rounded border border-green-400">
            <h3 className="text-lg font-bold mb-3 text-green-300">Performance Metrics</h3>
            <div className="space-y-2">
              <div><span className="text-green-400">Memory Usage:</span> {performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)} MB` : 'N/A'}</div>
              <div><span className="text-green-400">Page Load Time:</span> {performance.timing ? `${performance.timing.loadEventEnd - performance.timing.navigationStart}ms` : 'N/A'}</div>
              <div><span className="text-green-400">Current Time:</span> {new Date().toLocaleTimeString()}</div>
              <div><span className="text-green-400">Timezone:</span> {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
              <div><span className="text-green-400">Screen Resolution:</span> {window.screen.width} × {window.screen.height}</div>
            </div>
          </div>

          {/* Raw JSON Data from Supabase */}
          <div className="lg:col-span-2 bg-gray-900 p-4 rounded border border-green-400">
            <h3 className="text-lg font-bold mb-3 text-green-300">Supabase Data</h3>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify({
                orders: realTimeData.orders,
                supabaseStatus: realTimeData.supabaseStatus,
                lastFetch: realTimeData.lastFetch ? new Date(realTimeData.lastFetch).toISOString() : null,
                error: realTimeData.error || null,
                timestamp: new Date().toISOString()
              }, null, 2)}
            </pre>
          </div>

          {/* Component State */}
          <div className="lg:col-span-2 bg-gray-900 p-4 rounded border border-green-400">
            <h3 className="text-lg font-bold mb-3 text-green-300">Component State</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Debug Overlay State:</h4>
                <pre className="text-xs">
{JSON.stringify({
  isVisible,
  windowSize,
  refreshTimestamp,
  isDevMode
}, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-green-300 mb-2">App State:</h4>
                <pre className="text-xs">
{JSON.stringify({
  connectionStatus,
  lastFetchTime,
  environment: process.env.NODE_ENV
}, null, 2)}
                </pre>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-green-400 text-center text-sm">
          Press <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl+D</kbd> to toggle this overlay
        </div>
      </div>
    </div>
  );
};

export default DebugOverlay;
