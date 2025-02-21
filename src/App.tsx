import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ReadingListPage from "./pages/ReadingListPage";
import AdminPage from "./pages/AdminPage";
import MobileInput from "./pages/MobileInput";
import DemoPage from "./pages/DemoPage";
import { AgentIconButton } from "@/components/agent-ui";
import { Settings } from "lucide-react";
import { useState } from "react";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { playButtonSound } from "@/lib/sounds";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="relative min-h-screen wii-background">
      {/* Settings Button */}
      <div
        className={`fixed top-4 right-4 z-20 transition-opacity duration-300 ${
          settingsOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <AgentIconButton
          controlId="settings-button"
          onUniversalClick={() => {
            playButtonSound.settingsOpen();
            setSettingsOpen(true);
          }}
          context="This button opens the settings menu"
          className="bg-gray-100 hover:bg-gray-200 text-black border-2 border-blue-200 shadow-sm rounded-xl"
        >
          <Settings className="w-6 h-6" />
        </AgentIconButton>
      </div>

      <SettingsSidebar
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

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
