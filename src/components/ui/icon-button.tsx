import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  "data-hovered"?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, "data-hovered": hovered, ...props }, ref) => {
    // Compute hover classes first
    const hoverClasses = {
      "!bg-wii-blue !text-white":
        hovered && className?.includes("hover:bg-wii-blue"),
      "!bg-wii-gray !text-white":
        hovered && className?.includes("hover:bg-wii-gray"),
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-full p-2 transition-colors hover:bg-gray-100",
          className,
          hoverClasses
        )}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton };
