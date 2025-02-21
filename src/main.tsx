import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AgentBrain } from "./components/agent/AgentBrain.tsx";
import { AgentChatBox } from "./components/agent/AgentChatBox.tsx";
import { AgentCursor } from "./components/agent/AgentCursor.tsx";
import { useAgentStore } from "@/stores/agentStore";
import { MobileInputListener } from "./components/agent/MobileInputListener.tsx";
import "./styles/globals.css";
import { StateDebugPanel } from "./components/agent/AgentStateDebugPanel.tsx";
import { useSettingsStore } from "@/stores/settingsStore";

// Create a Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function Root() {
  const cursorVisible = useAgentStore((state) => state.cursor.visible);
  const cursorPosition = useAgentStore((state) => state.cursor.position);
  const showStateDebugPanel = useSettingsStore(
    (state) => state.showStateDebugPanel
  );

  const handleSendMessage = async (message: string) => {
    try {
      await (window as any).__agentBrain.handleUserRequest(message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <StrictMode>
      <ConvexProvider client={convex}>
        {showStateDebugPanel && <StateDebugPanel />}
        <AgentBrain />
        {cursorVisible && <AgentCursor position={cursorPosition} />}
        <AgentChatBox onSendMessage={handleSendMessage} />
        <MobileInputListener onSendMessage={handleSendMessage} />
        <App />
      </ConvexProvider>
    </StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
