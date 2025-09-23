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

  // Always render a 4x3 grid (12 slots). If there are fewer orders, fill with placeholders.
  const totalSlots = 24; // 6 columns × 4 rows
  const displayedOrders = Array.from({ length: totalSlots }, (_, i) => orders[i] || null);

  return (
    <div className="w-full h-full p-3 xl:p-4 overflow-hidden">
      <div className="grid grid-cols-6 grid-rows-4 gap-3 xl:gap-4 h-full w-full">
        {displayedOrders.map((order, index) => {
          const isFadingOut = order && fadeOutOrders.has(order.id);
          const isScalingIn = order && scaleInOrders.has(order.id);
          const isGlowPulsing = order && glowPulseOrders.has(order.id);

          return (
            <div
              key={order ? order.id : `empty-${index}`}
              className={`token-card flex items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${
                isFadingOut ? 'fade-out' : isScalingIn ? 'scale-in' : 'normal'
              } ${isGlowPulsing ? 'glow-pulse' : ''}`}
            >
              {order ? (
                <div className="token-number font-bold text-black leading-none whitespace-nowrap select-none text-[clamp(1.75rem,4.2vw,3.5rem)] md:text-[clamp(2rem,3.6vw,4rem)] xl:text-[clamp(2.25rem,3vw,4.25rem)]">
                  {order.tokenNumber}
                </div>
              ) : (
                <div className="token-number font-bold text-black opacity-20 leading-none whitespace-nowrap select-none text-[clamp(1.5rem,3.6vw,3.25rem)]">
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
