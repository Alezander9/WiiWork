import {
  useEffect,
  useRef,
  forwardRef,
  RefObject,
  PropsWithChildren,
} from "react";
import { useAgentStore } from "@/stores/agentStore";

// Props that the HOC needs
interface AgentControlProps {
  controlId: string;
  onUniversalClick?: () => void;
  context?: string;
  "data-hovered"?: boolean;
  className?: string;
}

export function withAgentControl<T extends AgentControlProps>(
  WrappedComponent: React.ComponentType<PropsWithChildren<T>>
) {
  return forwardRef<HTMLElement, PropsWithChildren<T>>((props, _ref) => {
    const { controlId, onUniversalClick, context, ...rest } = props;
    const elementRef = useRef<HTMLElement>(null);

    // Add click handler
    const handleClick = () => {
      useAgentStore.getState().triggerInteraction(controlId, "click");
      onUniversalClick?.();
    };

    useEffect(() => {
      if (elementRef.current) {
        useAgentStore.getState().registerComponent(
          controlId,
          elementRef as RefObject<HTMLElement>,
          {
            click: onUniversalClick,
          },
          context
        );

        // Update position on mount
        useAgentStore.getState().updatePosition(controlId);

        return () => {
          useAgentStore.getState().unregisterComponent(controlId);
        };
      }
    }, [controlId, onUniversalClick, context]);

    return (
      <WrappedComponent
        ref={elementRef}
        onClick={handleClick}
        {...(rest as unknown as PropsWithChildren<T>)}
      />
    );
  });
}
