import { useAgentStore } from "@/stores/agentStore";
import avatarImage from "@/assets/avatar.png";

export function AgentAvatar() {
  const inputMode = useAgentStore((state) => state.inputMode);

  if (inputMode === "mobile") return null;

  return (
    <div className="fixed bottom-24 right-12 z-0">
      <img
        src={avatarImage}
        alt="Agent Avatar"
        className="w-64 h-64 object-contain translate-x-1/3 translate-y-1/3"
      />
    </div>
  );
}
