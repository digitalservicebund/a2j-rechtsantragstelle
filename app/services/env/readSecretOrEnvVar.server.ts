import fs from "node:fs";

export const readSecretOrEnvVar = (secretPath: string, envVar: string) => {
  const readFromEnv = process.env[envVar]?.trim();
  try {
    const fileContent = fs.readFileSync(secretPath, "utf8").trim();
    return fileContent || readFromEnv;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return readFromEnv;
    }
    throw error;
  }
};
