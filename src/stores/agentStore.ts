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
  };
  ref: React.RefObject<HTMLElement>;
}

interface AgentStore {
  components: {
    [id: string]: ComponentData;
  };
  registerComponent: (
    id: string,
    ref: React.RefObject<HTMLElement>,
    handlers: { click?: () => void }
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
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  components: {},

  registerComponent: (id, ref, handlers) => {
    set((state) => ({
      components: {
        ...state.components,
        [id]: {
          state: { isHovered: false, isPressed: false },
          position: null,
          handlers,
          ref,
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
      return {
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
    });
  },

  getComponentPosition: (id) => {
    const component = get().components[id];
    return component?.position || null;
  },

  cursor: {
    visible: false,
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
}));
