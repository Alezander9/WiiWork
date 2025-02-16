import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgentStore } from "@/stores/agentStore";

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
    <div className="fixed bottom-0 left-0 right-0">
      {/* Floating dialog style */}
      <div className="max-h-32 p-4">
        {displayedText && (
          <div className="text-lg text-gray-800 leading-relaxed whitespace-pre-line font-medium drop-shadow-sm">
            {displayedText}
          </div>
        )}
        <div ref={responseEndRef} />
      </div>

      {/* Input Form - Wii-style */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="p-4 flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask the agent to help you navigate..."
            className="flex-1 border-wii-blue border-opacity-50 focus:ring-wii-blue"
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
    </div>
  );
}
