import { create } from "zustand";

interface ComponentState {
  isHovered: boolean;
  isPressed: boolean;
}

interface ComponentPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ComponentData {
  state: ComponentState;
  position: ComponentPosition | null;
  handlers: {
    click?: () => void;
    input?: (value: string) => void;
  };
  ref: React.RefObject<HTMLElement>;
  context?: string;
}

interface VoiceSegment {
  text: string;
  audioData?: string;
  status: "pending" | "generating" | "ready" | "failed";
}

interface VoiceState {
  isPlaying: boolean;
  segments: VoiceSegment[];
  currentSegment: number;
  error: string | null;
}

interface AgentState {
  components: {
    [id: string]: ComponentData;
  };
  registerComponent: (
    id: string,
    ref: React.RefObject<HTMLElement>,
    handlers: {
      click?: () => void;
      input?: (value: string) => void;
    },
    context?: string
  ) => void;
  unregisterComponent: (id: string) => void;
  updatePosition: (id: string) => void;
  triggerInteraction: (id: string, type: "click" | "hover") => void;
  getComponentPosition: (id: string) => ComponentPosition | null;
  cursor: {
    visible: boolean;
    position: { x: number; y: number };
  };
  setCursorVisible: (visible: boolean) => void;
  setCursorPosition: (position: { x: number; y: number }) => void;
  inputMode: "desktop" | "mobile";
  setInputMode: (mode: "desktop" | "mobile") => void;
  port: string;
  generateNewPort: () => void;
  isResponding: boolean;
  lastResponseTime: number | null;
  setIsResponding: (value: boolean) => void;
  userMessage: {
    content: string | null;
    timestamp: number | null;
    source: "text" | "voice" | null;
  };
  setUserMessage: (content: string, source: "text" | "voice") => void;
  agentStatus: {
    isGenerating: boolean;
    isExecutingTools: boolean;
    isPlayingVoice: boolean;
    currentToolCall: string | null;
  };
  setAgentGenerating: (isGenerating: boolean) => void;
  setToolExecution: (isExecuting: boolean, currentTool?: string) => void;
  voice: VoiceState;
  setVoiceState: (updates: Partial<VoiceState>) => void;
  updateVoiceSegment: (index: number, updates: Partial<VoiceSegment>) => void;
  resetVoiceState: () => void;
  mobileConnection: {
    isConnected: boolean;
    connectedDevices: number;
    lastActivityTime: number | null;
  };
  agentResponse: {
    content: string | null;
    timestamp: number | null;
    isComplete: boolean;
  };
  setAgentResponse: (content: string, isComplete: boolean) => void;
  clearAgentResponse: () => void;
}

