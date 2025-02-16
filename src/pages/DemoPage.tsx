import { useState } from "react";
import {
  AgentButton,
  AgentIconButton,
  AgentInput,
} from "@/components/agent-ui";
import { Bell } from "lucide-react";

export default function DemoPage() {
  const [buttonText, setButtonText] = useState("");
  const [iconButtonText, setIconButtonText] = useState("");
  const [input1Text, setInput1Text] = useState("");
  const [input2Text, setInput2Text] = useState("");
  const [input3Text, setInput3Text] = useState("");
  const [input1Value, setInput1Value] = useState("");
  const [input2Value, setInput2Value] = useState("");
  const [input3Value, setInput3Value] = useState("");

  // Function to handle text fade
  const showTextWithFade = (
    setText: (text: string) => void,
    message: string
  ) => {
    setText(message);
    setTimeout(() => setText(""), 2000); // Clear text after 2 seconds
  };

  return (
    <div className="min-h-screen bg-wii-bg-light p-8">
      {/* Instructions Header */}
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold text-black mb-4">
          Agent Interaction Demo
        </h1>
        <p className="text-xl text-black">
          Try asking the agent to interact with these components!
        </p>
        <p className="text-gray-600 mt-2">
          Example: "Click the test button" or "Type 'hello' in the first input"
        </p>
      </div>

      <div className="max-w-2xl mx-auto grid grid-cols-2 gap-16">
        {/* Regular Button */}
        <div className="flex flex-col items-center gap-4">
          <AgentButton
            controlId="demo-test-button"
            onUniversalClick={() =>
              showTextWithFade(setButtonText, "Button clicked")
            }
            context="This is a test button that displays text when clicked"
            className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white"
          >
            Test Button
          </AgentButton>
          <p className="text-wii-blue transition-opacity duration-500 h-6">
            {buttonText}
          </p>
        </div>

        {/* Icon Button */}
        <div className="flex flex-col items-center gap-4">
          <AgentIconButton
            controlId="demo-test-icon-button"
            onUniversalClick={() =>
              showTextWithFade(setIconButtonText, "Icon Button clicked")
            }
            context="This is a test icon button that displays text when clicked"
            className="bg-wii-button-blue hover:bg-wii-blue text-black hover:text-white h-10 w-10"
          >
            <Bell className="h-5 w-5" />
          </AgentIconButton>
          <p className="text-wii-blue transition-opacity duration-500 h-6">
            {iconButtonText}
          </p>
        </div>

        {/* Three Inputs Row */}
        <div className="col-span-2 grid grid-cols-3 gap-8">
          {/* Input 1 */}
          <div className="flex flex-col items-center gap-4">
            <AgentInput
              controlId="demo-test-input-1"
              placeholder="First input..."
              value={input1Value}
              onChange={(e) => setInput1Value(e.target.value)}
              onUniversalClick={() =>
                showTextWithFade(setInput1Text, "Input 1 clicked")
              }
              onUniversalInput={(value) => {
                setInput1Value(value);
                showTextWithFade(setInput1Text, `Input 1 set to: ${value}`);
              }}
              context="This is the first test input that can be clicked and typed into. Use [[input:demo-test-input-1:hello]] to type text"
              className="w-full"
            />
            <p className="text-wii-blue transition-opacity duration-500 h-6">
              {input1Text}
            </p>
          </div>

          {/* Input 2 */}
          <div className="flex flex-col items-center gap-4">
            <AgentInput
              controlId="demo-test-input-2"
              placeholder="Second input..."
              value={input2Value}
              onChange={(e) => setInput2Value(e.target.value)}
              onUniversalClick={() =>
                showTextWithFade(setInput2Text, "Input 2 clicked")
              }
              onUniversalInput={(value) => {
                setInput2Value(value);
                showTextWithFade(setInput2Text, `Input 2 set to: ${value}`);
              }}
              context="This is the second test input that can be clicked and typed into. Use [[input:demo-test-input-2:hello]] to type text"
              className="w-full"
            />
            <p className="text-wii-blue transition-opacity duration-500 h-6">
              {input2Text}
            </p>
          </div>

          {/* Input 3 */}
          <div className="flex flex-col items-center gap-4">
            <AgentInput
              controlId="demo-test-input-3"
              placeholder="Third input..."
              value={input3Value}
              onChange={(e) => setInput3Value(e.target.value)}
              onUniversalClick={() =>
                showTextWithFade(setInput3Text, "Input 3 clicked")
              }
              onUniversalInput={(value) => {
                setInput3Value(value);
                showTextWithFade(setInput3Text, `Input 3 set to: ${value}`);
              }}
              context="This is the third test input that can be clicked and typed into. Use [[input:demo-test-input-3:hello]] to type text"
              className="w-full"
            />
            <p className="text-wii-blue transition-opacity duration-500 h-6">
              {input3Text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
