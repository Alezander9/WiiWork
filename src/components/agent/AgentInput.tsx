import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgentStore } from "@/stores/agentStore";
import avatarIdle from "@/assets/avatarIdle.png";
import avatarTalking from "@/assets/avatarTalking.png";

interface AgentInputProps {
  onSendMessage: (message: string) => void;
  agentResponse?: string;
}

// Helper to clean tool calls from response
function cleanResponse(response: string): string {
  const cleanedText = response.replace(/\[\[\w+:[^\]]+\]\]/g, "");
  return cleanedText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
    .join("\n");
}

export function AgentInput({ onSendMessage, agentResponse }: AgentInputProps) {
  const [message, setMessage] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const responseEndRef = useRef<HTMLDivElement>(null);
  const inputMode = useAgentStore((state) => state.inputMode);
  const isResponding = useAgentStore((state) => state.isResponding);
  // Typewriter effect when agentResponse changes
  useEffect(() => {
    if (!agentResponse) return;

    const cleanedResponse = cleanResponse(agentResponse);
    let currentLength = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      if (currentLength < cleanedResponse.length) {
        setDisplayedText(cleanedResponse.substring(0, currentLength));
        currentLength += 3; // Show 3 characters at a time
      } else {
        // Ensure we show the complete text at the end
        setDisplayedText(cleanedResponse);
        clearInterval(interval);
      }
    }, 20); // Update every 20ms

    return () => {
      clearInterval(interval);
      // Also ensure complete text is shown when effect is cleaned up
      setDisplayedText(cleanedResponse);
    };
  }, [agentResponse]);

  // Scroll to bottom when text updates
  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return inputMode === "mobile" ? null : (
    <div className="bg-white/30 backdrop-blur-md fixed bottom-0 left-0 right-0 z-10 flex flex-col justify-end">
      {/* Floating dialog style */}
      {displayedText && (
        <div className="max-h-32 relative z-20">
          <div className="rounded-lg shadow-lg p-2">
            <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-line font-medium">
              {displayedText}
            </div>
            <div ref={responseEndRef} />
          </div>
        </div>
      )}

      {/* Agent Avatar - Centered in the blurred background */}
      <div className="absolute bottom-4 right-32 translate-x-1/2 w-56 h-56 z-10">
        <div className="relative w-full h-full">
          {/* Idle image */}
          <img
            src={avatarIdle}
            alt="Agent idle"
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
            style={{
              opacity: isResponding ? 0 : 1,
            }}
          />
          {/* Talking image */}
          <img
            src={avatarTalking}
            alt="Agent talking"
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
            style={{
              opacity: isResponding ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* Input Form - Wii-style, overlaid on top */}
      {!isResponding && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-lg relative z-30">
          <form
            onSubmit={handleSubmit}
            className="p-4 flex gap-2 max-w-2xl mx-auto"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask the agent to help you navigate..."
              className="flex-1 border-wii-blue border-opacity-50 focus:ring-wii-blue bg-white/90"
            />
            <Button
              type="submit"
              disabled={!message.trim()}
              className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
            >
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
