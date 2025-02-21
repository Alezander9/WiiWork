import { useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAgentStore } from "@/stores/agentStore";

interface MobileInputListenerProps {
  onSendMessage: (message: string) => void;
}

export function MobileInputListener({
  onSendMessage,
}: MobileInputListenerProps) {
  const port = useAgentStore((state) => state.port);
  const generateNewPort = useAgentStore((state) => state.generateNewPort);
  const setUserMessage = useAgentStore((state) => state.setUserMessage);
  const markMessageProcessed = useMutation(api.mutations.markMessageProcessed);

  // Keep track of processed message IDs
  const processedMessages = useRef(new Set<string>());

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

    const processMessages = async () => {
      for (const message of messages) {
        if (processedMessages.current.has(message._id)) {
          console.log("Skipping already processed message:", message._id);
          continue;
        }

        try {
          console.log("Processing new message:", message._id);

          // Mark as processed immediately
          processedMessages.current.add(message._id);
          await markMessageProcessed({ messageId: message._id });

          // Update store with the new message
          setUserMessage(message.message, "voice");

          // Forward message to agent
          await onSendMessage(message.message);
        } catch (error) {
          console.error("Error processing message:", error);
          processedMessages.current.delete(message._id);
        }
      }
    };

    processMessages();
  }, [messages, onSendMessage, markMessageProcessed, setUserMessage]);

  // Component doesn't render anything
  return null;
}
