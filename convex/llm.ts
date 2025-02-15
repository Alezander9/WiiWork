import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { LLMFactory } from "../src/llm/factory";
import {
  LLMProvider,
  LLMResponse,
  StreamingLLMResponse,
} from "../src/llm/types";

// Initialize LLM providers with environment variables
LLMFactory.initialize({
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY!,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
  },
});

// Internal action that handles the actual API call
export const internalGenerateCompletion = internalAction({
  args: {
    messages: v.array(
      v.object({
        role: v.union(
          v.literal("system"),
          v.literal("user"),
          v.literal("assistant")
        ),
        content: v.string(),
      })
    ),
    modelName: v.string(),
    maxTokens: v.optional(v.number()),
    temperature: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      // Determine provider from model name
      let provider: LLMProvider = "openai";
      if (args.modelName.includes("deepseek")) {
        provider = "deepseek";
      } else if (args.modelName.includes("claude")) {
        provider = "anthropic";
      }

      const response = await LLMFactory.generateCompletion(args.messages, {
        provider,
        modelId: args.modelName,
        maxTokens: args.maxTokens,
        temperature: args.temperature ?? 1.0,
      });

      return response;
    } catch (error) {
      console.error("Error generating completion:", error);
      throw error;
    }
  },
});

// Public wrapper action
export const generateCompletion = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(
          v.literal("system"),
          v.literal("user"),
          v.literal("assistant")
        ),
        content: v.string(),
      })
    ),
    modelName: v.string(),
    maxTokens: v.optional(v.number()),
    temperature: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<LLMResponse> => {
    return await ctx.runAction(internal.llm.internalGenerateCompletion, args);
  },
});

// Internal streaming action
export const internalGenerateStream = internalAction({
  args: {
    messages: v.array(
      v.object({
        role: v.union(
          v.literal("system"),
          v.literal("user"),
          v.literal("assistant")
        ),
        content: v.string(),
      })
    ),
    modelName: v.string(),
    maxTokens: v.optional(v.number()),
    temperature: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      // Determine provider from model name
      let provider: LLMProvider = "openai";
      if (args.modelName.includes("deepseek")) {
        provider = "deepseek";
      } else if (args.modelName.includes("claude")) {
        provider = "anthropic";
      }

      const response = await LLMFactory.generateStream(args.messages, {
        provider,
        modelId: args.modelName,
        maxTokens: args.maxTokens,
        temperature: args.temperature ?? 1.0,
      });

      return response;
    } catch (error) {
      console.error("Error generating stream:", error);
      throw error;
    }
  },
});

// Public wrapper action
export const generateStream = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(
          v.literal("system"),
          v.literal("user"),
          v.literal("assistant")
        ),
        content: v.string(),
      })
    ),
    modelName: v.string(),
    maxTokens: v.optional(v.number()),
    temperature: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<StreamingLLMResponse> => {
    return await ctx.runAction(internal.llm.internalGenerateStream, args);
  },
});
