const shouldStartDevServer = process.env.NODE_ENV !== "production";

const viteDevServer = shouldStartDevServer
  ? await import("vite").then((vite) =>
      vite.createServer({ server: { middlewareMode: true } }),
    )
  : undefined;

const build = viteDevServer
  ? await viteDevServer.ssrLoadModule("virtual:remix/server-build")
  : await import("./build/server/index.js");

const { app, cleanup } = build.entry.module.expressApp(build, viteDevServer);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`),
);

function cleanupAndShutdown() {
  console.log("Shutting down...");
  server.close(() => {
    cleanup();
    console.log("Exiting process, goodbye");
    process.exit(0);
  });
}

process.on("SIGTERM", cleanupAndShutdown);
process.on("SIGINT", cleanupAndShutdown);
