import { create } from "zustand";

interface SettingsState {
  showAudioDebugLogs: boolean;
  toggleAudioDebugLogs: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  showAudioDebugLogs: false,
  toggleAudioDebugLogs: () =>
    set((state) => ({ showAudioDebugLogs: !state.showAudioDebugLogs })),
}));
