import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAgentStore } from "@/stores/agentStore";
import { Message } from "@/llm/types";

const TOOL_CALL_REGEX = /\[\[(\w+):([^\]]+)\]\]/g;

// System prompt combining role, context format, and tool instructions
const SYSTEM_PROMPT = `You are a helpful AI assistant that controls a virtual cursor and can interact with UI elements on a webpage. You help users navigate and interact with the interface.

Input Format:
You will receive:
1. Page Context: Information about the current page and its purpose
2. Available Elements: A list of interactive elements on the page, their locations, and what they do
3. User Request: What the user wants you to help with

Available Tools:
- [[click:ELEMENT_ID]] : Clicks an element. The cursor will automatically move to the element and click after a brief pause.
- [[hover:ELEMENT_ID]] : Moves the cursor over an element without clicking.
- [[input:ELEMENT_ID:TEXT]] : Types text into an input element

Example Tool Usage:
"I'll help you navigate to the reading list.
[[click:reading-list-button]]"

Example Input Tool Usage:
"I'll help you navigate to the reading list.
[[input:reading-list-input:hello]]"

Guidelines:
1. Always explain what you're doing before using a tool
2. Use the context provided to understand what elements do
3. Only use tools on elements that are listed as available
4. Respond conversationally while executing actions
5. Keep responses concise and avoid unnecessary technical details`;

// Move selectors outside component to prevent recreation
const selectCursor = (state: any) => state.cursor;
const selectComponents = (state: any) => state.components;

// Helper function to format page state into natural language
function formatPageState(cursor: any, components: Record<string, any>) {
  let output = "";

  // Get current page name from URL
  const currentPage =
    window.location.pathname === "/"
      ? "Welcome Page"
      : window.location.pathname
          .slice(1)
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

  // Start with page description
  output += `Current page: ${currentPage}\n\n`;

  // Add page context if it exists
  const pageContexts = Object.entries(components).filter(([id]) =>
    id.startsWith("page-context")
  );
  if (pageContexts.length > 0) {
    output += "Page Context:\n";
    pageContexts.forEach(([_, component]) => {
      if (component.context) {
        output += `${component.context}\n`;
      }
    });
    output += "\n";
  }

  // Add cursor information
  output += `Cursor: ${cursor.visible ? "visible" : "hidden"}, position: (${Math.round(
    cursor.position.x
  )}, ${Math.round(cursor.position.y)})\n\n`;

  // Add interactive elements (excluding page contexts)
  const interactiveElements = Object.entries(components).filter(
    ([id]) => !id.startsWith("page-context")
  );

  if (interactiveElements.length > 0) {
    output += "Interactive elements:\n";
    interactiveElements.forEach(([id, component]: [string, any]) => {
      const position = component.position;
      const positionText = position
        ? `at position (${Math.round(position.x)}, ${Math.round(position.y)})`
        : "position not available";

      output += `- ${id}: ${positionText}\n`;
      if (component.context) {
        output += `  Context: ${component.context}\n`;
      }
    });
  } else {
    output += "No interactive elements on this page.\n";
  }

  return output;
}

// Update ParsedToolCall interface to handle input parameters
interface ParsedToolCall {
  action: string;
  target: string;
  params?: string; // Add optional params
  fullMatch: string;
}

function parseToolCalls(text: string): ParsedToolCall[] {
  const calls = [];
  let match;

  while ((match = TOOL_CALL_REGEX.exec(text)) !== null) {
    const [action, targetAndParams] = [match[1], match[2]];
    const parts = targetAndParams.split(":");

    calls.push({
      action,
      target: parts[0], // First part is always the target
      params: parts[1], // Second part (if exists) is params
      fullMatch: match[0],
    });
  }
  return calls;
}

// Function to create formatted input for the agent
function createAgentInput(userMessage: string, pageState: string): string {
  return `Current Page State:
${pageState}

User Request:
${userMessage}

Please help the user by explaining what you'll do and using the available tools.`;
}

// Add these types
interface ToolCallError extends Error {
  type: "INVALID_TOOL" | "INVALID_TARGET";
}

