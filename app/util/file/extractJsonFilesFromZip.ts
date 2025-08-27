import fs from "node:fs";
import path from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { normalizeFilepath } from "./normalizeFilepath";

export function extractJsonFilesFromZip(pathToZipFile: string) {
  const fileContent = fs.readFileSync(normalizeFilepath(pathToZipFile));

  // Only decompresses .json files into { path/to/filename1.json: U8Array, ... }
  const jsonFiles = unzipSync(fileContent, {
    filter: (file) =>
      file.name.endsWith(".json") && !file.name.startsWith("__MACOSX"),
  });
  const fileCount = Object.keys(jsonFiles).length;
  // oxlint-disable-next-line no-console
  console.log(
    `Unzipping ${pathToZipFile} succeeded, found ${fileCount} json files`,
  );
  // return normalized and parsed: (filename1.json: {...})
  return Object.fromEntries(
    Object.entries(jsonFiles).map(([k, v]) => [
      path.basename(k), // Note: This will cause multiple files of the same name to be overwritten
      JSON.parse(strFromU8(v)),
    ]),
  );
}
