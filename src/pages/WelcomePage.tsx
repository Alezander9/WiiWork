import { AgentButton, AgentIconButton } from "@/components/agent-ui";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAgentStore } from "@/stores/agentStore";
import { AgentCursor } from "@/components/agent/AgentCursor";
import { Settings } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function WelcomePage() {
  const navigate = useNavigate();
  const generateCompletion = useAction(api.llm.generateCompletion);

  // Hooks must be top level
  const cursorVisible = useAgentStore((state) => state.cursor.visible);
  const cursorPosition = useAgentStore((state) => state.cursor.position);

  const testLLM = async () => {
    try {
      const response = await generateCompletion({
        messages: [
          {
            role: "system",
            content:
              "You are a professional French pastry chef with decades of experience.",
          },
          {
            role: "user",
            content:
              "What ingredients do I need to make a classic crème brûlée?",
          },
        ],
        modelName: "gpt-4",
        temperature: 0.7,
      });

      console.log("Chef's Response:", response.content);
    } catch (error) {
      console.error("Error testing LLM:", error);
    }
  };

  return (
    <>
      {/* Cursor outside the spaced container */}
      {cursorVisible && <AgentCursor position={cursorPosition} />}

      <div className="container mx-auto py-8 space-y-8">
        {/* Add settings button */}
        <div className="absolute top-4 left-4">
          <AgentIconButton
            controlId="settings-button"
            onUniversalClick={() => {
              console.log("Settings clicked!");
            }}
            className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
          >
            <Settings className="w-6 h-6" />
          </AgentIconButton>
        </div>

        <h1 className="text-4xl font-bold text-center mb-8 text-wii-blue">
          WiiWork
        </h1>

        <div className="flex flex-col items-center gap-6">
          <AgentButton
            controlId="reading-list-button"
            onUniversalClick={() => {
              console.log("Reading List clicked!");
              navigate("/reading-list");
            }}
            className="w-64 bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal"
          >
            Reading List
          </AgentButton>

          <AgentButton
            controlId="admin-button"
            onUniversalClick={() => {
              console.log("Admin clicked!");
              navigate("/admin");
            }}
            className="w-64 bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal"
          >
            Admin Panel
          </AgentButton>

          {/* Dev Controls - styled distinctly */}
          <div className="mt-12 p-4 border-2 border-red-500 rounded-lg">
            <p className="text-red-500 font-bold mb-2">Dev Controls</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => {
                  useAgentStore
                    .getState()
                    .triggerInteraction("reading-list-button", "hover");
                }}
                className="bg-red-200 hover:bg-red-300 text-red-700"
              >
                Hover Reading List
              </Button>
              <Button
                onClick={() => {
                  useAgentStore
                    .getState()
                    .triggerInteraction("reading-list-button", "click");
                }}
                className="bg-red-200 hover:bg-red-300 text-red-700"
              >
                Click Reading List
              </Button>
              <Button
                onClick={() => {
                  const position = useAgentStore
                    .getState()
                    .getComponentPosition("reading-list-button");
                  console.log("Reading List Button Position:", position);
                }}
                className="bg-red-200 hover:bg-red-300 text-red-700"
              >
                Log Position
              </Button>
              <Button
                onClick={() => {
                  useAgentStore
                    .getState()
                    .setCursorVisible(!useAgentStore.getState().cursor.visible);
                }}
                className="bg-red-200 hover:bg-red-300 text-red-700"
              >
                Toggle Cursor
              </Button>
              <Button
                onClick={() => {
                  const position = useAgentStore
                    .getState()
                    .getComponentPosition("reading-list-button");
                  if (position) {
                    useAgentStore.getState().setCursorPosition({
                      x: position.x,
                      y: position.y,
                    });
                  }
                }}
                className="bg-red-200 hover:bg-red-300 text-red-700"
              >
                Move to Reading List
              </Button>
              <Button
                onClick={() => {
                  useAgentStore.getState().setCursorPosition({
                    x: window.innerWidth - 50,
                    y: window.innerHeight - 50,
                  });
                }}
                className="bg-red-200 hover:bg-red-300 text-red-700"
              >
                Move to Corner
              </Button>
              <Button
                onClick={testLLM}
                className="bg-red-200 hover:bg-red-300 text-red-700"
              >
                Test GPT-4 Chef
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
