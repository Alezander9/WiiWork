import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-wii-blue">
        WiiWork
      </h1>

      <div className="flex flex-col items-center gap-6">
        <Button
          className="w-64 bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal"
          onClick={() => navigate("/reading-list")}
        >
          Reading List
        </Button>
        <Button
          className="w-64 bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal"
          onClick={() => navigate("/admin")}
        >
          Admin Panel
        </Button>
      </div>
    </div>
  );
}
