import { PDFDocument } from "pdf-lib";
import { type BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular/index";
import { getStaatlicheLeistungenStrings } from "~/domains/beratungshilfe/formular/stringReplacements";
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
  userData: BeratungshilfeFormularContext,
  sessionId: string,
  flowId: FlowId,
): Promise<Uint8Array> {
  const relevantDocumentsPromises = [];

  const leistungen = getStaatlicheLeistungenStrings(userData);
  if (leistungen.hasBuergergeld && userData.buergergeldBeweis) {
    relevantDocumentsPromises.push(
      userData.buergergeldBeweis.map((fileMeta) =>
        downloadUserFileFromS3(sessionId, flowId, fileMeta.savedFileKey ?? ""),
      ),
    );
  }
  if (
    leistungen.hasAsylbewerberleistungen &&
    userData.asylbewerberleistungenBeweis
  ) {
    relevantDocumentsPromises.push(
      userData.asylbewerberleistungenBeweis.map((fileMeta) =>
        downloadUserFileFromS3(sessionId, flowId, fileMeta.savedFileKey ?? ""),
      ),
    );
  }
  const relevantDocuments = await Promise.all(relevantDocumentsPromises.flat());

  if (relevantDocuments.length === 0) {
    return mainPdfBuffer;
  }

  const mainPdfDocument = await PDFDocument.load(mainPdfBuffer);

  for (const file of relevantDocuments) {
    const userPdfFile = await PDFDocument.load(file);

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
  return mainPdfDocument.save();
}
