"use node"; // Enable Node.js runtime

import { Buffer } from "node:buffer";
import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { WhisperService } from "../src/whisper/whisperService";

interface TranscriptionResult {
  success: boolean;
  transcript: string;
  error?: string;
}

// Internal action that has access to API key
export const internalTranscribeAudio = internalAction({
  args: {
    audioData: v.string(), // Base64 encoded audio data
    mimeType: v.string(), // MIME type of the audio
  },
  handler: async (_ctx, args): Promise<TranscriptionResult> => {
    console.log("Starting transcription process...");
    console.log("Audio data length:", args.audioData.length);

    try {
      const whisperService = new WhisperService(process.env.OPENAI_API_KEY!);

      // Log before base64 conversion
      console.log("Converting base64 to binary...");
      const binaryData = Uint8Array.from(atob(args.audioData), (c) =>
        c.charCodeAt(0)
      );
      console.log("Binary data length:", binaryData.length);

      // Create buffer from binary data
      const audioBuffer = Buffer.from(binaryData.buffer);

      console.log("Created audio buffer:", {
        size: audioBuffer.length,
        type: "audio/webm",
      });

      // Pass the buffer directly to the WhisperService
      const transcript = await whisperService.transcribeAudio(audioBuffer);
      console.log("Received transcript:", transcript);

      return {
        success: true,
        transcript,
      };
    } catch (error) {
      console.error("Detailed transcription error:", {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return {
        success: false,
        transcript: "",
        error: "Failed to transcribe audio",
      };
    }
  },
});

// Public action that clients can call
export const transcribeAudio = action({
  args: {
    audioData: v.string(), // Base64 encoded audio data
    mimeType: v.string(), // MIME type of the audio
  },
  handler: async (ctx, args): Promise<TranscriptionResult> => {
    try {
      return await ctx.runAction(internal.whisper.internalTranscribeAudio, {
        audioData: args.audioData,
        mimeType: args.mimeType,
      });
    } catch (error) {
      console.error("Audio transcription failed:", error);
      return {
        success: false,
        transcript: "",
        error: "Failed to process audio",
      };
    }
  },
});
