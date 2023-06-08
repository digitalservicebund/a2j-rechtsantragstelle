import path from "node:path";
import fs from "node:fs";
import { unzipSync, strFromU8 } from "fflate";

export function normalizeFilepath(filepath: string) {
  return path.isAbsolute(filepath)
    ? path.resolve(filepath)
    : path.resolve(path.join(process.cwd(), filepath));
}

export function extractJsonFilesFromZip(pathToZipFile: string) {
  let fileContent = fs.readFileSync(normalizeFilepath(pathToZipFile));

  // Only decompresses .json files into { path/to/filename1.json: U8Array, ... }
  const jsonFiles = unzipSync(fileContent, {
    filter: (file) =>
      file.name.endsWith(".json") && !file.name.startsWith("__MACOSX"),
  });
  const fileCount = Object.keys(jsonFiles).length;
  console.log(
    `Unzipping ${pathToZipFile} succeeded, found ${fileCount} json files`
  );
  // return normalized and parsed: (filename1.json: {...})
  return Object.fromEntries(
    Object.entries(jsonFiles).map(([k, v]) => [
      path.basename(k), // Note: This will cause multiple files of the same name to be overwritten
      JSON.parse(strFromU8(v)),
    ])
  );
}
