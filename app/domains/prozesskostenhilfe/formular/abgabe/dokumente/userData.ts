import { z } from "zod";
import {
  pdfFileUploadArrayOptionalSchema,
  pdfFileUploadArrayRequiredSchema,
} from "~/services/validation/pdfFileSchema";

export const prozesskostenhilfeDokumenteInputSchema = {
  rechtsschutzversicherungDeckungBeweis: pdfFileUploadArrayRequiredSchema,
  rechtsschutzversicherungKeineDeckungBeweis: pdfFileUploadArrayRequiredSchema,
  organisationDeckungBeweis: pdfFileUploadArrayRequiredSchema,
  organisationKeineDeckungBeweis: pdfFileUploadArrayRequiredSchema,
  buergergeldBeweis: pdfFileUploadArrayRequiredSchema,
  arbeitslosengeldBeweis: pdfFileUploadArrayRequiredSchema,
  grundsicherungSozialhilfeBeweis: pdfFileUploadArrayRequiredSchema,
  asylbewerberleistungBeweis: pdfFileUploadArrayRequiredSchema,
  einkommenAngestelltBeweis: pdfFileUploadArrayRequiredSchema,
  einkommenSelbststaendigBeweis: pdfFileUploadArrayRequiredSchema,
  abzuegeBeweis: pdfFileUploadArrayRequiredSchema,
  werbungskostenBeweis: pdfFileUploadArrayRequiredSchema,
  renteBeweis: pdfFileUploadArrayRequiredSchema,
  wohngeldBeweis: pdfFileUploadArrayRequiredSchema,
  krankengeldBeweis: pdfFileUploadArrayRequiredSchema,
  elterngeldBeweis: pdfFileUploadArrayRequiredSchema,
  weitereEinkuenfteBeweis: pdfFileUploadArrayRequiredSchema,
  buergergeldPartnerBeweis: pdfFileUploadArrayRequiredSchema,
  arbeitslosengeldPartnerBeweis: pdfFileUploadArrayRequiredSchema,
  grundsicherungSozialhilfePartnerBeweis: pdfFileUploadArrayRequiredSchema,
  asylbewerberleistungPartnerBeweis: pdfFileUploadArrayRequiredSchema,
  einkommenAngestelltPartnerBeweis: pdfFileUploadArrayRequiredSchema,
  einkommenSelbststaendigPartnerBeweis: pdfFileUploadArrayRequiredSchema,
  abzuegePartnerBeweis: pdfFileUploadArrayRequiredSchema,
  werbungskostenPartnerBeweis: pdfFileUploadArrayRequiredSchema,
  rentePartnerBeweis: pdfFileUploadArrayRequiredSchema,
  wohngeldPartnerBeweis: pdfFileUploadArrayRequiredSchema,
  krankengeldPartnerBeweis: pdfFileUploadArrayRequiredSchema,
  elterngeldPartnerBeweis: pdfFileUploadArrayRequiredSchema,
  weitereEinkuenftePartnerBeweis: pdfFileUploadArrayRequiredSchema,
  mieteBeweis: pdfFileUploadArrayRequiredSchema,
  eigenheimNebenkostenBeweis: pdfFileUploadArrayRequiredSchema,
  eigenheimNebenkostenAnteilBeweis: pdfFileUploadArrayRequiredSchema,
  wertpapiereBeweis: pdfFileUploadArrayRequiredSchema,
  guthabenkontoKryptowaehrungBeweis: pdfFileUploadArrayRequiredSchema,
  sparkontenBeweis: pdfFileUploadArrayRequiredSchema,
  geldanlagenBefristetBeweis: pdfFileUploadArrayRequiredSchema,
  geldanlagenSonstigeBeweis: pdfFileUploadArrayRequiredSchema,
  grundeigentumBeweis: pdfFileUploadArrayRequiredSchema,
  kraftfahrzeugeBeweis: pdfFileUploadArrayRequiredSchema,
  schwangerschaftBeweis: pdfFileUploadArrayRequiredSchema,
  schwerbehinderungBeweis: pdfFileUploadArrayRequiredSchema,
  kostenaufwaendigeErnaehrungBeweis: pdfFileUploadArrayRequiredSchema,
  versicherungenBeweis: pdfFileUploadArrayRequiredSchema,
  ratenzahlungenBeweis: pdfFileUploadArrayRequiredSchema,
  sonstigeAusgabenBeweis: pdfFileUploadArrayRequiredSchema,
  weitereDokumenteBeweis: pdfFileUploadArrayOptionalSchema,
};

const _partialSchema = z
  .object(prozesskostenhilfeDokumenteInputSchema)
  .partial();

export type ProzesskostenhilfeDokumenteUserData = z.infer<
  typeof _partialSchema
>;
