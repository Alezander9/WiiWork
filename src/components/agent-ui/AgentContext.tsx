import { withAgentControl } from "./withAgentControl";
import { forwardRef } from "react";

interface AgentContextProps {
  controlId: string;
  context: string;
}

// Forward the ref to the div
const AgentContextBase = forwardRef<HTMLDivElement, AgentContextProps>(
  (_props, ref) => {
    return <div ref={ref} style={{ display: "none" }} />;
  }
);

export const AgentContext = withAgentControl(AgentContextBase);
