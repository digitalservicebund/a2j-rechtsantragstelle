import { PDFDocument } from "pdf-lib";
import { type BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular/index";
import {
  getStaatlicheLeistungenStrings,
  weiteresEinkommenStrings,
  ausgabenStrings,
} from "~/domains/beratungshilfe/formular/stringReplacements";
import { geldAnlagenStrings } from "~/domains/shared/formular/stringReplacements";
import { getRelevantFiles } from "./getRelevantFiles";

export async function attachUserUploadedFilesToPdf(
  mainPdfBuffer: Uint8Array,
  sessionId: string,
  flowId: "/beratungshilfe/antrag",
  userData: BeratungshilfeFormularContext,
): Promise<Uint8Array> {
  const leistungen = getStaatlicheLeistungenStrings(userData);
  const weiteresEinkommen = weiteresEinkommenStrings(userData);
  const ausgaben = ausgabenStrings(userData);
  const geldAnlagen = geldAnlagenStrings(userData);

  const relevantFiles: Uint8Array[] = [];

  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.wohngeldBeweis,
      sessionId,
      flowId,
      weiteresEinkommen.wohngeld,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.bafoegBeweis,
      sessionId,
      flowId,
      weiteresEinkommen.bafoeg,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.krankengeldBeweis,
      sessionId,
      flowId,
      weiteresEinkommen.krankengeld,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.elterngeldBeweis,
      sessionId,
      flowId,
      weiteresEinkommen.elterngeld,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.buergergeldBeweis,
      sessionId,
      flowId,
      leistungen.hasBuergergeld,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.asylbewerberleistungenBeweis,
      sessionId,
      flowId,
      leistungen.hasAsylbewerberleistungen,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.keineLeistungenBeweis,
      sessionId,
      flowId,
      leistungen.hasNoSozialleistung,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.grundsicherungBeweis,
      sessionId,
      flowId,
      leistungen.hasGrundsicherung,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.lebensversicherungBeweis,
      sessionId,
      flowId,
      geldAnlagen.hasLebensversicherung,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.bausparvertragBeweis,
      sessionId,
      flowId,
      geldAnlagen.hasBausparvertrag,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.wertpapiereBeweis,
      sessionId,
      flowId,
      geldAnlagen.hasWertpapiere,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.guthabenkontoBeweis,
      sessionId,
      flowId,
      geldAnlagen.hasGutenhabenKrypto,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.sparkontoBeweis,
      sessionId,
      flowId,
      geldAnlagen.hasGiroTagesSparkonto,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.grundeigentumBeweis,
      sessionId,
      flowId,
      geldAnlagen.hasGrundeigentum,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.schwangerschaftAngabeBeweis,
      sessionId,
      flowId,
      ausgaben.hasSchwangerschaft,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.schwerbehinderungBeweis,
      sessionId,
      flowId,
      ausgaben.hasSchwerbehinderung,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.medizinischeGruendeBeweis,
      sessionId,
      flowId,
      ausgaben.hasMedicalReasons,
    )),
  );
  relevantFiles.push(
    ...(await getRelevantFiles(
      userData.weitereAusgabenBeweis,
      sessionId,
      flowId,
      ausgaben.hasWeitereAusgaben,
    )),
  );

  
  if (relevantFiles.length === 0) {
    return mainPdfBuffer;
  }

  const pdfWithUserFiles = await PDFDocument.load(mainPdfBuffer);

  for (const file of relevantFiles) {
    const userPdfFile = await PDFDocument.load(file);
    const copiedPdfFilePages = await pdfWithUserFiles.copyPages(
      userPdfFile,
      userPdfFile.getPageIndices(),
    );
    for (const copiedPdfFilePage of copiedPdfFilePages) {
      pdfWithUserFiles.addPage(copiedPdfFilePage);
    }
  }
  return pdfWithUserFiles.save();
}
