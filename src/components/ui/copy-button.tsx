import * as React from "react";
import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
}

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      className,
      textToCopy,
      label = "Copy",
      copiedLabel = "Copied!",
      onClick,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
          await navigator.clipboard.writeText(textToCopy);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // fallback
          const textarea = document.createElement("textarea");
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        onClick?.(e);
      },
      [textToCopy, onClick],
    );

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "inline-flex select-none items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium",
          "bg-zinc-700 text-white hover:bg-zinc-600 transition-colors",
          "dark:bg-zinc-800 dark:hover:bg-zinc-700",
          "cursor-pointer border-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      >
        <div className="relative w-5 h-5">
          <div
            className="absolute inset-0 transition-all duration-150"
            style={{
              opacity: copied ? 0 : 1,
              transform: copied ? "scale(0.6)" : "scale(1)",
            }}
          >
            <Copy className="w-5 h-5" />
          </div>
          <div
            className="absolute inset-0"
            style={{
              opacity: copied ? 1 : 0,
              transform: copied ? "scale(1)" : "scale(0.6)",
              transition: "opacity 400ms 150ms, transform 400ms 150ms",
            }}
          >
            <Check className="w-5 h-5 text-green-400" />
          </div>
        </div>
        {copied ? copiedLabel : label}
      </button>
    );
  },
);

CopyButton.displayName = "CopyButton";

export { CopyButton };
