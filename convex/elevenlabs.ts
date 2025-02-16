"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "node:stream";

// Helper function to convert stream to buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// Internal action that has access to API key
export const internalGenerateVoice = internalAction({
  args: {
    text: v.string(),
    voiceId: v.optional(v.string()),
    modelId: v.optional(v.string()),
    settings: v.optional(
      v.object({
        stability: v.number(),
        similarity_boost: v.number(),
        style: v.number(),
        speaking_rate: v.number(),
      })
    ),
  },
  handler: async (_ctx, args) => {
    try {
      const client = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY!,
      });

      const audioStream = await client.textToSpeech.convert(
        args.voiceId ?? "TxGEqnHWrfWFTfGW9XjX", // Josh voice ID
        {
          text: args.text,
          model_id: args.modelId ?? "eleven_multilingual_v2",
          voice_settings: args.settings ?? {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            speaking_rate: 1.0,
          },
          output_format: "mp3_44100_128",
        }
      );

      // Convert stream to buffer, then to base64
      const audioBuffer = await streamToBuffer(audioStream);
      const base64Audio = audioBuffer.toString("base64");

      return {
        success: true,
        audioData: base64Audio,
      };
    } catch (error) {
      console.error("Voice generation error:", error);
      return {
        success: false,
        error: "Failed to generate voice",
      };
    }
  },
});

// Define return type for the action
interface VoiceGenerationResult {
  success: boolean;
  audioData?: string;
  error?: string;
}

// Public wrapper action with type annotation
export const generateVoice = action({
  args: {
    text: v.string(),
    voiceId: v.optional(v.string()),
    modelId: v.optional(v.string()),
    settings: v.optional(
      v.object({
        stability: v.number(),
        similarity_boost: v.number(),
        style: v.number(),
        speaking_rate: v.number(),
      })
    ),
  },
  handler: async (ctx, args): Promise<VoiceGenerationResult> => {
    return await ctx.runAction(internal.elevenlabs.internalGenerateVoice, args);
  },
});
