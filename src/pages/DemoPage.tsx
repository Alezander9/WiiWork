import { useState } from "react";
import {
  AgentButton,
  AgentIconButton,
  AgentInput,
  AgentSwitch,
} from "@/components/agent-ui";
import { Bell } from "lucide-react";

export default function DemoPage() {
  const [buttonText, setButtonText] = useState("");
  const [iconButtonText, setIconButtonText] = useState("");
  const [inputText, setInputText] = useState("");
  const [switchText, setSwitchText] = useState("");
  const [inputValue, setInputValue] = useState("");

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

        {/* Text Input */}
        <div className="flex flex-col items-center gap-4">
          <AgentInput
            controlId="demo-test-input"
            placeholder="Type here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onUniversalClick={() =>
              showTextWithFade(setInputText, "Input clicked")
            }
            onUniversalInput={(value) => {
              setInputValue(value);
              showTextWithFade(setInputText, `Input set to: ${value}`);
            }}
            context="This is a test input field that can be clicked and typed into. Use [[input:demo-test-input:hello]] to type text"
            className="w-48"
          />
          <p className="text-wii-blue transition-opacity duration-500 h-6">
            {inputText}
          </p>
        </div>

        {/* Switch */}
        <div className="flex flex-col items-center gap-4">
          <AgentSwitch
            controlId="demo-test-switch"
            onCheckedChange={() =>
              showTextWithFade(setSwitchText, "Switch clicked")
            }
            context="This is a test switch that displays text when toggled"
          />
          <p className="text-wii-blue transition-opacity duration-500 h-6">
            {switchText}
          </p>
        </div>
      </div>
    </div>
  );
}
