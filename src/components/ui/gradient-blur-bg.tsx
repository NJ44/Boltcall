import { cn } from "@/lib/utils";

interface GradientBlurBgProps {
  variant?: "purple-right" | "diagonal-top-left";
  className?: string;
  children?: React.ReactNode;
}

export const GradientBlurBg = ({
  variant = "purple-right",
  className,
  children,
}: GradientBlurBgProps) => {
  if (variant === "diagonal-top-left") {
    return (
      <div className={cn("min-h-screen w-full bg-[#f9fafb] relative", className)}>
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #d1d5db 1px, transparent 1px),
              linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          }}
        />
        {children}
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen w-full bg-white relative", className)}>
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f0f0f0 1px, transparent 1px),
            linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
            radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent)
          `,
          backgroundSize: "96px 64px, 96px 64px, 100% 100%",
        }}
      />
      {children}
    </div>
  );
};
