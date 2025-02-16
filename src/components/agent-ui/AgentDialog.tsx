import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { withAgentControl } from "./withAgentControl";

export const AgentDialog = withAgentControl(Dialog);
export const AgentDialogContent = withAgentControl(DialogContent);
export const AgentDialogHeader = withAgentControl(DialogHeader);
export const AgentDialogTitle = withAgentControl(DialogTitle);
export const AgentDialogTrigger = withAgentControl(DialogTrigger);