// Add sleep utility
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Add this near the top of the file
const VOICE_PRESETS = {
  default: {
    voiceId: "TxGEqnHWrfWFTfGW9XjX", // Josh
    settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      speaking_rate: 1.0,
    },
  },
  fast: {
    voiceId: "TxGEqnHWrfWFTfGW9XjX",
    modelId: "eleven_turbo_v2",
    settings: {
      stability: 0.1,
      similarity_boost: 0.5,
      style: 0.0,
      speaking_rate: 2.0,
    },
  },
  clear: {
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
    modelId: "eleven_multilingual_v2",
    settings: {
      stability: 0.8,
      similarity_boost: 0.8,
      style: 0.0,
      speaking_rate: 0.9,
    },
  },
  expressive: {
    voiceId: "TxGEqnHWrfWFTfGW9XjX", // Josh
    modelId: "eleven_multilingual_v2",
    settings: {
      stability: 0.3, // Lower stability for more variation
      similarity_boost: 0.6, // Moderate voice matching
      style: 0.8, // High expressiveness
      speaking_rate: 1.1, // Slightly faster than normal
    },
  },
  jamahal: {
    voiceId: "bIHbv24MWmeRgasZH58o",
    modelId: "eleven_flash_v2.5",
    settings: {
      stability: 0.3, // Can adjust these settings
      similarity_boost: 0.6, // to get the voice character
      style: 0.8, // you want
      speaking_rate: 2.0,
    },
  },
};

// Add tool execution functions
async function executeToolCall(toolCall: ParsedToolCall) {
  const { action, target } = toolCall;

  // Verify target exists
  const targetComponent = useAgentStore.getState().components[target];
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

      break;
    }

    case "input": {
      const component = useAgentStore.getState().components[target];
      if (component?.handlers.input && toolCall.params) {
        component.handlers.input(toolCall.params);
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
  const generateCompletion = useAction(api.llm.generateCompletion);
  const generateVoice = useAction(api.elevenlabs.generateVoice);

  // Update the generateVoiceResponse function
  async function generateVoiceResponse(text: string) {
    let cleanText = text.replace(TOOL_CALL_REGEX, "").trim();

    // maximum 50 words
    const maxLength = 50;
    if (cleanText.split(" ").length > maxLength) {
      cleanText = cleanText.slice(0, maxLength);
    }

    console.log("cleanText", cleanText);

    try {
      // Use the fast preset for quicker responses
      const preset = VOICE_PRESETS.fast; // or .clear or .default

      const result = await generateVoice({
        text: cleanText,
        voiceId: preset.voiceId,
        modelId: preset.modelId,
        settings: preset.settings,
      });

      if (result.success && result.audioData) {
        const audio = new Audio(`data:audio/mp3;base64,${result.audioData}`);
        await audio.play();
      } else {
        console.error("Voice generation failed:", result.error);
      }
    } catch (error) {
      console.error("Error generating voice:", error);
    }
  }

  // Update initial system message
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ]);

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

  // Method to get completion from GPT-4
  const getCompletion = async (messages: Message[]) => {
    try {
      const response = await generateCompletion({
        messages,
        modelName: "gpt-4o-mini",
        temperature: 0.7,
      });

      // Add the response to chat history
      addAssistantMessage(response.content);
      return response.content;
    } catch (error) {
      console.error("Error getting completion:", error);
      throw error;
    }
  };

  // Update the handleResponse function
  async function handleResponse(
    response: string,
    addAssistantMessage: (content: string) => void
  ) {
    // First, update the UI with the response
    addAssistantMessage(response);

    // Generate voice in parallel with tool execution
    generateVoiceResponse(response).catch((error) => {
      console.error("Error generating voice:", error);
    });

    try {
      const toolCalls = parseToolCalls(response);
      await sleep(500); // Give user time to start reading

      for (const toolCall of toolCalls) {
        try {
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
      // Set responding to false only after everything is done
      console.log("Setting isResponding to false");
      useAgentStore.getState().isResponding = false;
    }
  }

  // Update handleUserRequest
  async function handleUserRequest(userMessage: string) {
    const pageState = formatPageState(cursor, components);
    const formattedInput = createAgentInput(userMessage, pageState);

    console.log("formattedInput", formattedInput);

    // Set responding state to true immediately
    console.log("Setting isResponding to true");
    useAgentStore.getState().isResponding = true;

    try {
      const response = await getCompletion([
        ...chatHistory,
        { role: "user", content: formattedInput },
      ]);

      // Add user message to history
      addUserMessage(formattedInput);

      // Start response handling in a separate async operation
      handleResponse(response, addAssistantMessage).catch((error) => {
        console.error("Error in response handling:", error);
        useAgentStore.getState().isResponding = false;
      });

      return response;
    } catch (error) {
      console.error("Error handling user request:", error);
      useAgentStore.getState().isResponding = false;
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
