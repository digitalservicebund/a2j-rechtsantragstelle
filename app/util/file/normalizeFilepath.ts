import path from "node:path";

export function normalizeFilepath(filepath: string) {
  return path.isAbsolute(filepath)
    ? path.resolve(filepath)
    : path.resolve(path.join(process.cwd(), filepath));
}
