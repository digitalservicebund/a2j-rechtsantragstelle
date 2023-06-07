import path from "node:path";

export function normalizeFilepath(filepath: string) {
  return path.isAbsolute(filepath)
    ? path.resolve(filepath)
    : path.resolve(path.join(process.cwd(), filepath));
}

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
