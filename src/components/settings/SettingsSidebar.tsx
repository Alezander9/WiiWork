import { X } from "lucide-react";
import { AgentIconButton } from "@/components/agent-ui";
import { AgentLabel } from "@/components/agent-ui/AgentLabel";
import { AgentButton } from "@/components/agent-ui/AgentButton";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAgentStore } from "@/stores/agentStore";
import { playButtonSound } from "@/lib/sounds";
import { useCallback } from "react";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  // Get current states
  const showAudioDebugLogs = useSettingsStore(
    (state) => state.showAudioDebugLogs
  );
  const showStateDebugPanel = useSettingsStore(
    (state) => state.showStateDebugPanel
  );

  // Get setter functions
  const setAudioDebugLogs = useCallback((value: boolean) => {
    useSettingsStore.getState().setAudioDebugLogs(value);
  }, []);

  const setStateDebugPanel = useCallback((value: boolean) => {
    useSettingsStore.getState().setStateDebugPanel(value);
  }, []);

  // Get functions via hooks instead of getState()
  const setIsResponding = useAgentStore((state) => state.setIsResponding);

  const handleAgentReset = useCallback(() => {
    setIsResponding(false);
  }, [setIsResponding]);

  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-out z-10 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-wii-blue">Settings</h2>
          <AgentIconButton
            controlId="close-settings-button"
            onUniversalClick={() => {
              playButtonSound.settingsClose();
              onClose();
            }}
            context="This button closes the settings menu"
            className="bg-gray-100 hover:bg-gray-200 text-black border-2 border-blue-200 shadow-sm rounded-xl"
          >
            <X className="w-6 h-6" />
          </AgentIconButton>
        </div>

        {/* Settings content */}
        <div className="space-y-4">
          {/* Audio Debug Controls */}
          <div className="flex items-center justify-between">
            <AgentLabel
              htmlFor="audio-debug"
              className="text-xs text-gray-500"
              controlId="audio-debug-label"
              context="This label describes the audio debug controls"
            >
              Audio Debug
            </AgentLabel>
            <div className="flex gap-1">
              {showAudioDebugLogs ? (
                <AgentButton
                  controlId="audio-debug-off"
                  onUniversalClick={() => setAudioDebugLogs(false)}
                  context="Turn off audio debug logs"
                  className="bg-gray-100 hover:bg-gray-200 text-black border-2 border-blue-200 shadow-sm rounded-xl text-sm px-3 py-1"
                >
                  Turn Off
                </AgentButton>
              ) : (
                <AgentButton
                  controlId="audio-debug-on"
                  onUniversalClick={() => setAudioDebugLogs(true)}
                  context="Turn on audio debug logs"
                  className="bg-gray-100 hover:bg-gray-200 text-black border-2 border-blue-200 shadow-sm rounded-xl text-sm px-3 py-1"
                >
                  Turn On
                </AgentButton>
              )}
            </div>
          </div>

          {/* State Debug Panel Controls */}
          <div className="flex items-center justify-between">
            <AgentLabel
              htmlFor="state-debug"
              className="text-xs text-gray-500"
              controlId="state-debug-label"
              context="This label describes the state debug panel controls"
            >
              State Debug Panel
            </AgentLabel>
            <div className="flex gap-1">
              {showStateDebugPanel ? (
                <AgentButton
                  controlId="state-debug-off"
                  onUniversalClick={() => setStateDebugPanel(false)}
                  context="Hide the state debug panel"
                  className="bg-gray-100 hover:bg-gray-200 text-black border-2 border-blue-200 shadow-sm rounded-xl text-sm px-3 py-1"
                >
                  Turn Off
                </AgentButton>
              ) : (
                <AgentButton
                  controlId="state-debug-on"
                  onUniversalClick={() => setStateDebugPanel(true)}
                  context="Show the state debug panel"
                  className="bg-gray-100 hover:bg-gray-200 text-black border-2 border-blue-200 shadow-sm rounded-xl text-sm px-3 py-1"
                >
                  Turn On
                </AgentButton>
              )}
            </div>
          </div>

          {/* Reset Agent State button */}
          <div className="pt-4">
            <AgentButton
              controlId="reset-agent-state"
              onUniversalClick={handleAgentReset}
              context="Emergency button to reset agent's responding state"
              className="w-full font-normal"
            >
              Stop Agent Response
            </AgentButton>
          </div>
        </div>
      </div>
    </div>
  );
}
