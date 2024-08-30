import { readFile } from "node:fs/promises";
import path from "node:path";
import type { FlowId } from "~/flows/flowIds";
import { pdfs } from "./pdfs";
import { logError } from "../logging";

// Caching file read to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // eslint-disable-next-line no-var, sonarjs/no-var
  var __pdfFileBuffers: Partial<Record<FlowId, Buffer>>;
}

global.__pdfFileBuffers = Object.fromEntries(
  await Promise.all(
    pdfs.map(({ service, pdfFilename, flowId }) =>
      readRelativeFileToBuffer(
        path.join("data/pdf/", service, pdfFilename),
      ).then((pdfFileBuffer) => [flowId, pdfFileBuffer]),
    ),
  ),
);

async function readRelativeFileToBuffer(relativeFilepath: string) {
  try {
    return readFile(path.resolve(path.join(process.cwd(), relativeFilepath)));
  } catch (error) {
    logError({ error });
    return ArrayBuffer.prototype;
  }
}

export async function getPdfFileBuffer(flowId: FlowId) {
  return flowId in global.__pdfFileBuffers
    ? (global.__pdfFileBuffers[flowId] ?? ArrayBuffer.prototype)
    : ArrayBuffer.prototype;
}
