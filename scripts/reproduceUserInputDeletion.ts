/* eslint-disable sonarjs/no-os-command-from-path */
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import {
  getSessionManager,
  updateSession,
} from "../app/services/session.server/index";
import { expect } from "@playwright/test";

let server: ReturnType<typeof spawn> | null = null;
const TEST_MARKER = "<div>test</div>";
const APP_URL =
  "http://localhost:3000/beratungshilfe/antrag/rechtsproblem/situation-beschreibung";
const COMPONENT_PATH = path.resolve(
  "app/components/formElements/ValidatedFlowForm.tsx",
);
const originalContent = fs.readFileSync(COMPONENT_PATH, "utf-8");
const ASSETS_PATH = path.resolve("build/client/assets");
const userData = {
  rechtsschutzversicherung: "no",
  wurdeVerklagt: "no",
  klageEingereicht: "no",
  hamburgOderBremen: "no",
  beratungshilfeBeantragt: "no",
  eigeninitiativeGrundvorraussetzung: "no",
};

function cleanup() {
  console.log("Cleaning up...");
  try {
    if (server && !server.killed) {
      server.kill("SIGTERM");
    }
    if (originalContent && fs.existsSync(COMPONENT_PATH)) {
      fs.writeFileSync(COMPONENT_PATH, originalContent);
      console.log("Restored original file.");
    }
  } catch (err) {
    console.error("Error during cleanup:", err);
    process.exit(1);
  }
}

function getManifestFilename(): string | null {
  try {
    const files = fs.readdirSync(ASSETS_PATH);
    const manifestFile = files.find(
      (file) => file.startsWith("manifest-") && file.endsWith(".js"),
    );
    return manifestFile ?? null;
  } catch (err) {
    console.error("Error reading assets directory:", err);
    return null;
  }
}

process.on("SIGINT", () => {
  console.log("Received SIGINT (Ctrl+C)");
  cleanup();
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
  cleanup();
});

async function run() {
  console.log("Cleaning and building project...");
  execSync("rm -rf build && npm run build", { stdio: "inherit" });
  const firstManifest = getManifestFilename();

  console.log("Starting server...");
  server = spawn("npm", ["start"], { stdio: "inherit" });

  await new Promise((r) => setTimeout(r, 4000));

  console.log("Launching browser...");
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });
  const context = await browser.newContext({
    javaScriptEnabled: true,
  });

  console.log("Setting cookie...");
  const { getSession, commitSession } = getSessionManager(
    "/beratungshilfe/antrag",
  );
  const session = await getSession();
  updateSession(session, userData);
  const setCookieHeader = await commitSession(session);
  const [splitCookieHeader] = setCookieHeader.split(";");
  const [cookieName, cookieValue] = splitCookieHeader.split("=");

  await context.addCookies([
    {
      name: cookieName,
      value: cookieValue,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  const page = await context.newPage();

  console.log("Navigating to page...");
  await page.goto(APP_URL);

  console.log("Typing text...");
  await page.locator("#gegenseite").fill("Text Gegenseite");
  await page.locator("#beschreibung").fill("Text Beschreibung");
  await page.locator("#ziel").fill("Text Ziel");
  await page
    .locator("#eigeninitiativeBeschreibung")
    .fill("Text Eigeninitiative");

  console.log("Stopping server...");
  if (server && !server.killed) {
    server.kill("SIGTERM");
  }

  console.log("Modifying component code...");
  const modifiedContent = originalContent.replace(
    "</>",
    `${TEST_MARKER}\n        </>`,
  );
  fs.writeFileSync(COMPONENT_PATH, modifiedContent);

  console.log("Cleaning and rebuilding project...");
  execSync("rm -rf build && npm run build", { stdio: "inherit" });
  const secondManifest = getManifestFilename();
  console.log("First manifest filename:", firstManifest);
  console.log("Second manifest filename:", secondManifest);
  console.log("Manifests match:", firstManifest === secondManifest);

  console.log("Restarting server...");
  server = spawn("npm", ["start"], { stdio: "inherit" });
  await new Promise((r) => setTimeout(r, 4000));

  console.log("Clicking Weiter...");
  await page.click("text=Weiter");
  const gegenseiteCount = await page.locator("#gegenseite").count();
  console.log(`Element #gegenseite exists: ${gegenseiteCount > 0}`);
  await expect(page.locator("#gegenseite")).not.toBeVisible();
  await new Promise((r) => setTimeout(r, 4000));

  await browser.close();
  cleanup();
  process.exit(0);
}

try {
  await run();
} catch (err) {
  console.error("Error:", err);
  cleanup();
  process.exit(1);
}
