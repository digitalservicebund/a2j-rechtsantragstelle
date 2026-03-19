// oxlint-disable no-console
import { createServer, isRunnableDevEnvironment } from "vite";
import { resolve } from "node:path";

// Execute the default export of a script using Vite 6's Environment API Module Runner
// This natively handles TS, relative paths, and vite.config resolves
async function runner() {
  const scriptName = process.argv[2];
  if (!scriptName) {
    console.error("Please specify a script to run.");
    process.exit(1);
  }
  const targetPath = resolve(process.cwd(), "scripts", `${scriptName}.ts`);

  const server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false }, // No HTTP nor werbsocket server needed
    appType: "custom",
  });

  try {
    const environment = server.environments.ssr;
    if (!isRunnableDevEnvironment(environment))
      throw new Error("SSR environment is not runnable.");

    const module = await environment.runner.import(targetPath);
    console.log(`Executing script: ${scriptName}\n`);
    console.time("Execution time");
    if (module.default) await module.default();
    process.exitCode = 0;
    console.log(`\n✅ Script ${scriptName} finished successfully`);
    console.timeEnd("Execution time");
  } catch (error) {
    console.error("❌ Script execution failed:", error);
    process.exitCode = 1;
  } finally {
    await server.close();
  }
}

runner();
