import fs from "node:fs";

export function printFileReadError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  ) {
    if (error.code === "ENOENT") {
      console.error("File not found:", error.message);
    } else {
      console.error("Error reading file:", error.message);
    }
  }
}

export function stripLeadingZeros(s?: string) {
  return s ? s.replace(/^0+/, "") : "";
}

export const loadJsonFromFile = (filePath: string) => {
  if (!global.jsonData) global.jsonData = {};
  if (!global.jsonData[filePath]) {
    try {
      global.jsonData[filePath] = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      printFileReadError(error);
    }
  }
  return global.jsonData[filePath] || {};
};
