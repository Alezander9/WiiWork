import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ReadingListPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-wii-blue">Reading List</h1>
        <Button
          className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal"
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </div>

      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl text-wii-blue mb-4 font-bold">
          Sample Reading List
        </h2>
        <p className="font-normal text-black">
          Reading list content coming soon...
        </p>
      </section>
    </div>
  );
}
