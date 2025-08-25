import fs from "node:fs";

export const readSecretOrEnvVar = (
  secretPath: string,
  envVar: string,
  fallback = "",
) => {
  const readFromEnv = process.env[envVar]?.trim() ?? fallback;
  try {
    return fs.readFileSync(secretPath, "utf8") ?? readFromEnv;
  } catch {
    return readFromEnv;
  }
};
