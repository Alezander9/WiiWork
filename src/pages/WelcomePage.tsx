import { AgentButton, AgentIconButton } from "@/components/agent-ui";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAgentStore } from "@/stores/agentStore";
import { Settings } from "lucide-react";
import { AgentContext } from "@/components/agent-ui/AgentContext";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <>
      <AgentContext
        controlId="page-context"
        context="This is the main welcome page. From here, users can access their reading list or the admin panel. The reading list contains saved articles, while the admin panel provides system management options."
      />

      <div className="container mx-auto py-8 space-y-8">
        {/* Add settings button */}
        <div className="absolute top-4 right-4">
          <AgentIconButton
            controlId="settings-button"
            onUniversalClick={() => {
              console.log("Settings clicked!");
            }}
            context="This button opens the settings menu"
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
            context="This button navigates to the reading list page where you can view saved articles"
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
            context="This button navigates to the admin panel where you can manage system settings"
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
