import { PDFDocument } from "pdf-lib";
import { dokumenteContext } from "~/domains/beratungshilfe/formular/abgabe/dokumente/context";
import { type Context } from "~/domains/contexts";
import { type FlowId } from "~/domains/flowIds";
import { downloadUserFileFromS3 } from "~/services/externalDataStorage/userFileS3Helpers";

/**
 * Attaches user uploaded files into a PDF document.
 * @param mainPdfBuffer The PDF document as a Uint8Array
 * @param userData The user data containing saved file keys
 * @param sessionId The session Id for the request for authentication
 * @param flowId The flow ID for the request
 * @returns The resulting PDF document as a Uint8Array
 */
export async function attachUserUploadedFilesToPdf(
  mainPdfBuffer: Uint8Array,
  userData: Context,
  sessionId: string,
  flowId: FlowId,
): Promise<Uint8Array> {
  const mainPdfDocument = await PDFDocument.load(mainPdfBuffer);

  // Get all document beleg keys in userData
  const documentBelegKeys = Object.keys(userData).filter(
    (key) => key in dokumenteContext && Array.isArray(userData[key]),
  );

  // Get last beleg where files were uploaded
  const lastSelectedBeleg = documentBelegKeys[documentBelegKeys.length - 1];

  // Get uploaded files for the beleg
  const uploadedFiles = userData[lastSelectedBeleg] ?? [];

  // Check if uploaded files is a valid array
  if (Array.isArray(uploadedFiles)) {
    for (const file of uploadedFiles) {
      const userFileBuffer = await downloadUserFileFromS3(
        sessionId,
        flowId,
        String(file.savedFileKey),
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
    // Return main PDF document with uploaded files
    return await mainPdfDocument.save();
  }
  // Return the original PDF document if no files are uploaded
  return mainPdfBuffer;
}
