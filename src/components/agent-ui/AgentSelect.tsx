import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { withAgentControl } from "./withAgentControl";

export const AgentSelect = withAgentControl(Select);
export const AgentSelectContent = withAgentControl(SelectContent);
export const AgentSelectItem = withAgentControl(SelectItem as any);
export const AgentSelectTrigger = withAgentControl(SelectTrigger);
export const AgentSelectValue = withAgentControl(SelectValue);
