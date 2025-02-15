import Anthropic from "@anthropic-ai/sdk";
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

export class AnthropicProvider implements LLMProviderInterface {
  private client: Anthropic;

  constructor(config: ProviderConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  private handleError(error: any): never {
    if (error instanceof Anthropic.APIError) {
      switch (error.status) {
        case 401:
          throw new AuthenticationError(
            error.message,
            "anthropic",
            error.status
          );
        case 429:
          throw new RateLimitError(error.message, "anthropic", error.status);
        case 402:
          throw new LLMError("Insufficient balance", "anthropic", error.status);
        case 503:
          throw new RateLimitError(
            "Server overloaded",
            "anthropic",
            error.status
          );
        default:
          throw new LLMError(error.message, "anthropic", error.status);
      }
    }
    throw new LLMError(error.message || "Unknown error", "anthropic");
  }

  async generateCompletion(
    messages: Message[],
    modelConfig: ModelConfig
  ): Promise<LLMResponse> {
    try {
      // Extract system message if it exists
      const systemMessage = messages.find((msg) => msg.role === "system");
      const nonSystemMessages = messages.filter((msg) => msg.role !== "system");

      const completion = await this.client.messages.create({
        model: modelConfig.modelId,
        messages: nonSystemMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        system: systemMessage?.content,
        temperature: modelConfig.temperature ?? 1.0,
        max_tokens: modelConfig.maxTokens || 1024,
      });

      return {
        content:
          completion.content[0].type === "text"
            ? completion.content[0].text
            : "",
        usage: {
          inputTokens: completion.usage.input_tokens,
          outputTokens: completion.usage.output_tokens,
          totalTokens:
            completion.usage.input_tokens + completion.usage.output_tokens,
        },
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
      const systemMessage = messages.find((msg) => msg.role === "system");
      const nonSystemMessages = messages.filter((msg) => msg.role !== "system");

      const stream = await this.client.messages.create({
        model: modelConfig.modelId,
        messages: nonSystemMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        system: systemMessage?.content,
        temperature: modelConfig.temperature ?? 1.0,
        max_tokens: modelConfig.maxTokens || 1024,
        stream: true,
      });

      return {
        stream: {
          async *[Symbol.asyncIterator]() {
            for await (const chunk of stream) {
              if (
                chunk.type === "content_block_delta" &&
                chunk.delta.type === "text_delta"
              ) {
                yield chunk.delta.text;
              }
            }
          },
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }
}