export const useAgentStore = create<AgentState>()((set, get) => ({
  components: {},

  registerComponent: (id, ref, handlers, context?) => {
    set((state) => ({
      components: {
        ...state.components,
        [id]: {
          state: { isHovered: false, isPressed: false },
          position: null,
          handlers: {
            click: handlers.click,
            input: handlers.input,
          },
          ref,
          context,
        },
      },
    }));
    // Initial position calculation
    get().updatePosition(id);
  },

  unregisterComponent: (id) => {
    set((state) => {
      const newComponents = { ...state.components };
      delete newComponents[id];
      return { components: newComponents };
    });
  },

  updatePosition: (id) => {
    const component = get().components[id];
    if (component?.ref?.current) {
      const rect = component.ref.current.getBoundingClientRect();
      set((state) => ({
        components: {
          ...state.components,
          [id]: {
            ...state.components[id],
            position: {
              x: rect.left + rect.width / 2, // center x
              y: rect.top + rect.height / 2, // center y
              width: rect.width,
              height: rect.height,
            },
          },
        },
      }));
    }
  },

  triggerInteraction: (id, type) => {
    const component = get().components[id];
    if (type === "click" && component?.handlers.click) {
      component.handlers.click();
    }

    // Update component state
    set((state) => {
      const newState = {
        components: {
          ...state.components,
          [id]: {
            ...state.components[id],
            state: {
              ...state.components[id].state,
              isPressed: type === "click",
              isHovered: type === "hover",
            },
          },
        },
      };
      return newState;
    });
  },

  getComponentPosition: (id) => {
    const component = get().components[id];
    return component?.position || null;
  },

  cursor: {
    visible: true,
    position: { x: 0, y: 0 },
  },

  setCursorVisible: (visible) => {
    set((state) => ({
      cursor: {
        ...state.cursor,
        visible,
      },
    }));
  },

  setCursorPosition: (position) => {
    set((state) => ({
      cursor: {
        ...state.cursor,
        position,
      },
    }));
  },

  inputMode: "desktop",
  setInputMode: (mode) => {
    set((state) => ({
      inputMode: mode,
      cursor: {
        ...state.cursor,
        visible: mode === "desktop", // Automatically handle cursor visibility
      },
    }));
  },

  port: "",
  generateNewPort: () => {
    const newPort = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated port:", newPort); // Temporary logging
    set({ port: newPort });
  },

  isResponding: false,
  lastResponseTime: null,

  setIsResponding: (value: boolean) => set({ isResponding: value }),

  setResponding: (isResponding: boolean) =>
    set((state) => ({
      isResponding,
      lastResponseTime: isResponding ? state.lastResponseTime : Date.now(),
    })),

  userMessage: {
    content: null,
    timestamp: null,
    source: null,
  },

  setUserMessage: (content: string, source: "text" | "voice") =>
    set((state) => ({
      userMessage: {
        ...state.userMessage,
        content,
        timestamp: Date.now(),
        source,
      },
    })),

  agentStatus: {
    isGenerating: false,
    isExecutingTools: false,
    isPlayingVoice: false,
    currentToolCall: null,
  },

  setAgentGenerating: (isGenerating: boolean) =>
    set((state) => ({
      agentStatus: {
        ...state.agentStatus,
        isGenerating,
      },
    })),

  setToolExecution: (isExecuting: boolean, currentTool?: string) =>
    set((state) => ({
      agentStatus: {
        ...state.agentStatus,
        isExecutingTools: isExecuting,
        currentToolCall: currentTool || null,
      },
    })),

  voice: {
    isPlaying: false,
    segments: [],
    currentSegment: 0,
    error: null,
  },

  setVoiceState: (updates) =>
    set((state) => ({
      voice: {
        ...state.voice,
        ...updates,
      },
    })),

  updateVoiceSegment: (index, updates) =>
    set((state) => ({
      voice: {
        ...state.voice,
        segments: state.voice.segments.map((seg, i) =>
          i === index ? { ...seg, ...updates } : seg
        ),
      },
    })),

  resetVoiceState: () =>
    set((state) => ({
      voice: {
        ...state.voice,
        isPlaying: false,
        segments: [],
        currentSegment: 0,
        error: null,
      },
    })),

  mobileConnection: {
    isConnected: false,
    connectedDevices: 0,
    lastActivityTime: null,
  },

  updateMobileConnection: (deviceCount: number) =>
    set((state) => ({
      mobileConnection: {
        ...state.mobileConnection,
        isConnected: deviceCount > 0,
        connectedDevices: deviceCount,
        lastActivityTime: Date.now(),
      },
    })),

  agentResponse: {
    content: null,
    timestamp: null,
    isComplete: false,
  },

  setAgentResponse: (content: string, isComplete: boolean = true) =>
    set((state) => ({
      agentResponse: {
        ...state.agentResponse,
        content,
        timestamp: Date.now(),
        isComplete,
      },
    })),

  clearAgentResponse: () =>
    set((state) => ({
      agentResponse: {
        ...state.agentResponse,
        content: null,
        timestamp: null,
        isComplete: false,
      },
    })),
}));
