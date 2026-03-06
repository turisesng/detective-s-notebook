import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import {
  interrogateSuspect,
  generateMessageId,
  type Message,
  type InterrogationSession,
} from "@/lib/interrogationService";
import { Suspect } from "@/lib/caseService";

interface InterrogationPanelProps {
  suspect: Suspect;
  onClose: () => void;
}

const InterrogationPanel = ({ suspect, onClose }: InterrogationPanelProps) => {
  const [session, setSession] = useState<InterrogationSession>({
    suspectId: suspect.id,
    suspectName: suspect.name,
    messages: [
      {
        id: generateMessageId(),
        role: "assistant",
        content: `*${suspect.name} sits down, eyeing you warily.*\n\nWhat do you want? I already told the other guy everything I know.`,
        timestamp: new Date(),
      },
    ],
    isLoading: false,
  });

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages]);

  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || session.isLoading) return;

    const userMessage: Message = {
      id: generateMessageId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const updatedMessages = [...session.messages, userMessage];

    setSession(prev => ({ ...prev, messages: updatedMessages, isLoading: true, error: undefined }));
    setInputValue("");

    try {
      const suspectProfile = suspect.profile || "A suspect in a crime.";
      const response = await interrogateSuspect(suspect.name, suspectProfile, updatedMessages);

      const assistantMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setSession(prev => ({
        ...prev,
        messages: [...updatedMessages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Error";
      const errorMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: `*${suspect.name} stares at you blankly.*\n\n[Error: ${errorText}]`,
        timestamp: new Date(),
      };
      setSession(prev => ({ ...prev, messages: [...updatedMessages, errorMessage], isLoading: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20 font-display">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="font-bold">Interrogating {suspect.name}</span>
          </div>
          <button onClick={onClose} className="hover:bg-secondary p-2 rounded-lg"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {session.messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-secondary text-secondary-foreground rounded-tl-none border border-border'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                <span className="text-[10px] opacity-40 mt-2 block text-right italic">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {session.isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary/40 text-muted-foreground px-4 py-2 rounded-lg border border-border/50 animate-pulse">
                <p className="text-xs italic">*{suspect.name} is thinking...*</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border flex gap-2">
          <input 
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your question..."
            disabled={session.isLoading}
          />
          <button onClick={handleSendMessage} disabled={session.isLoading || !inputValue.trim()} className="bg-primary text-primary-foreground p-2.5 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all shadow-lg">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterrogationPanel;