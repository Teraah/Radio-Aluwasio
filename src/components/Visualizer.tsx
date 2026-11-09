import { useMemo } from "react";
import { cn } from "../utils/cn";

const COLORS = ["#f59e0b", "#ef4444", "#22c55e", "#2563eb", "#0ea5e9"];

export function Visualizer({ active, bars = 28 }: { active: boolean; bars?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => ({
        color: COLORS[i % COLORS.length],
        duration: 0.6 + Math.random() * 0.8,
        delay: Math.random() * 0.6,
        height: 30 + Math.random() * 70,
      })),
    [bars],
  );

  return (
    <div className="flex h-16 items-end justify-center gap-1" aria-hidden>
      {items.map((b, i) => (
        <span
          key={i}
          className={cn("w-1.5 rounded-full transition-all duration-500", active ? "" : "opacity-40")}
          style={{
            backgroundColor: b.color,
            height: active ? `${b.height}%` : "12%",
            animation: active ? `eq ${b.duration}s ease-in-out ${b.delay}s infinite alternate` : "none",
          }}
        />
      ))}
    </div>
  );
}
