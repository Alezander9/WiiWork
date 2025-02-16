import { useAgentStore } from "@/stores/agentStore";
// import avatarImage from "@/assets/avatar.png";
import avatarIdle from "@/assets/avatarIdle.png";
import avatarTalking from "@/assets/avatarTalking.png";

export function AgentAvatar() {
  const inputMode = useAgentStore((state) => state.inputMode);
  const isResponding = useAgentStore((state) => state.isResponding);
  const cursor = useAgentStore((state) => state.cursor);

  if (inputMode === "mobile") return null;

  return (
    <div
      className="fixed bottom-4 right-4 w-56 h-56 pointer-events-none"
      style={{
        transition: cursor.visible ? "transform 0.5s ease-out" : "none",
        opacity: cursor.visible ? 1 : 0,
      }}
    >
      {/* Container for both images */}
      <div className="relative w-full h-full">
        {/* Idle image */}
        <img
          src={avatarIdle}
          alt="Agent idle"
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
          style={{
            opacity: isResponding ? 0 : 1,
          }}
        />
        {/* Talking image */}
        <img
          src={avatarTalking}
          alt="Agent talking"
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
          style={{
            opacity: isResponding ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}
