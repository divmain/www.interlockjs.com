const DELAY = 500; // milliseconds

const callbacks = [];
let nextId = 0;

let waiting = false;
const resize = () => {
  if (waiting) { return; }
  waiting = true;

  setTimeout(() => {
    waiting = false;
    callbacks.forEach(cb => cb({
      width: window.innerWidth,
      height: window.innerHeight
    }));
  }, DELAY);
};

window.addEventListener("resize", resize);
exports.onResize = cb => {
  const id = nextId++;
  callbacks[id] = cb;
  cb({
    width: window.innerWidth,
    height: window.innerHeight
  });
  return () => { callbacks[id] = null; };
};
