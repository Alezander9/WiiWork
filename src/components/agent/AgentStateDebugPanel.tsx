import { useAgentStore } from "@/stores/agentStore";

export function StateDebugPanel() {
  const userMessage = useAgentStore((state) => state.userMessage);
  const agentStatus = useAgentStore((state) => state.agentStatus);
  const mobileConnection = useAgentStore((state) => state.mobileConnection);
  const agentResponse = useAgentStore((state) => state.agentResponse);

  return (
    <div className="fixed top-4 left-4 bg-black/30 text-white p-4 rounded-lg font-mono text-sm z-50 backdrop-blur-sm">
      <div className="space-y-2">
        <div>
          <div className="font-bold">User Message:</div>
          <div>Content: {userMessage.content || "none"}</div>
          <div>Source: {userMessage.source || "none"}</div>
          <div>
            Time:{" "}
            {userMessage.timestamp
              ? new Date(userMessage.timestamp).toLocaleTimeString()
              : "none"}
          </div>
        </div>

        <div>
          <div className="font-bold">Agent Status:</div>
          <div>Generating: {agentStatus.isGenerating.toString()}</div>
          <div>Executing Tools: {agentStatus.isExecutingTools.toString()}</div>
          <div>Playing Voice: {agentStatus.isPlayingVoice.toString()}</div>
          <div>Current Tool: {agentStatus.currentToolCall || "none"}</div>
        </div>

        <div>
          <div className="font-bold">Mobile Connection:</div>
          <div>Connected: {mobileConnection.isConnected.toString()}</div>
          <div>Devices: {mobileConnection.connectedDevices}</div>
          <div>
            Last Activity:{" "}
            {mobileConnection.lastActivityTime
              ? new Date(mobileConnection.lastActivityTime).toLocaleTimeString()
              : "none"}
          </div>
        </div>

        <div>
          <div className="font-bold">Agent Response:</div>
          <div>
            Content:{" "}
            {agentResponse.content
              ? `${agentResponse.content.slice(0, 30)}...`
              : "none"}
          </div>
          <div>Complete: {agentResponse.isComplete.toString()}</div>
          <div>
            Time:{" "}
            {agentResponse.timestamp
              ? new Date(agentResponse.timestamp).toLocaleTimeString()
              : "none"}
          </div>
        </div>
      </div>
    </div>
  );
}
