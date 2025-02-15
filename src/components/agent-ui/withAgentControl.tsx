import { useEffect, useRef, ComponentType, PropsWithChildren } from "react";
import { useAgentStore } from "@/stores/agentStore";

// Props that our HOC will inject
interface AgentProps {
  onClick?: () => void;
  className?: string;
}

// Props that the HOC needs
interface AgentControlProps {
  controlId: string;
  onUniversalClick?: () => void;
}

export function withAgentControl<T extends AgentProps & PropsWithChildren>(
  WrappedComponent: ComponentType<T>
) {
  // Create a nice display name for dev tools
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  function ComponentWithAgent(
    props: Omit<T, keyof AgentProps> &
      AgentControlProps & { [key: string]: any }
  ) {
    const { controlId, onUniversalClick, ...componentProps } = props;
    const elementRef = useRef<HTMLDivElement>(null);

    const componentState = useAgentStore((state) => {
      const status = state.components[controlId]?.state;
      return status;
    });

    useEffect(() => {
      if (!elementRef.current) return;

      useAgentStore
        .getState()
        .registerComponent(
          controlId,
          elementRef as React.RefObject<HTMLElement>,
          { click: onUniversalClick }
        );

      // Handle element resize
      const resizeObserver = new ResizeObserver(() => {
        useAgentStore.getState().updatePosition(controlId);
      });

      resizeObserver.observe(elementRef.current);

      // Handle window resize
      const handleWindowResize = () => {
        useAgentStore.getState().updatePosition(controlId);
      };

      window.addEventListener("resize", handleWindowResize);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", handleWindowResize);
        useAgentStore.getState().unregisterComponent(controlId);
      };
    }, [controlId, onUniversalClick]);

    // Prepare the props we want to inject
    const agentProps = {
      onClick: () =>
        useAgentStore.getState().triggerInteraction(controlId, "click"),
      "data-hovered": componentState?.isHovered,
      className: `
        ${(componentProps as any).className || ""}
        ${componentState?.isHovered ? "hover" : ""}
        ${componentState?.isPressed ? "active" : ""}
      `,
    };

    return (
      <div ref={elementRef}>
        <WrappedComponent
          {...(componentProps as unknown as T)}
          {...agentProps}
        />
      </div>
    );
  }

  ComponentWithAgent.displayName = `withAgent(${displayName})`;

  return ComponentWithAgent;
}
