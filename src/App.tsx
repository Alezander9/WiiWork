import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        {/* Main Title */}
        <h1 className="text-4xl font-bold text-center mb-8 text-wii-blue ">
          WiiWork
        </h1>

        {/* Text Samples */}
        <section className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl text-wii-blue mb-4 font-bold">
            Text Samples
          </h2>

          <div className="space-y-4">
            <p className="text-3xl font-bold text-black">Welcome Message</p>
            <p className="text-xl font-normal text-wii-gray">
              System Status: Online
            </p>
            <p className="text-lg font-light text-black">
              Connection Type: Wireless
            </p>
            <p className="text-2xl font-bold text-wii-blue">Settings Menu</p>
          </div>
        </section>

        {/* Button Examples */}
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl text-wii-blue mb-4 font-bold">
            Button Examples
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Button className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal">
                Start
              </Button>
              <Button className="bg-wii-menu-gray hover:bg-wii-gray text-black hover:text-white font-normal">
                Options
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal">
                New Project
              </Button>
              <Button className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white font-normal">
                Open Project
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
