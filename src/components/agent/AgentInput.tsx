import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AgentInputProps {
  onSendMessage: (message: string) => void;
  agentResponse?: string;
}

export function AgentInput({ onSendMessage, agentResponse }: AgentInputProps) {
  const [message, setMessage] = useState("");
  const responseEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when response updates
  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [agentResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      {/* Response Display */}
      <div className="max-h-48 overflow-y-auto p-4 bg-gray-50">
        {agentResponse ? (
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {agentResponse}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">
            Type a message to interact with the agent...
          </div>
        )}
        <div ref={responseEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask the agent to help you navigate..."
          className="flex-1"
        />
        <Button type="submit" disabled={!message.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
