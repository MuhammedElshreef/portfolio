// Pub/sub so UI (hero name click) can poke the Three.js scene without re-renders.
type BurstListener = () => void;

const listeners = new Set<BurstListener>();

export const sceneEvents = {
  burst() {
    listeners.forEach((l) => l());
  },
  onBurst(listener: BurstListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
