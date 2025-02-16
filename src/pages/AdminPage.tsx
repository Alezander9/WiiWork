import { AgentButton } from "@/components/agent-ui";
import { AgentContext } from "@/components/agent-ui/AgentContext";
import { useAgentStore } from "@/stores/agentStore";
import { QRCodeSVG } from "qrcode.react";

export default function AdminPage() {
  const port = useAgentStore((state) => state.port);
  const generateNewPort = useAgentStore((state) => state.generateNewPort);

  const mobileInputUrl = port
    ? `${window.location.origin}/mobile-input/${port}`
    : "";

  return (
    <>
      <AgentContext
        controlId="page-context"
        context="This is the admin panel where you can manage system settings and view the current mobile input port. You can generate a new port if needed, which will reset the connection between the users microphone and your input"
      />

      <div className="container mx-auto py-8 space-y-8">
        {/* Port Section */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-wii-blue">
            Mobile Input Port
          </h2>

          <div className="mb-4">
            <span className="text-gray-600">Current Port: </span>
            <span className="font-mono font-bold text-lg">
              {port || "Not generated"}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <AgentButton
              controlId="generate-port-button"
              onUniversalClick={() => {
                console.log("Generating new port...");
                generateNewPort();
              }}
              context="This button generates a new port number for mobile input connections. This will reset the connection between the users microphone and your input. Only use this is you are certain the user knows what they are doing."
              className="w-full font-normal"
            >
              Generate New Port
            </AgentButton>

            {port && (
              <div className="flex flex-col items-center">
                <QRCodeSVG
                  value={mobileInputUrl}
                  size={200}
                  level="H"
                  className="bg-white rounded-lg p-2"
                />
                <div className="text-sm text-gray-600 text-center mt-2">
                  <span className="font-mono break-all">{mobileInputUrl}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
