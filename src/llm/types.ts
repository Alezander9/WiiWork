export type LLMProvider = "openai" | "deepseek" | "anthropic";

export interface ModelConfig {
  provider: LLMProvider;
  modelId: string;
  maxTokens?: number;
  temperature?: number;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}

export type StreamingLLMResponse = {
  stream: AsyncIterable<string>;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
};

export interface ProviderConfig {
  apiKey: string;
  apiEndpoint?: string;
}

export interface LLMProviderInterface {
  generateCompletion(
    messages: Message[],
    modelConfig: ModelConfig
  ): Promise<LLMResponse>;

  generateStream(
    messages: Message[],
    modelConfig: ModelConfig
  ): Promise<StreamingLLMResponse>;
}

// Error types
export class LLMError extends Error {
  constructor(
    message: string,
    public provider: LLMProvider,
    public status?: number
  ) {
    super(message);
    this.name = "LLMError";
  }
}

export class AuthenticationError extends LLMError {}
export class RateLimitError extends LLMError {}
