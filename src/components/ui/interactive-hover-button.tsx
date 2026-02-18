import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  /** Optional: class for the expanding hover background (default: bg-primary) */
  hoverBgClass?: string;
  /** Optional: class for the text/icon on hover (default: text-primary-foreground) */
  hoverTextClass?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, hoverBgClass = "bg-primary", hoverTextClass = "text-primary-foreground", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative min-h-11 w-32 cursor-pointer overflow-hidden rounded-full border bg-background px-4 py-2.5 text-center font-semibold",
        className,
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-500 ease-out group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className={cn("absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-500 ease-out group-hover:-translate-x-1 group-hover:opacity-100", hoverTextClass)}>
        <span>{text}</span>
        <ArrowRight />
      </div>
      <div className={cn("absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg transition-all duration-500 ease-out group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8]", hoverBgClass)}></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
