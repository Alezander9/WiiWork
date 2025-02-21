import { Message } from "@/llm/types";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  CONVERSATIONAL_PROMPT,
  MALICIOUS_PROMPT,
  MATH_PROMPT,
  TOOL_USAGE_PROMPT,
  ROUTER_PROMPT,
  formatPageState,
} from "./AgentUtils";

// Types to make the routing and completion logic more maintainable
interface RouterResult {
  systemPrompt: string;
  modelName: string;
  inputMessage: string;
}

interface CompletionHelperProps {
  userMessage: string;
  chatHistory: Message[];
  pageState?: {
    cursor: any;
    components: any;
  };
}

export function useCompletionHelper() {
  const generateCompletion = useAction(api.llm.generateCompletion);

  async function routeAndComplete({
    userMessage,
    chatHistory,
    pageState,
  }: CompletionHelperProps): Promise<string> {
    // First, get the router classification
    const routerResponse = await generateCompletion({
      messages: [
        {
          role: "system",
          content: ROUTER_PROMPT,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      modelName: "gpt-4o",
      temperature: 0.7,
    });

    // Determine routing configuration
    const routeConfig = determineRouteConfig({
      routerResponse: routerResponse.content,
      userMessage,
      pageState,
    });

    // Get the final completion using the determined configuration
    const completion = await generateCompletion({
      messages: [
        {
          role: "system",
          content: routeConfig.systemPrompt,
        },
        ...chatHistory,
        {
          role: "user",
          content: routeConfig.inputMessage,
        },
      ],
      modelName: routeConfig.modelName,
      temperature: 0.7,
    });

    return completion.content;
  }

  return { routeAndComplete };
}

// Helper function to determine routing configuration
function determineRouteConfig({
  routerResponse,
  userMessage,
  pageState,
}: {
  routerResponse: string;
  userMessage: string;
  pageState?: { cursor: any; components: any };
}): RouterResult {
  const createPageContextMessage = (msg: string) => {
    if (!pageState) return msg;
    const formattedState = formatPageState(
      pageState.cursor,
      pageState.components
    );
    return `Current Page State:
      ${formattedState}
      
      User Request:
      ${msg}
      
      Please help the user by explaining what you'll do and using the available tools.`;
  };

  switch (routerResponse.trim().toLowerCase()) {
    case "simple":
      return {
        systemPrompt: TOOL_USAGE_PROMPT,
        modelName: "gpt-4o-mini",
        inputMessage: createPageContextMessage(userMessage),
      };

    case "complex":
      return {
        systemPrompt: TOOL_USAGE_PROMPT,
        modelName: "claude-3-5-sonnet-latest",
        inputMessage: createPageContextMessage(userMessage),
      };

    case "conversational":
      return {
        systemPrompt: CONVERSATIONAL_PROMPT,
        modelName: "gpt-4o",
        inputMessage: userMessage,
      };

    case "malicious":
      return {
        systemPrompt: MALICIOUS_PROMPT,
        modelName: "gpt-4o",
        inputMessage: userMessage,
      };

    case "math":
      return {
        systemPrompt: MATH_PROMPT,
        modelName: "deepseek-reason",
        inputMessage: userMessage,
      };

    default:
      console.warn("Invalid router response:", routerResponse);
      return {
        systemPrompt: TOOL_USAGE_PROMPT,
        modelName: "claude-3-5-sonnet-latest",
        inputMessage: createPageContextMessage(userMessage),
      };
  }
}
