import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "hero";
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, variant = "default", type, ...props }, ref) => {
    const variants = {
      default: "glass-input h-12 w-full rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:glow-primary",
      hero: "glass-input h-16 w-full rounded-2xl px-6 py-4 text-lg placeholder:text-muted-foreground/70 focus:glow-primary focus:scale-[1.02] transition-all duration-300"
    };

    return (
      <input
        type={type}
        className={cn(variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
GlassInput.displayName = "GlassInput";

export { GlassInput };