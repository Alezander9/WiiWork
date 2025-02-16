import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import { useAgentStore } from "@/stores/agentStore";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MobileInput() {
  const [message, setMessage] = useState("");
  const [port, setPort] = useState<string>("");
  const setInputMode = useAgentStore((state) => state.setInputMode);
  const { port: urlPort } = useParams();
  const navigate = useNavigate();
  const sendMessage = useMutation(api.mutations.sendMessage);

  // Handle URL port parameter
  useEffect(() => {
    if (urlPort && urlPort.length === 6 && /^\d+$/.test(urlPort)) {
      setPort(urlPort);
    }
  }, [urlPort]);

  // Set mobile mode on mount, restore desktop on unmount
  useEffect(() => {
    setInputMode("mobile");
    return () => setInputMode("desktop");
  }, [setInputMode]);

  const handlePortSubmit = (input: string) => {
    if (input.length === 6 && /^\d+$/.test(input)) {
      navigate(`/mobile-input/${input}`);
      setPort(input);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && port) {
      try {
        await sendMessage({
          port: port,
          message: message.trim(),
        });
        setMessage(""); // Clear input on successful send
      } catch (error) {
        console.error("Failed to send message:", error);
        // Optionally add user feedback for error
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Port Input Section */}
      {!port ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-wii-blue mb-4">
            Enter Port Number
          </h1>
          <form
            className="w-full max-w-sm space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements[0] as HTMLInputElement)
                .value;
              handlePortSubmit(input);
            }}
          >
            <Input
              type="text"
              placeholder="Enter 6-digit port number"
              className="text-center text-2xl tracking-wider"
              maxLength={6}
              pattern="\d{6}"
            />
            <Button
              type="submit"
              className="w-full bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
            >
              Connect
            </Button>
          </form>
        </div>
      ) : (
        // Main Input Interface
        <div className="flex-1 flex flex-col">
          {/* Port Display */}
          <div className="p-4 text-center bg-gray-50 border-b">
            <span className="text-sm text-gray-500">Connected to port: </span>
            <span className="font-mono font-bold">{port}</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Mic Button */}
          <div className="p-8 flex justify-center">
            <button className="w-32 h-32 rounded-full bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white flex items-center justify-center transition-colors">
              <Mic className="w-16 h-16" />
            </button>
          </div>

          {/* Text Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
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
      )}
    </div>
  );
}
