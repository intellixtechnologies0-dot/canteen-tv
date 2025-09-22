import React, { useState, useEffect } from 'react';

const BottomClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="bottom-clock-bar">
      <div className="bottom-clock">
        {formatTime(time)}
      </div>
    </div>
  );
};

export default BottomClock;

