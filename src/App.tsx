import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <main className="min-h-screen bg-wii-bg-light">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-wii-blue">
          WiiWork
        </h1>

        {/* Wii-styled button */}
        <div className="flex justify-center">
          <Button
            className="
              bg-wii-button-blue hover:bg-wii-blue
              text-black hover:text-white
              rounded-2xl px-8 py-4
              shadow-lg hover:shadow-xl
              transition-all duration-200
              transform hover:-translate-y-0.5
            "
          >
            Click Me!
          </Button>
        </div>
      </div>
    </main>
  );
}

export default App;
