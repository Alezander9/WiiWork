import { useEffect, useState } from "react";
import { useAgentStore } from "@/stores/agentStore";
import { Message } from "@/llm/types";
import { playButtonSound } from "@/lib/sounds";
import { ComponentData, ParsedToolCall, parseToolCalls } from "./AgentUtils";
import { useCompletionHelper } from "./AgentChatCompletion";
import { useVoiceGenerator } from "./AgentVoice";

const selectCursor = (state: any) => state.cursor;
const selectComponents = (state: any) => state.components;

// Add these types
interface ToolCallError extends Error {
  type: "INVALID_TOOL" | "INVALID_TARGET";
}

// Add sleep utility
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Add tool execution functions
async function executeToolCall(toolCall: ParsedToolCall) {
  const { action, target } = toolCall;

  // Verify target exists
  const targetComponent = useAgentStore.getState().components[
    target
  ] as ComponentData;
  if (!targetComponent) {
    const error = new Error(
      `Target element "${target}" not found`
    ) as ToolCallError;
    error.type = "INVALID_TARGET";
    throw error;
  }

  // Get target position
  const position = targetComponent.position;
  if (!position) {
    const error = new Error(
      `Position for "${target}" not available`
    ) as ToolCallError;
    error.type = "INVALID_TARGET";
    throw error;
  }

  switch (action) {
    case "click": {
      // Move cursor
      useAgentStore.getState().setCursorPosition({
        x: position.x,
        y: position.y,
      });

      // Wait for movement
      await sleep(500);

      // Hover
      useAgentStore.getState().triggerInteraction(target, "hover");

      // Wait for hover effect
      await sleep(500);

      // Click
      useAgentStore.getState().triggerInteraction(target, "click");

      // Special case for settings buttons
      if (target === "settings-button") {
        playButtonSound.settingsOpen();
      } else if (target === "close-settings-button") {
        playButtonSound.settingsClose();
      } else {
        playButtonSound.click();
      }

      // Execute click
      targetComponent.onUniversalClick?.();
      break;
    }

    case "hover": {
      // Move cursor
      useAgentStore.getState().setCursorPosition({
        x: position.x,
        y: position.y,
      });

      // Wait for movement
      await sleep(500);

      // Trigger hover interaction
      useAgentStore.getState().triggerInteraction(target, "hover");

      // Play hover sound
      playButtonSound.hover();

      break;
    }

    case "input": {
      const component = useAgentStore.getState().components[target];
      if (component?.handlers.input && toolCall.params) {
        component.handlers.input(toolCall.params);

        // Play type sound
        playButtonSound.type();
      }
      break;
    }

    default: {
      const error = new Error(`Invalid tool "${action}"`) as ToolCallError;
      error.type = "INVALID_TOOL";
      throw error;
    }
  }
}

export function AgentBrain() {
  const { generateVoiceResponse, stopVoice } = useVoiceGenerator();

  // First, let's not set an initial system message in the chat history
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  // Get the current page state from zustand using separate selectors
  const cursor = useAgentStore(selectCursor);
  const components = useAgentStore(selectComponents);

  // Method to add a user message
  const addUserMessage = (content: string) => {
    setChatHistory((prev) => [...prev, { role: "user", content }]);
  };

  // Method to add an assistant message
  const addAssistantMessage = (content: string) => {
    setChatHistory((prev) => [...prev, { role: "assistant", content }]);
  };

  // Add state setters from agentStore
  const setAgentGenerating = useAgentStore((state) => state.setAgentGenerating);
  const setToolExecution = useAgentStore((state) => state.setToolExecution);
  const setAgentResponse = useAgentStore((state) => state.setAgentResponse);
  const clearAgentResponse = useAgentStore((state) => state.clearAgentResponse);

  // Update the handleResponse function
  async function handleResponse(
    response: string,
    addAssistantMessage: (content: string) => void
  ) {
    setAgentResponse(response, false);
    addAssistantMessage(response);

    // Generate voice in parallel with tool execution
    generateVoiceResponse(response).catch((error) => {
      console.error("Error generating voice:", error);
    });

    try {
      const toolCalls = parseToolCalls(response);
      await sleep(500);

      setAgentGenerating(false);
      setToolExecution(true);

      for (const toolCall of toolCalls) {
        try {
          setToolExecution(true, toolCall.fullMatch);
          await executeToolCall(toolCall);
        } catch (error) {
          if ((error as ToolCallError).type === "INVALID_TOOL") {
            console.error(`Invalid tool call: ${toolCall.fullMatch}`);
          } else if ((error as ToolCallError).type === "INVALID_TARGET") {
            console.error(`Invalid target in tool call: ${toolCall.fullMatch}`);
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Error executing tool calls:", error);
    } finally {
      setAgentResponse(response, true);
      setAgentGenerating(false);
      setToolExecution(false);
    }
  }

  const { routeAndComplete } = useCompletionHelper();

  async function handleUserRequest(userMessage: string) {
    setAgentGenerating(true);
    clearAgentResponse();
    stopVoice();

    try {
      addUserMessage(userMessage);

      const response = await routeAndComplete({
        userMessage,
        chatHistory,
        pageState: {
          cursor,
          components,
        },
      });

      await handleResponse(response, addAssistantMessage).catch((error) => {
        console.error("Error in response handling:", error);
        setAgentGenerating(false);
        setToolExecution(false);
        setAgentResponse(response, true);
      });

      return response;
    } catch (error) {
      console.error("Error handling user request:", error);
      setAgentGenerating(false);
      setToolExecution(false);
      throw error;
    }
  }

  // Update debug methods
  useEffect(() => {
    (window as any).__agentBrain = {
      ...((window as any).__agentBrain || {}),
      handleUserRequest,
      parseToolCalls,
    };
  }, [chatHistory, cursor, components]);

  // The component doesn't render anything visible
  return null;
}
