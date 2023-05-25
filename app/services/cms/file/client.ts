import fs from "fs";
import path from "path";
import { FileContentSchema } from "../models/FileContent";

export const getContentFilePath = (
  filePath: string,
  workingDirectory?: string
) => {
  const directory = workingDirectory ? [workingDirectory] : [__dirname, ".."]; // leave build directory
  return path.join(...directory, filePath);
};

export const loadContentFile = (filePath: string) => {
  const content = fs.readFileSync(filePath);
  const jsonContent = JSON.parse(content.toString());
  return FileContentSchema.strict().parse(jsonContent);
};
