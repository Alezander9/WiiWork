import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import { useAgentStore } from "@/stores/agentStore";
import { useParams, useNavigate } from "react-router-dom";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AgentButton } from "@/components/agent-ui/AgentButton";

export default function MobileInput() {
  const [message, setMessage] = useState("");
  const [port, setPort] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const setInputMode = useAgentStore((state) => state.setInputMode);
  const { port: urlPort } = useParams();
  const navigate = useNavigate();
  const sendMessage = useMutation(api.mutations.sendMessage);
  const transcribeAudio = useAction(api.whisper.transcribeAudio);

  // Handle URL port parameter
  useEffect(() => {
    if (urlPort && urlPort.length === 6 && /^\d+$/.test(urlPort)) {
      setPort(urlPort);
    }
  }, [urlPort]);

  // Set mobile mode on mount, restore desktop on unmount
  useEffect(() => {
    setInputMode("mobile");
    return () => setInputMode("desktop");
  }, [setInputMode]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm", // More widely supported format
      });
      console.log("MediaRecorder created with options:", {
        mimeType: mediaRecorder.mimeType,
        state: mediaRecorder.state,
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        console.log("Recording completed, blob size:", audioBlob.size);

        try {
          setIsTranscribing(true);
          // Convert Blob to base64
          const buffer = await audioBlob.arrayBuffer();
          const base64Audio = btoa(
            String.fromCharCode(...new Uint8Array(buffer))
          );

          // Call Convex action
          const result = await transcribeAudio({ audioData: base64Audio });
          console.log("Transcription result:", result);

          if (result.success && result.transcript.trim()) {
            // Set the transcript in the input field
            setMessage(result.transcript.trim());
            // Automatically send it
            await sendMessage({
              port: port,
              message: result.transcript.trim(),
            });
            // Clear the input after sending
            setMessage("");
          } else if (result.error) {
            console.error("Transcription error:", result.error);
            console.log("Failed to transcribe audio");
          }
        } catch (error) {
          console.error("Failed to process audio:", error);
          console.log("Failed to process audio");
        } finally {
          setIsTranscribing(false);
        }

        // Clean up
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePortSubmit = (input: string) => {
    if (input.length === 6 && /^\d+$/.test(input)) {
      navigate(`/mobile-input/${input}`);
      setPort(input);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && port) {
      try {
        await sendMessage({
          port: port,
          message: message.trim(),
        });
        setMessage(""); // Clear input on successful send
      } catch (error) {
        console.error("Failed to send message:", error);
        // Optionally add user feedback for error
      }
    }
  };

  const handleDisconnect = () => {
    setPort("");
    navigate("/mobile-input"); // Remove port from URL
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Port Input Section */}
      {!port ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {/* Back Button */}
          <div className="w-full max-w-sm mb-8">
            <AgentButton
              controlId="back-button"
              onUniversalClick={() => navigate("/")}
              context="This button returns you to the home page"
              className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal"
            >
              Back
            </AgentButton>
          </div>

          <h1 className="text-2xl font-bold text-wii-blue mb-4">
            Enter Port Number
          </h1>
          <form
            className="w-full max-w-sm space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements[0] as HTMLInputElement)
                .value;
              handlePortSubmit(input);
            }}
          >
            <Input
              type="text"
              placeholder="Enter 6-digit port number"
              className="text-center text-2xl tracking-wider"
              maxLength={6}
              pattern="\d{6}"
            />
            <Button
              type="submit"
              className="w-full bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
            >
              Connect
            </Button>
          </form>
        </div>
      ) : (
        // Main Input Interface
        <div className="flex-1 flex flex-col">
          {/* Port Display with Disconnect */}
          <div className="p-4 flex items-center justify-between bg-gray-50 border-b">
            <div>
              <span className="text-sm text-gray-500">Connected to port: </span>
              <span className="font-mono font-bold">{port}</span>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="ghost"
              className="text-gray-600 hover:text-red-600"
            >
              Disconnect
            </Button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Mic Button */}
          <div className="p-8 flex justify-center">
            <button
              className={`w-32 h-32 rounded-full transition-colors flex items-center justify-center
                ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse ring-4 ring-red-300"
                    : isTranscribing
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
                }`}
              onClick={toggleRecording}
              disabled={isTranscribing}
            >
              <Mic
                className={`w-16 h-16 ${isRecording ? "animate-bounce" : ""}`}
              />
            </button>
          </div>

          {/* Text Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!message.trim()}
                className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
