import { Button } from "@/components/ui/button";
import { withAgentControl } from "@/components/agent-ui/withAgentControl";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const AgentButton = withAgentControl(
  forwardRef<HTMLButtonElement, AgentButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
      return (
        <Button
          ref={ref}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        />
      );
    }
  )
);
