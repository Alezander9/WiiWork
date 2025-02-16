import { useLocation, useNavigate } from "react-router-dom";
import {
  AgentBreadcrumb,
  AgentBreadcrumbList,
  AgentBreadcrumbItem,
  AgentBreadcrumbLink,
  AgentBreadcrumbSeparator,
} from "@/components/agent-ui/AgentBreadcrumb";

// Define our route mappings
const routeNames: Record<string, string> = {
  "": "WiiWork",
  demo: "Demo Page",
  "reading-list": "Reading List",
  admin: "Admin Panel",
  "mobile-input": "Mobile Input",
};

import React from "react";

export function BreadcrumbNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Don't render on home page
  if (location.pathname === "/") return null;

  return (
    <AgentBreadcrumb className="px-8 py-4" controlId="breadcrumb-nav">
      <AgentBreadcrumbList
        controlId="breadcrumb-list"
        className="text-4xl font-bold text-center text-wii-blue" // Match the h1 styling exactly
      >
        {/* Home is always first */}
        <AgentBreadcrumbItem controlId="breadcrumb-home">
          <AgentBreadcrumbLink
            onClick={() => navigate("/")}
            controlId="breadcrumb-home"
            context="This link returns you to the WiiWork home page"
            className="font-bold text-wii-blue cursor-pointer transition-transform duration-200 hover:scale-110 inline-block"
          >
            WiiWork
          </AgentBreadcrumbLink>
        </AgentBreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          return (
            <React.Fragment key={path}>
              <AgentBreadcrumbSeparator className="text-wii-blue mx-2" />
              <AgentBreadcrumbItem controlId={`breadcrumb-${segment}`}>
                <AgentBreadcrumbLink
                  onClick={() => navigate(path)}
                  controlId={`breadcrumb-${segment}`}
                  context={`This link takes you to the ${routeNames[segment]} page`}
                  className="font-bold text-wii-blue cursor-pointer transition-transform duration-200 hover:scale-110 inline-block"
                >
                  {routeNames[segment]}
                </AgentBreadcrumbLink>
              </AgentBreadcrumbItem>
            </React.Fragment>
          );
        })}
      </AgentBreadcrumbList>
    </AgentBreadcrumb>
  );
}
