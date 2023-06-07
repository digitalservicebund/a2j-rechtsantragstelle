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
