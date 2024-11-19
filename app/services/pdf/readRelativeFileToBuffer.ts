import { readFile } from "node:fs/promises";
import path from "node:path";
import { logError } from "../logging";

export async function readRelativeFileToBuffer(relativeFilepath: string) {
  try {
    return readFile(path.resolve(path.join(process.cwd(), relativeFilepath)));
  } catch (error) {
    logError({ error });
    return ArrayBuffer.prototype;
  }
}
