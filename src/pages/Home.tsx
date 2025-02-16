import { AgentButton } from "@/components/agent-ui";
import { useNavigate } from "react-router-dom";
import { AgentContext } from "@/components/agent-ui/AgentContext";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <AgentContext
        controlId="page-context"
        context="This is the main welcome page. From here, users can access their reading list, the admin panel, or the mobile input page. The reading list contains saved articles, while the admin panel provides system management options."
      />

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

          <AgentButton
            controlId="mobile-input-button"
            onUniversalClick={() => {
              console.log("Mobile Input clicked!");
              navigate("/mobile-input");
            }}
            context="This button navigates to the mobile input page where you can connect a mobile device for input"
            className="w-64 bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal"
          >
            Mobile Input
          </AgentButton>
        </div>
      </div>
    </>
  );
}
