import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  variant?: "orbital" | "shimmer";
}

export const LoadingSpinner = ({ className, variant = "orbital" }: LoadingSpinnerProps) => {
  if (variant === "shimmer") {
    return (
      <div className={cn("relative overflow-hidden rounded-xl", className)}>
        <div className="shimmer absolute inset-0 rounded-xl" />
        <div className="relative z-10 p-8 text-center">
          <div className="h-4 w-32 mx-auto bg-muted rounded animate-pulse" />
          <div className="h-3 w-24 mx-auto bg-muted rounded animate-pulse mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative w-20 h-20 mx-auto">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        
        {/* Spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-primary animate-spin" 
             style={{
               background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent)',
               WebkitMask: 'radial-gradient(circle at center, transparent 70%, black 72%)',
               mask: 'radial-gradient(circle at center, transparent 70%, black 72%)'
             }} />
        
        {/* Inner dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary animate-pulse" />
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-accent" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-primary" />
        </div>
      </div>
      
      <p className="text-center mt-6 text-muted-foreground animate-pulse">
        Crafting your ad...
      </p>
    </div>
  );
};