import OpenAI from "openai";

export class WhisperService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async transcribeAudio(
    audioData: Blob | Buffer,
    mimeType: string = "audio/webm"
  ): Promise<string> {
    try {
      console.log(
        "WhisperService: Starting transcription with type:",
        mimeType
      );

      // Get the file extension from the MIME type
      const fileExtension = mimeType.split("/")[1].split(";")[0]; // Handle codecs in MIME type
      const fileName = `recording.${fileExtension}`;

      // Create FormData
      const formData = new FormData();

      if (audioData instanceof Buffer) {
        // For server-side (Convex)
        formData.append(
          "file",
          new Blob([audioData], { type: mimeType }),
          fileName
        );
      } else {
        // For client-side (Browser)
        formData.append("file", audioData as any, fileName);
      }
      formData.append("model", "whisper-1");
      formData.append("response_format", "text");

      // Log the actual file being sent
      const file = formData.get("file") as File;
      console.log("Sending file:", {
        type: file.type,
        size: file.size,
        name: file.name,
      });

      console.log("Sending request to OpenAI...");
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.client.apiKey}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI API error:", error);
        throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
      }

      const result = await response.text(); // Since we specified response_format: "text"
      console.log("Received response from OpenAI");

      return result;
    } catch (error) {
      console.error("WhisperService error details:", {
        error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }
}
