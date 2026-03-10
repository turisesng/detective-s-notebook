import React from 'react';

const WitnessPulse = ({ reliability }: { reliability: number }) => {
  // Logic: Lower reliability = Faster, more frantic heart rate
  const duration = reliability > 80 ? "3s" : reliability > 50 ? "1.5s" : "0.6s";
  const color = reliability > 80 ? "#22c55e" : reliability > 50 ? "#eab308" : "#ef4444";

  return (
    <div className="flex items-center gap-2">
      <svg width="60" height="20" viewBox="0 0 60 20" className="opacity-70">
        <path
          d="M0 10 L15 10 L18 4 L22 16 L25 10 L60 10"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          className="animate-ekg"
          style={{ 
            animation: `ekg ${duration} linear infinite`,
            strokeDasharray: '100',
          } as React.CSSProperties}
        />
      </svg>
      <span className="text-[10px] font-mono" style={{ color }}>
        {reliability > 50 ? "STABLE" : "FRANTIC"}
      </span>
    </div>
  );
};

export default WitnessPulse;