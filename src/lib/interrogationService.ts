/**
 * Interrogation Service
 * Sends conversation history to a backend proxy which forwards to Groq AI
 */

const PROXY_URL = "http://localhost:3001/api/interrogate";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface InterrogationSession {
  suspectId: string;
  suspectName: string;
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

function createSuspectSystemPrompt(suspectName: string, suspectProfile: string): string {
  return `You are roleplaying as ${suspectName}, a murder suspect being interrogated by a detective.
Character profile: ${suspectProfile}
Rules: 
- Stay strictly in character.
- Be evasive, defensive, or hostile depending on the profile.
- Keep responses concise (1-2 paragraphs).
- Do not admit guilt unless backed into a corner with undeniable evidence.`;
}

export async function interrogateSuspect(
  suspectName: string,
  suspectProfile: string,
  messages: Message[]
): Promise<string> {
  const systemPrompt = createSuspectSystemPrompt(suspectName, suspectProfile);

  // format messages for the proxy service (Groq AI expects simple role/content pairs)
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt,
        messages: formattedMessages,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || "Server Error");

    return data.text || "The suspect remains silent.";
  } catch (error) {
    console.error("Interrogation Error:", error);
    throw error;
  }
}

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}