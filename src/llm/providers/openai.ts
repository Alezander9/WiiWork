import OpenAI from "openai";
import {
  LLMProviderInterface,
  Message,
  ModelConfig,
  LLMResponse,
  ProviderConfig,
  LLMError,
  AuthenticationError,
  RateLimitError,
  StreamingLLMResponse,
} from "../types";

export class OpenAIProvider implements LLMProviderInterface {
  private client: OpenAI;

  constructor(config: ProviderConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.apiEndpoint,
      dangerouslyAllowBrowser: false,
    });
  }

  private handleError(error: any): never {
    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 401:
          throw new AuthenticationError(error.message, "openai", error.status);
        case 429:
          throw new RateLimitError(error.message, "openai", error.status);
        default:
          throw new LLMError(error.message, "openai", error.status);
      }
    }
    throw new LLMError(error.message || "Unknown error", "openai");
  }

  async generateCompletion(
    messages: Message[],
    modelConfig: ModelConfig
  ): Promise<LLMResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        model: modelConfig.modelId,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: modelConfig.temperature ?? 0.7,
        max_tokens: modelConfig.maxTokens,
      });

      return {
        content: completion.choices[0].message.content || "",
        usage: completion.usage
          ? {
              inputTokens: completion.usage.prompt_tokens,
              outputTokens: completion.usage.completion_tokens,
              totalTokens: completion.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async generateStream(
    messages: Message[],
    modelConfig: ModelConfig
  ): Promise<StreamingLLMResponse> {
    try {
      const stream = await this.client.chat.completions.create({
        model: modelConfig.modelId,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: modelConfig.temperature ?? 0.7,
        max_tokens: modelConfig.maxTokens,
        stream: true,
      });

      return {
        stream: {
          async *[Symbol.asyncIterator]() {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) yield content;
            }
          },
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }
}
