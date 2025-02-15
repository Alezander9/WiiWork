import { AgentButton } from "@/components/agent-ui/AgentButton";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-wii-blue">Admin Panel</h1>
        <AgentButton
          controlId="back-button"
          onUniversalClick={() => navigate("/")}
          context="This button navigates back to the home page"
          className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal"
        >
          Back
        </AgentButton>
      </div>

      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl text-wii-blue mb-4 font-bold">
          Admin Controls
        </h2>
        <p className="font-normal text-black">Admin controls coming soon...</p>
      </section>
    </div>
  );
}
