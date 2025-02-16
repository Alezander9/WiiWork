import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ReadingListPage from "./pages/ReadingListPage";
import AdminPage from "./pages/AdminPage";
import MobileInput from "./pages/MobileInput";
import { AgentAvatar } from "@/components/agent-ui/AgentAvatar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reading-list" element={<ReadingListPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mobile-input" element={<MobileInput />} />
        <Route path="/mobile-input/:port" element={<MobileInput />} />
      </Routes>
      <AgentAvatar />
    </BrowserRouter>
  );
}
