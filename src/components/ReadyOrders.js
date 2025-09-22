import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';

const ReadyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [fadeOutOrders, setFadeOutOrders] = useState(new Set());
  const [scaleInOrders, setScaleInOrders] = useState(new Set());
  const [glowPulseOrders, setGlowPulseOrders] = useState(new Set());

  useEffect(() => {
    // Initial load from Supabase
    const loadInitialOrders = async () => {
      console.log('🚀 Loading initial orders...');
      await orderService.fetchReadyOrders();
      const fetchedOrders = orderService.getReadyOrders();
      console.log('📋 Initial orders loaded:', fetchedOrders);
      setOrders(fetchedOrders);
    };
    
    loadInitialOrders();
    
    // Set up automatic updates every 3 seconds
    const interval = setInterval(async () => {
      console.log('🔄 Updating orders...');
      // Update orders from Supabase
      const { newOrders, removedOrders } = await orderService.updateOrders();
      const currentOrders = orderService.getReadyOrders();
      console.log('📊 Current orders after update:', currentOrders);
      
      // Handle status changes (orders no longer 'ready')
      if (removedOrders.length > 0) {
        // Start fade out animation for orders that changed status
        setFadeOutOrders(new Set(removedOrders));
        
        // Remove orders after fade animation completes
        setTimeout(() => {
          setOrders(currentOrders);
          setFadeOutOrders(new Set());
        }, 700); // 700ms fade duration to match CSS
      } else {
        // Just update orders if no status changes
        setOrders(currentOrders);
      }
      
      // Handle new ready orders with scale-in animation and green glow pulse
      if (newOrders.length > 0) {
        setScaleInOrders(new Set(newOrders));
        setGlowPulseOrders(new Set(newOrders));
        
        setTimeout(() => {
          setScaleInOrders(new Set());
        }, 700); // 700ms scale duration to match CSS
        
        setTimeout(() => {
          setGlowPulseOrders(new Set());
        }, 2000); // 2s glow pulse duration
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orders]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      {/* Token Grid - 4 columns × 3 rows (12 tokens max) */}
      <div className="grid grid-cols-4 grid-rows-3 gap-4 xl:gap-6 max-w-6xl mx-auto overflow-hidden">
        {Array.from({ length: 12 }, (_, index) => {
          const order = orders[index];
          const isFadingOut = order && fadeOutOrders.has(order.id);
          const isScalingIn = order && scaleInOrders.has(order.id);
          const isGlowPulsing = order && glowPulseOrders.has(order.id);
          
          return (
            <div 
              key={order ? order.id : `empty-${index}`}
              className={`token-card flex items-center justify-center min-h-[120px] transition-all duration-700 ease-in-out ${
                isFadingOut 
                  ? 'fade-out' 
                  : isScalingIn 
                    ? 'scale-in' 
                    : 'normal'
              } ${isGlowPulsing ? 'glow-pulse' : ''}`}
            >
              {order ? (
                <div className="token-number text-4xl font-bold text-black">
                  {order.tokenNumber}
                </div>
              ) : (
                <div className="token-number text-4xl font-bold text-black opacity-30">
                  ---
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadyOrders;
