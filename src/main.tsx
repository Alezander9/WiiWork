import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AgentBrain } from "./components/agent/AgentBrain.tsx";
import { AgentInput } from "./components/agent/AgentInput.tsx";
import { AgentCursor } from "./components/agent/AgentCursor.tsx";
import { useAgentStore } from "@/stores/agentStore";
import { useState } from "react";
import { AgentMobileInput } from "./components/agent/AgentMobileInput.tsx";
import "./styles/globals.css";

// Create a Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function Root() {
  const [agentResponse, setAgentResponse] = useState<string>("");
  const cursorVisible = useAgentStore((state) => state.cursor.visible);
  const cursorPosition = useAgentStore((state) => state.cursor.position);

  const handleSendMessage = async (message: string) => {
    try {
      const response = await (window as any).__agentBrain.handleUserRequest(
        message
      );
      console.log("Response:", response);
      setAgentResponse(response);
    } catch (error) {
      console.error("Error sending message:", error);
      setAgentResponse(
        "Sorry, I encountered an error processing your request."
      );
    }
  };

  return (
    <StrictMode>
      <ConvexProvider client={convex}>
        <AgentBrain />
        {cursorVisible && <AgentCursor position={cursorPosition} />}
        <AgentInput
          onSendMessage={handleSendMessage}
          agentResponse={agentResponse}
        />
        <AgentMobileInput onSendMessage={handleSendMessage} />
        <App />
      </ConvexProvider>
    </StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
