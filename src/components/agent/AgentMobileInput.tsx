import { useEffect, useRef } from "react";
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

    // Process messages in order
    const processMessages = async () => {
      for (const message of messages) {
        // Skip if we've already processed this message
        if (processedMessages.current.has(message._id)) {
          console.log("Skipping already processed message:", message._id);
          continue;
        }

        try {
          console.log("Processing new message:", message._id);

          // Mark as processed immediately to prevent duplicates
          processedMessages.current.add(message._id);

          // Mark as processed in DB before processing
          await markMessageProcessed({ messageId: message._id });

          // Then forward message to agent
          await onSendMessage(message.message);
        } catch (error) {
          console.error("Error processing message:", error);
          // Remove from processed set if failed
          processedMessages.current.delete(message._id);
        }
      }
    };

    processMessages();
  }, [messages, onSendMessage, markMessageProcessed]);

  // Component doesn't render anything
  return null;
}
