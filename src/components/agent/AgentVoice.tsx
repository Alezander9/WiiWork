import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { splitIntoChunks, TOOL_CALL_REGEX, VOICE_PRESETS } from "./AgentUtils";
import { useAgentStore } from "@/stores/agentStore";
import { useRef, useCallback, useEffect } from "react";

export function useVoiceGenerator() {
  const generateVoice = useAction(api.elevenlabs.generateVoice);
  const setVoiceState = useAgentStore((state) => state.setVoiceState);
  const updateVoiceSegment = useAgentStore((state) => state.updateVoiceSegment);
  const resetVoiceState = useAgentStore((state) => state.resetVoiceState);

  // Add ref to track current audio element and abort controller
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const abortController = useRef<AbortController | null>(null);

  // Memoize the stop function to prevent unnecessary re-renders
  const stopVoice = useCallback(() => {
    // Stop current audio playback
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current = null;
    }

    // Cancel pending voice generations
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }

    // Reset state
    setVoiceState({
      isPlaying: false,
      currentSegment: -1,
      error: null,
    });
  }, [setVoiceState]);

  // Make sure we clean up on unmount
  useEffect(() => {
    return () => {
      stopVoice();
    };
  }, [stopVoice]);

  // Update playAudioSegment to use refs
  const playAudioSegment = useCallback((audioData: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
      currentAudio.current = audio;

      audio.onended = () => {
        currentAudio.current = null;
        resolve();
      };

      audio.onerror = (error) => {
        currentAudio.current = null;
        reject(error);
      };

      audio.play().catch(reject);
    });
  }, []);

  async function generateVoiceResponse(text: string) {
    // Stop any existing playback
    stopVoice();

    console.log("=== Starting voice generation ===");
    let cleanText = text.replace(TOOL_CALL_REGEX, "").trim();

    // Use new chunking function instead of sentence splitting
    const chunks = splitIntoChunks(cleanText);
    const initialSegments = chunks.map((text) => ({
      text,
      status: "pending" as const,
    }));

    resetVoiceState();
    setVoiceState({
      segments: initialSegments,
      isPlaying: true,
    });

    // Create new abort controller
    abortController.current = new AbortController();

    try {
      await Promise.all(
        chunks.map(async (chunk, index) => {
          try {
            // Check if cancelled
            if (abortController.current?.signal.aborted) {
              throw new Error("Voice generation cancelled");
            }

            updateVoiceSegment(index, { status: "generating" });

            const result = await generateVoice({
              text: chunk,
              voiceId: VOICE_PRESETS.fast.voiceId,
              modelId: VOICE_PRESETS.fast.modelId,
              settings: VOICE_PRESETS.fast.settings,
            });

            if (result.success && result.audioData) {
              updateVoiceSegment(index, {
                audioData: result.audioData,
                status: "ready",
              });
            } else {
              updateVoiceSegment(index, { status: "failed" });
            }
          } catch (error) {
            updateVoiceSegment(index, { status: "failed" });
            if ((error as Error).message !== "Voice generation cancelled") {
              throw error;
            }
          }
        })
      );

      // Play segments sequentially
      for (let i = 0; i < chunks.length; i++) {
        // Check if cancelled
        if (abortController.current?.signal.aborted) {
          break;
        }

        setVoiceState({ currentSegment: i });
        const segment = useAgentStore.getState().voice.segments[i];

        if (segment.status === "ready" && segment.audioData) {
          await playAudioSegment(segment.audioData);
        }
      }
    } catch (error) {
      setVoiceState({ error: (error as Error).message });
    } finally {
      abortController.current = null;
      currentAudio.current = null;
      setVoiceState({ isPlaying: false, currentSegment: -1 });
    }
  }

  return { generateVoiceResponse, stopVoice };
}
