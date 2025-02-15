import { AgentButton } from "@/components/agent/AgentButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAgentStore } from "@/stores/agentStore";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 space-y-8">
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
          <div className="flex gap-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
