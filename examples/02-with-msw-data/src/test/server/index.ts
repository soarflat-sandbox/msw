export const initMocks = async () => {
  if (typeof window === "undefined") {
    const { server } = require("./server");
    server.listen();
  } else {
    const { worker } = await import("./browser");
    worker.start();
  }
};
