import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ReadingListPage from "./pages/ReadingListPage";
import AdminPage from "./pages/AdminPage";
import MobileInput from "./pages/MobileInput";
import DemoPage from "./pages/DemoPage";
import { AgentIconButton } from "@/components/agent-ui";
import { Settings, X } from "lucide-react";
import { useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { AgentLabel } from "@/components/agent-ui/AgentLabel";
import { AgentSwitch } from "@/components/agent-ui/AgentSwitch";
import { useAgentStore } from "@/stores/agentStore";
import { AgentButton } from "@/components/agent-ui/AgentButton";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-wii-bg-light">
      {/* Settings Button - Now hidden when settings are open */}
      <div
        className={`fixed top-4 right-4 z-20 transition-opacity duration-300 ${
          settingsOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <AgentIconButton
          controlId="settings-button"
          onUniversalClick={() => setSettingsOpen(true)}
          context="This button opens the settings menu"
          className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
        >
          <Settings className="w-6 h-6" />
        </AgentIconButton>
      </div>

      {/* Settings Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-wii-bg-dark shadow-lg transform transition-transform duration-300 ease-out z-10 ${
          settingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Settings</h2>
            <AgentIconButton
              controlId="close-settings-button"
              onUniversalClick={() => setSettingsOpen(false)}
              context="This button closes the settings menu"
              className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
            >
              <X className="w-6 h-6" />
            </AgentIconButton>
          </div>

          {/* Settings content will go here */}
          <div className="space-y-4">
            {/* We can add settings options here */}
            <div className="flex items-center space-x-2">
              <AgentLabel
                htmlFor="audio-debug"
                className="text-xs text-gray-500"
                controlId="audio-debug-label"
                context="This label describes the audio debug toggle switch that shows or hides debug information for audio recording"
              >
                Audio Debug
              </AgentLabel>
              <AgentSwitch
                id="audio-debug"
                controlId="audio-debug-toggle"
                checked={useSettingsStore((state) => state.showAudioDebugLogs)}
                onUniversalClick={() => {
                  const store = useSettingsStore.getState();
                  store.toggleAudioDebugLogs();
                }}
                context="This toggle shows or hides the audio debug logs in the mobile input screen"
              />
            </div>

            {/* Reset Agent State button */}
            <div className="pt-4">
              <AgentButton
                controlId="reset-agent-state"
                onUniversalClick={() =>
                  useAgentStore.getState().setIsResponding(false)
                }
                context="This is an emergency button that resets the agent's responding state if it gets stuck."
                className="w-full bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal"
              >
                Stop Agent Response
              </AgentButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <BrowserRouter>
        <BreadcrumbNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reading-list" element={<ReadingListPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/mobile-input" element={<MobileInput />} />
          <Route path="/mobile-input/:port" element={<MobileInput />} />
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
