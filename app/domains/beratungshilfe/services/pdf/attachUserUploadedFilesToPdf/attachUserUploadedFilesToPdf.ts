import { PDFDocument } from "pdf-lib";
import { type BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular/index";
import {
  getStaatlicheLeistungenStrings,
  weiteresEinkommenStrings,
  ausgabenStrings,
} from "~/domains/beratungshilfe/formular/stringReplacements";
import { type FlowId } from "~/domains/flowIds";
import { geldAnlagenStrings } from "~/domains/shared/formular/stringReplacements";
import { downloadUserFileFromS3 } from "~/services/externalDataStorage/userFileS3Helpers";

/**
 * Attaches user-uploaded PDF files to a main PDF document.
 *
 * This function downloads relevant user-uploaded files from S3 based on the user's data
 * and appends them to the main PDF document. Various criteria from the user's data
 * determine which files are considered relevant. The function returns a new PDF buffer
 * that contains all the pages from the original main PDF document followed by the
 * pages from the user-uploaded files.
 *
 * @param mainPdfBuffer - The buffer of the main PDF document to which user files will be attached.
 * @param userData - The user's data context, which includes information about uploaded files
 *                   and the criteria for their relevance.
 * @param sessionId - The session ID of the user, used for accessing user-specific data in S3.
 * @param flowId - The flow ID that identifies the relevant process or form context.
 * @returns A promise that resolves to a Uint8Array buffer representing the new PDF document
 *          with the user-uploaded files attached.
 */
export async function attachUserUploadedFilesToPdf(
  mainPdfBuffer: Uint8Array,
  userData: BeratungshilfeFormularContext,
  sessionId: string,
  flowId: FlowId,
): Promise<Uint8Array> {
  const relevantDocumentsPromises: Array<Array<Promise<Uint8Array>>> = [];
  const leistungen = getStaatlicheLeistungenStrings(userData);
  const weiteresEinkommen = weiteresEinkommenStrings(userData);
  const ausgaben = ausgabenStrings(userData);
  const geldAnlagen = geldAnlagenStrings(userData);
  const addRelevantDocuments = (
    condition: boolean,
    evidence: Array<{ savedFileKey?: string }> | undefined,
  ) => {
    if (condition && evidence) {
      relevantDocumentsPromises.push(
        evidence.map((fileMeta) =>
          downloadUserFileFromS3(
            sessionId,
            flowId,
            fileMeta.savedFileKey ?? "",
          ),
        ),
      );
    }
  };
  addRelevantDocuments(
    weiteresEinkommen.arbeitslosenGeld,
    userData.arbeitslosengeldBeweis,
  );
  addRelevantDocuments(weiteresEinkommen.wohngeld, userData.wohngeldBeweis);
  addRelevantDocuments(weiteresEinkommen.bafoeg, userData.bafoegBeweis);
  addRelevantDocuments(
    weiteresEinkommen.krankengeld,
    userData.krankengeldBeweis,
  );
  addRelevantDocuments(weiteresEinkommen.elterngeld, userData.elterngeldBeweis);
  addRelevantDocuments(leistungen.hasBuergergeld, userData.buergergeldBeweis);
  addRelevantDocuments(
    leistungen.hasAsylbewerberleistungen,
    userData.asylbewerberleistungenBeweis,
  );
  addRelevantDocuments(
    leistungen.hasNoSozialleistung,
    userData.keineLeistungenBeweis,
  );
  addRelevantDocuments(
    leistungen.hasGrundsicherung,
    userData.grundsicherungBeweis,
  );
  addRelevantDocuments(
    geldAnlagen.hasLebensversicherung ?? false,
    userData.lebensversicherungBeweis,
  );
  addRelevantDocuments(
    geldAnlagen.hasBausparvertrag ?? false,
    userData.bausparvertragBeweis,
  );
  addRelevantDocuments(
    geldAnlagen.hasWertpapiere ?? false,
    userData.wertpapiereBeweis,
  );
  addRelevantDocuments(
    geldAnlagen.hasGutenhabenKrypto ?? false,
    userData.guthabenkontoBeweis,
  );
  addRelevantDocuments(
    geldAnlagen.hasGiroTagesSparkonto ?? false,
    userData.sparkontoBeweis,
  );
  addRelevantDocuments(
    geldAnlagen.hasGrundeigentum ?? false,
    userData.grundeigentumBeweis,
  );
  addRelevantDocuments(
    ausgaben.hasSchwangerschaft,
    userData.schwangerschaftAngabeBeweis,
  );
  addRelevantDocuments(
    ausgaben.hasSchwerbehinderung,
    userData.schwerbehinderungBeweis,
  );
  addRelevantDocuments(
    ausgaben.hasMedicalReasons,
    userData.medizinischeGruendeBeweis,
  );
  addRelevantDocuments(
    ausgaben.hasWeitereAusgaben ?? false,
    userData.weitereAusgabenBeweis,
  );
  const relevantDocuments: Uint8Array[] = await Promise.all(
    relevantDocumentsPromises.flat(),
  );
  if (relevantDocuments.length === 0) {
    return mainPdfBuffer;
  }
  const mainPdfDocument = await PDFDocument.load(mainPdfBuffer);
  for (const file of relevantDocuments) {
    const userPdfFile = await PDFDocument.load(file);
    const copiedPdfFilePages = await mainPdfDocument.copyPages(
      userPdfFile,
      userPdfFile.getPageIndices(),
    );
    for (const copiedPdfFilePage of copiedPdfFilePages) {
      mainPdfDocument.addPage(copiedPdfFilePage);
    }
  }
  return mainPdfDocument.save();
}
