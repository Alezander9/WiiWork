import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import ReadingListPage from "./pages/ReadingListPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/reading-list" element={<ReadingListPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
