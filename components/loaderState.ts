// Tiny pub/sub so the hero can stagger in the moment the preloader finishes,
// without threading state through the server-rendered page tree.
type Listener = () => void;

let done = false;
const listeners = new Set<Listener>();

export const loaderState = {
  isDone: () => done,
  finish() {
    if (done) return;
    done = true;
    listeners.forEach((l) => l());
    listeners.clear();
  },
  onDone(listener: Listener) {
    if (done) {
      listener();
      return () => {};
    }
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
