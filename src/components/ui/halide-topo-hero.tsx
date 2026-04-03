import { cn } from "@/lib/utils";
import { useState } from "react";

export const HalideTopoHero = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCount((prev) => prev - 1)}
          className="h-10 w-10 rounded border border-white/20 bg-white/10 text-[#e0e0e0] hover:bg-white/20 transition-colors flex items-center justify-center font-bold"
          aria-label="Decrease"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => setCount((prev) => prev + 1)}
          className="h-10 w-10 rounded border border-white/20 bg-white/10 text-[#e0e0e0] hover:bg-white/20 transition-colors flex items-center justify-center font-bold"
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
};
