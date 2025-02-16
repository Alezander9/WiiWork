import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAgentStore } from "@/stores/agentStore";

interface AgentMobileInputProps {
  onSendMessage: (message: string) => void;
}

export function AgentMobileInput({ onSendMessage }: AgentMobileInputProps) {
  const port = useAgentStore((state) => state.port);
  const generateNewPort = useAgentStore((state) => state.generateNewPort);
  const markMessageProcessed = useMutation(api.mutations.markMessageProcessed);

  // Generate port on mount if not exists
  useEffect(() => {
    if (!port) {
      generateNewPort();
    }
  }, [port, generateNewPort]);

  // Subscribe to unprocessed messages
  const messages = useQuery(api.queries.getUnprocessedMessages, { port });

  // Process new messages
  useEffect(() => {
    if (!messages?.length) return;

    console.log("=== Processing Messages ===");
    console.log("Messages:", messages);

    // Process messages in order
    const processMessages = async () => {
      for (const message of messages) {
        try {
          console.log("Processing message:", message);
          // Forward message to agent
          await onSendMessage(message.message);
          console.log("Message processed, marking as done:", message._id);
          // Mark as processed
          await markMessageProcessed({ messageId: message._id });
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    };

    processMessages();
  }, [messages, onSendMessage, markMessageProcessed]);

  // Component doesn't render anything
  return null;
}
