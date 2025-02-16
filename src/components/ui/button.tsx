import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  // Base styles that apply to all variants
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100 hover:bg-gray-200 text-black border-2 border-blue-200 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  "data-hovered"?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      "data-hovered": hovered,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Compute hover classes first
    const hoverClasses = {
      // Added ! to make these styles important
      "!bg-wii-blue !text-white":
        hovered && className?.includes("hover:bg-wii-blue"),
      "!bg-wii-gray !text-white":
        hovered && className?.includes("hover:bg-wii-gray"),
    };

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          className, // Base classes
          hoverClasses // Hover classes last to take precedence
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
