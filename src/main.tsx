import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AgentBrain } from "./components/agent/AgentBrain.tsx";
import { AgentCursor } from "./components/agent/AgentCursor.tsx";
import { useAgentStore } from "@/stores/agentStore";

// Create a Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function Root() {
  const cursorVisible = useAgentStore((state) => state.cursor.visible);
  const cursorPosition = useAgentStore((state) => state.cursor.position);

  return (
    <StrictMode>
      <ConvexProvider client={convex}>
        <AgentBrain />
        {cursorVisible && <AgentCursor position={cursorPosition} />}
        <App />
      </ConvexProvider>
    </StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
