import { useEffect, useState } from "react";
// Method 1: Direct import
import pointerUrl from "@/assets/PointerP1.svg";

// OR Method 2: Using ?url suffix
// import pointerUrl from "@/assets/PointerP1.svg?url";

interface AgentCursorProps {
  position?: { x: number; y: number };
}

export function AgentCursor({ position = { x: 0, y: 0 } }: AgentCursorProps) {
  const [cursorPos, setCursorPos] = useState(position);

  useEffect(() => {
    // Smooth transition to new position
    setCursorPos(position);
  }, [position]);

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-300 ease-out"
      style={{
        transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
      }}
    >
      <img
        src={pointerUrl}
        alt="cursor"
        className="w-12 h-12"
        style={{ filter: "var(--wii-blue-filter)" }}
      />
    </div>
  );
}
