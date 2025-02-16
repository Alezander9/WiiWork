import { withAgentControl } from "./withAgentControl";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const AgentBreadcrumb = withAgentControl(Breadcrumb);
export const AgentBreadcrumbList = withAgentControl(BreadcrumbList);
export const AgentBreadcrumbItem = withAgentControl(BreadcrumbItem);
export const AgentBreadcrumbLink = withAgentControl(BreadcrumbLink);
export const AgentBreadcrumbSeparator = BreadcrumbSeparator; // No need for agent control on separator
