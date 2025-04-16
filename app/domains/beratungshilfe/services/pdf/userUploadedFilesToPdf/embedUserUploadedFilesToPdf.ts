import { PDFDocument } from "pdf-lib";
import { type BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { type FlowId } from "~/domains/flowIds";
import { downloadUserFile } from "~/services/upload/fileUploadHelpers.server";

/**
 * Extracts all saved file keys from userData.
 * @param userData user data which can contain saved file keys in the form of arrays of objects
 * @returns an array of all saved file keys
 */
export const extractSavedFileKeys = (
  userData: BeratungshilfeFormularContext,
) => {
  const allKeys: string[] = [];
  for (const value of Object.values(userData)) {
    if (Array.isArray(value)) {
      for (const file of value) {
        if (file.savedFileKey) {
          allKeys.push(file.savedFileKey);
        }
      }
    }
  }
  return allKeys;
};

/**
 * Embeds user uploaded files into a PDF document.
 * @param mainPdfBuffer The PDF document as a Uint8Array
 * @param userData The user data containing saved file keys
 * @param cookieHeader The cookie header for the request for authentication
 * @param flowId The flow ID for the request
 * @returns The resulting PDF document as a Uint8Array
 */
export async function embedUserFilesToPdf(
  mainPdfBuffer: Uint8Array,
  userData: BeratungshilfeFormularContext,
  cookieHeader: string | null,
  flowId: FlowId,
): Promise<Uint8Array> {
  const mainPdfDocument = await PDFDocument.load(mainPdfBuffer);
  const savedFileKeys = extractSavedFileKeys(userData);

  for (const savedFileKey of savedFileKeys) {
    const userFileBuffer = await downloadUserFile(
      cookieHeader,
      flowId,
      savedFileKey,
    );
    const userPdfFile = await PDFDocument.load(userFileBuffer);

    // Copy the pages from the user PDF file to the main PDF document
    const copiedPdfFilePages = await mainPdfDocument.copyPages(
      userPdfFile,
      userPdfFile.getPageIndices(),
    );

    // Add the copied pages to the main PDF document
    for (const copiedPdfFilePage of copiedPdfFilePages) {
      mainPdfDocument.addPage(copiedPdfFilePage);
    }
  }
  const finalPdf = await mainPdfDocument.save();
  return finalPdf;
}
