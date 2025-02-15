/*
Names of working models:
"gpt-4o"
"gpt-4o-mini"
"deepseek-chat"
"deepseek-reason"
"claude-3-5-sonnet-latest"
"claude-3-5-haiku-latest"
*/

import {
  LLMProvider,
  LLMProviderInterface,
  ProviderConfig,
  ModelConfig,
  Message,
  LLMResponse,
  StreamingLLMResponse,
} from "./types";
import { OpenAIProvider } from "./providers/openai";
import { DeepSeekProvider } from "./providers/deepseek";
import { AnthropicProvider } from "./providers/anthropic";
export class LLMFactory {
  private static providers: Map<LLMProvider, LLMProviderInterface> = new Map();

  static initialize(configs: Record<LLMProvider, ProviderConfig>) {
    // Initialize providers with their configs
    if (configs.openai) {
      this.providers.set("openai", new OpenAIProvider(configs.openai));
    }
    if (configs.deepseek) {
      this.providers.set("deepseek", new DeepSeekProvider(configs.deepseek));
    }
    if (configs.anthropic) {
      this.providers.set("anthropic", new AnthropicProvider(configs.anthropic));
    }
    // Add other providers here as they're implemented
    // if (configs.anthropic) {
    //   this.providers.set('anthropic', new AnthropicProvider(configs.anthropic));
    // }
  }

  // Method to switch specific provider's config
  static updateProviderConfig(provider: LLMProvider, config: ProviderConfig) {
    switch (provider) {
      case "openai":
        this.providers.set("openai", new OpenAIProvider(config));
        break;
      case "anthropic":
        this.providers.set("anthropic", new AnthropicProvider(config));
        break;
      case "deepseek":
        this.providers.set("deepseek", new DeepSeekProvider(config));
        break;
    }
  }

  // Reset specific provider to default config
  static resetProvider(provider: LLMProvider, defaultConfig: ProviderConfig) {
    this.updateProviderConfig(provider, defaultConfig);
  }

  static getProvider(provider: LLMProvider): LLMProviderInterface {
    const implementation = this.providers.get(provider);
    if (!implementation) {
      throw new Error(`Provider ${provider} not initialized`);
    }
    return implementation;
  }

  static async generateCompletion(
    messages: Message[],
    modelConfig: ModelConfig
  ): Promise<LLMResponse> {
    const provider = this.getProvider(modelConfig.provider);
    return await provider.generateCompletion(messages, modelConfig);
  }

  static async generateStream(
    messages: Message[],
    modelConfig: ModelConfig
  ): Promise<StreamingLLMResponse> {
    const provider = this.getProvider(modelConfig.provider);
    return await provider.generateStream(messages, modelConfig);
  }
}
