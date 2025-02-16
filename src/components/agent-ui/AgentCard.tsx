import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { withAgentControl } from "./withAgentControl";

export const AgentCard = withAgentControl(Card);
export const AgentCardHeader = CardHeader;
export const AgentCardContent = CardContent;
export const AgentCardFooter = CardFooter;
export const AgentCardTitle = withAgentControl(CardTitle);
export const AgentCardDescription = withAgentControl(CardDescription);
