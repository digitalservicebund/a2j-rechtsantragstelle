const shouldStartDevServer = process.env.NODE_ENV !== "production";
let isShuttingDown = false; // Prevent multiple parallel shutdowns

const viteDevServer = shouldStartDevServer
  ? await import("vite").then((vite) =>
      vite.createServer({ server: { middlewareMode: true } }),
    )
  : undefined;

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
  : await import("./build/server/index.js");

// When running a dev server, build() is a function to enable HMR
// To access expressApp(), we need to execute it once
const initialBuild = typeof build === "function" ? await build() : build;
const { expressApp } = await initialBuild.entry.module;
const { app, cleanup } = expressApp(build, viteDevServer);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`),
);

function cleanupAndShutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log("Gracefully shuting down...");
  server.close(async () => {
    await cleanup();
    console.log("Exiting process, goodbye");
    process.exit(0);
  });
}

process.on("SIGTERM", cleanupAndShutdown);
process.on("SIGINT", cleanupAndShutdown);
