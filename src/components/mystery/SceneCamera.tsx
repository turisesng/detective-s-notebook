import React, { useState } from 'react';

interface SceneProps {
  src: string;
  alt: string;
}

const SceneCamera: React.FC<SceneProps> = ({ src, alt }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Calculate mouse position relative to image center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Rotation intensity (divide by 15 for subtle movement)
    const rotateX = (centerY - y) / 15;
    const rotateY = (x - centerX) / 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const resetRotation = () => setRotation({ x: 0, y: 0 });

  return (
    <div 
      className="perspective-1000 w-full group"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotation}
      style={{ perspective: '1000px' }} // Fallback if Tailwind utility isn't loading
    >
      <div 
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d', // Explicitly set for 3D rendering
          WebkitTransformStyle: 'preserve-3d', // Safari support
          transition: rotation.x === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out'
        }}
        className="relative preserve-3d w-full aspect-video rounded-xl border-2 border-primary/40 overflow-hidden shadow-2xl"
      >
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover scale-110 grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 pointer-events-none"
        />
        
        {/* Tactical HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-primary/20 m-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-[10px] text-primary p-1 bg-black/50 font-mono">REC // SCENE_SCAN</div>
          <div className="w-4 h-4 border-t-2 border-r-2 border-primary" />
        </div>
      </div>
    </div>
  );
};

export default SceneCamera;