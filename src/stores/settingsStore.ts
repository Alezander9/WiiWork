import { create } from "zustand";

interface SettingsState {
  showAudioDebugLogs: boolean;
  showStateDebugPanel: boolean;
  setAudioDebugLogs: (value: boolean) => void;
  setStateDebugPanel: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  showAudioDebugLogs: false,
  showStateDebugPanel: false,

  setAudioDebugLogs: (value: boolean) => set({ showAudioDebugLogs: value }),
  setStateDebugPanel: (value: boolean) => set({ showStateDebugPanel: value }),
}));
