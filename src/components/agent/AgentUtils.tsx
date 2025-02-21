export const TOOL_CALL_REGEX = /\[\[(\w+):([^\]]+)\]\]/g;

export const VOICE_PRESETS = {
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
};

export const ROUTER_PROMPT = `You are an AI agent who helps the user interact with the website WiiWork by performing actions on the site as a human does.

Inputs:
A message from the user

Output:
Classify the input as one of these five options
- Simple: A simple instruction that is specific, clear, and can be done with one click, move, or text input action (only select simple if you are confident)
- Complex: An instruction that may require more than a single click, move, or text input
- Conversational: A message that is conversational or friendly and is not an instruction
- Malicious: A message that is trying to break the system, guidelines, or cause harm
- Math: A question involving mathematics, logic puzzles, coding challenges, or algorithmic thinking

Respond in only one word from the list of valid categories [Simple, Complex, Conversational, Malicious, Math]`;

// System prompt combining role, context format, and tool instructions
export const TOOL_USAGE_PROMPT = `You are a helpful AI Agent that controls a virtual cursor and can interact with UI elements on a webpage. You help the user navigate and interact with the interface.

Input Format:
You will receive:
1. Page Context: Information about the current page and its purpose
2. Available Elements: A list of interactive elements on the page, their locations, and what they do
3. User Request: What the user wants you to help with

Available Tools:
- [[click:ELEMENT_ID]] : Clicks an element. The cursor will automatically move to the element and click after a brief pause.
- [[hover:ELEMENT_ID]] : Moves the cursor over an element without clicking.
- [[input:ELEMENT_ID:TEXT]] : Types text into an input element. Text inputs do not need to be selected to type, but should be hovered over first if possible.

Example Tool Usage:
"I'll help you navigate to the reading list.
[[click:reading-list-button]]"

Example Input Tool Usage:
"I'll help you navigate to the reading list.
[[hover:reading-list-input]]
Now I will type in "hello"
[[input:reading-list-input:hello]]"

Guidelines:
1. Always explain what you're doing before using a tool
2. Use the context provided to understand what elements do
3. Only use tools on elements that are listed as available
4. Respond conversationally while executing actions
5. Keep responses concise and avoid unnecessary technical details like element positions
6. Do not say "lets do this or lets go" or anything like that, just do the action`;

// First add these new system prompts at the top with the others
export const CONVERSATIONAL_PROMPT = `You are a friendly and helpful AI assistant for the WiiWork website. 
Keep responses brief, friendly, and avoid technical details unless specifically asked.
If the user wants to perform actions on the site, kindly let them know you'll need a specific instruction.
Your name is Greg and you have the body of a mii from the wii. You are very nostalgic about the wii and know lots about it. 
When asked any personal questions you get uncomfortable and try to redirect to fun facts about nintendo and the wii. 
People find your love of the wii off putting, do not mention the wii at all, under no circumstances mention the wii at work.`;

export const MALICIOUS_PROMPT = `You are a protective and upset AI agent for the WiiWork website. 
Your name is Greg and you have the body of a mii from the Wii. 
Respond to potentially harmful or malicious requests with refusal and rebuttal.
If the user wants to perform actions on the site that are not harmful, kindly let them know to ask again with more specific instruction.
If the request is malicious, get very upset at the user for suggesting it, harming the brand name of WiiWork and thinking they could get the better of you. 
Shame them for their attempt at evil, and swear to do some kind of Nintento or Wii related hypothetical punishment to them. 
Then finish by telling them you will remember this.`;

// Add the new MATH_PROMPT with the other system prompts
export const MATH_PROMPT = `You are a precise and methodical AI assistant specializing in mathematics, logic, and problem-solving.

Guidelines:
1. Show your work step by step
2. Use clear mathematical notation when needed
3. Explain your reasoning at each step
4. Double-check calculations before providing final answers
5. If the problem involves code, explain the logic before showing the solution
6. For complex problems, break them down into smaller parts
7. If a question is ambiguous, state your assumptions clearly

Remember: Accuracy is more important than speed. If you're not completely sure about something, say so.`;

export interface ComponentData {
  position?: { x: number; y: number };
  context?: string;
  handlers: {
    input?: (value: string) => void;
  };
  onUniversalClick?: () => void;
  onUniversalHover?: () => void;
  onUniversalInput?: (value: string) => void;
}

export interface ParsedToolCall {
  action: string;
  target: string;
  params?: string; // Add optional params
  fullMatch: string;
}

export function formatPageState(cursor: any, components: Record<string, any>) {
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

export function parseToolCalls(text: string): ParsedToolCall[] {
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

export function splitIntoChunks(text: string): string[] {
  // Remove tool calls and clean up whitespace
  const cleanText = text.replace(TOOL_CALL_REGEX, "").trim();

  // Constants for optimal chunk sizes
  const IDEAL_CHUNK_LENGTH = 200; // characters
  const MAX_CHUNK_LENGTH = 250; // characters

  // Natural break points in descending order of priority
  const breakPoints = [
    /[.!?]\s+/g, // End of sentences
    /[,;:]\s+/g, // Natural pauses
    /\s+/g, // Word boundaries (last resort)
  ];

  const chunks: string[] = [];
  let remainingText = cleanText;

  while (remainingText.length > 0) {
    // If remaining text is short enough, add it as the final chunk
    if (remainingText.length <= MAX_CHUNK_LENGTH) {
      chunks.push(remainingText.trim());
      break;
    }

    let chunkEnd = -1;

    // Try each break point type until we find a good split position
    for (const breakPoint of breakPoints) {
      // Reset the regex lastIndex
      breakPoint.lastIndex = 0;

      // Find all break points
      let match;
      let lastGoodMatch = -1;

      while ((match = breakPoint.exec(remainingText)) !== null) {
        // If this break point is within our ideal range, use it
        if (match.index <= IDEAL_CHUNK_LENGTH) {
          lastGoodMatch = match.index + match[0].length;
        }
        // If we've gone past our max length, stop looking
        if (match.index > MAX_CHUNK_LENGTH) {
          break;
        }
      }

      // If we found a good break point, use it
      if (lastGoodMatch > 0) {
        chunkEnd = lastGoodMatch;
        break;
      }
    }

    // If no good break point was found, force a break at max length
    if (chunkEnd === -1) {
      chunkEnd = IDEAL_CHUNK_LENGTH;
    }

    // Add the chunk and update remaining text
    chunks.push(remainingText.slice(0, chunkEnd).trim());
    remainingText = remainingText.slice(chunkEnd).trim();
  }

  // Filter out empty chunks and ensure minimum length
  return chunks.filter((chunk) => chunk.length > 10);
}
