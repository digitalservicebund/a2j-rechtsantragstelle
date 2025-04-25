import { PDFDocument } from "pdf-lib";
import { type Context } from "~/domains/contexts";
import { type FlowId } from "~/domains/flowIds";
import { downloadUserFileFromS3 } from "~/services/externalDataStorage/userFileS3Helpers";

/**
 * Extracts the saved file keys from the user data.
 * @param userData The user data to extract the saved file keys from
 * @returns An array of saved file keys
 */
const extractSavedFileKeys = (userData: Context) =>
  Object.values(userData)
    .filter((value) => Array.isArray(value))
    .flatMap((files) => files)
    .filter(
      (file) => file.savedFileKey && typeof file.savedFileKey === "string",
    )
    .map((file) => file.savedFileKey as string);

/**
 * Attaches user uploaded files into a PDF document.
 * @param mainPdfBuffer The PDF document as a Uint8Array
 * @param userData The user data containing saved file keys
 * @param cookieHeader The cookie header for the request for authentication
 * @param flowId The flow ID for the request
 * @returns The resulting PDF document as a Uint8Array
 */
export async function attachUserUploadedFilesToPdf(
  mainPdfBuffer: Uint8Array,
  userData: Context,
  cookieHeader: string | null,
  flowId: FlowId,
): Promise<Uint8Array> {
  const mainPdfDocument = await PDFDocument.load(mainPdfBuffer);
  const savedFileKeys = extractSavedFileKeys(userData);

  for (const savedFileKey of savedFileKeys) {
    const userFileBuffer = await downloadUserFileFromS3(
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
  return mainPdfDocument.save();
}
