// Create AudioContext
const audioContext = new (window.AudioContext ||
  (window as any).webkitAudioContext)();

// Sound buffer cache
const bufferCache: { [key: string]: AudioBuffer } = {};

// Preload all sounds
const soundFiles = [
  "select",
  "button-press",
  "press-key",
  "menu-enter",
  "menu-close",
];

// Load and decode audio file
const loadSound = async (name: string) => {
  if (bufferCache[name]) return bufferCache[name];

  try {
    const response = await fetch(`/sounds/${name}.mp3`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    bufferCache[name] = audioBuffer;
    return audioBuffer;
  } catch (error) {
    console.error(`Failed to load sound: ${name}`, error);
    return null;
  }
};

// Preload all sounds on init
soundFiles.forEach(loadSound);

// Play sound function
const playSound = (buffer: AudioBuffer | null, volume: number = 0.3) => {
  if (!buffer) return;

  // Resume context if suspended
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  source.buffer = buffer;
  gainNode.gain.value = volume;

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.start(0);
};

export const playButtonSound = {
  hover: () => {
    playSound(bufferCache["select"], 0.2);
  },
  click: () => {
    playSound(bufferCache["button-press"], 0.3);
  },
  type: () => {
    playSound(bufferCache["press-key"], 0.2);
  },
  settingsOpen: () => {
    playSound(bufferCache["menu-enter"], 0.3);
  },
  settingsClose: () => {
    playSound(bufferCache["menu-close"], 0.3);
  },
};
