import fs from "node:fs";

export const readSecretOrEnvVar = (secretPath: string, envVar: string) => {
  const readFromEnv = process.env[envVar]?.trim();
  try {
    return fs.readFileSync(secretPath, "utf8").trim() ?? readFromEnv;
  } catch {
    return readFromEnv;
  }
};
