import { Play, Square } from "lucide-react";
import { useState } from "react";

const AudioLog = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center gap-3 bg-black/40 border border-primary/20 p-2 rounded-md mb-4 max-w-fit">
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="p-2 bg-primary/20 hover:bg-primary/40 rounded transition-colors"
      >
        {isPlaying ? <Square className="w-3 h-3 fill-primary" /> : <Play className="w-3 h-3 fill-primary" />}
      </button>
      
      <div className="flex gap-1 items-end h-4 w-24">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className={`w-1 bg-primary/60 transition-all ${isPlaying ? 'animate-bounce' : 'h-1'}`}
            style={{ 
              animationDelay: `${i * 0.1}s`, 
              height: isPlaying ? `${40 + Math.random() * 60}%` : '20%' 
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioLog;