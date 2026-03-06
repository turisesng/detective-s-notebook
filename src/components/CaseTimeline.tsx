import { Clock, AlertCircle, Search, User } from "lucide-react";

interface TimelineEvent {
  time: string;
  description: string;
  type: 'incident' | 'discovery' | 'sighting' | 'forensic';
}

const iconMap = {
  incident: <AlertCircle className="w-4 h-4 text-red-500" />,
  discovery: <Search className="w-4 h-4 text-primary" />,
  sighting: <User className="w-4 h-4 text-blue-400" />,
  forensic: <Clock className="w-4 h-4 text-muted-foreground" />,
};

const CaseTimeline = ({ events }: { events: TimelineEvent[] }) => {
  return (
    <div className="noir-card p-8 mt-8">
      <h3 className="font-display text-2xl font-bold uppercase tracking-tighter mb-8 flex items-center gap-3">
        <Clock className="text-primary w-6 h-6" />
        Chronological Log
      </h3>
      
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent">
        {events.map((event, index) => (
          <div key={index} className="relative flex items-start gap-6 group">
            {/* The Timeline Node */}
            <div className="absolute left-0 w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center z-10 group-hover:border-primary transition-colors duration-500">
              {iconMap[event.type]}
            </div>
            
            <div className="ml-12 pt-1">
              <time className="block mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary typewriter">
                {event.time}
              </time>
              <p className="text-muted-foreground font-body text-base leading-relaxed italic">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseTimeline;