import {
  useEffect,
  useRef,
  forwardRef,
  RefObject,
  ComponentType,
  PropsWithChildren,
} from "react";
import { useAgentStore } from "@/stores/agentStore";

// Props that the HOC needs
export interface AgentControlProps {
  controlId: string;
  onUniversalClick?: () => void;
  context?: string;
  "data-hovered"?: boolean;
  className?: string;
}

// Use Record<string, any> to allow any additional props
export function withAgentControl<P extends Record<string, any>>(
  WrappedComponent: ComponentType<PropsWithChildren<P>>
) {
  type CombinedProps = AgentControlProps & PropsWithChildren<P>;

  return forwardRef<any, CombinedProps>((props) => {
    const { controlId, onUniversalClick, context, ...rest } = props;
    const elementRef = useRef<HTMLElement>(null);

    // Add state subscription
    const componentState = useAgentStore(
      (state) => state.components[controlId]?.state
    );

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
        data-hovered={componentState?.isHovered}
        {...(rest as unknown as PropsWithChildren<P>)}
      />
    );
  });
}
