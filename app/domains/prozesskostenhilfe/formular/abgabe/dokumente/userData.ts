import { z } from "zod";
import {
  pdfFileMetaDataSchema,
  fileUploadLimit,
} from "~/util/file/pdfFileSchema";

const fileUploadRequiredSchema = z
  .array(pdfFileMetaDataSchema)
  .nonempty({ message: "fileRequired" })
  .max(fileUploadLimit, { message: "fileLimitReached" })
  .optional(); // Must remain despite being required, as the zod schema has no knowledge of which field is required

const fileUploadOptionalSchema = z
  .array(pdfFileMetaDataSchema)
  .max(fileUploadLimit, { message: "fileLimitReached" })
  .optional();

export const prozesskostenhilfeDokumenteInputSchema = {
  rechtsschutzversicherungDeckungBeweis: fileUploadRequiredSchema,
  rechtsschutzversicherungKeineDeckungBeweis: fileUploadRequiredSchema,
  organisationDeckungBeweis: fileUploadRequiredSchema,
  organisationKeineDeckungBeweis: fileUploadRequiredSchema,
  buergergeldBeweis: fileUploadRequiredSchema,
  arbeitslosengeldBeweis: fileUploadRequiredSchema,
  grundsicherungSozialhilfeBeweis: fileUploadRequiredSchema,
  asylbewerberleistungBeweis: fileUploadRequiredSchema,
  einkommenAngestelltBeweis: fileUploadRequiredSchema,
  einkommenSelbststaendigBeweis: fileUploadRequiredSchema,
  abzuegeBeweis: fileUploadRequiredSchema,
  werbungskostenBeweis: fileUploadRequiredSchema,
  renteBeweis: fileUploadRequiredSchema,
  wohngeldBeweis: fileUploadRequiredSchema,
  krankengeldBeweis: fileUploadRequiredSchema,
  elterngeldBeweis: fileUploadRequiredSchema,
  weitereEinkuenfteBeweis: fileUploadRequiredSchema,
  buergergeldPartnerBeweis: fileUploadRequiredSchema,
  arbeitslosengeldPartnerBeweis: fileUploadRequiredSchema,
  grundsicherungSozialhilfePartnerBeweis: fileUploadRequiredSchema,
  asylbewerberleistungPartnerBeweis: fileUploadRequiredSchema,
  einkommenAngestelltPartnerBeweis: fileUploadRequiredSchema,
  einkommenSelbststaendigPartnerBeweis: fileUploadRequiredSchema,
  abzuegePartnerBeweis: fileUploadRequiredSchema,
  werbungskostenPartnerBeweis: fileUploadRequiredSchema,
  rentePartnerBeweis: fileUploadRequiredSchema,
  wohngeldPartnerBeweis: fileUploadRequiredSchema,
  krankengeldPartnerBeweis: fileUploadRequiredSchema,
  elterngeldPartnerBeweis: fileUploadRequiredSchema,
  weitereEinkuenftePartnerBeweis: fileUploadRequiredSchema,
  mieteBeweis: fileUploadRequiredSchema,
  eigenheimNebenkostenBeweis: fileUploadRequiredSchema,
  eigenheimNebenkostenAnteilBeweis: fileUploadRequiredSchema,
  wertpapiereBeweis: fileUploadRequiredSchema,
  guthabenkontoKryptowaehrungBeweis: fileUploadRequiredSchema,
  sparkontenBeweis: fileUploadRequiredSchema,
  geldanlagenBefristetBeweis: fileUploadRequiredSchema,
  geldanlagenSonstigeBeweis: fileUploadRequiredSchema,
  grundeigentumBeweis: fileUploadRequiredSchema,
  kraftfahrzeugeBeweis: fileUploadRequiredSchema,
  schwangerschaftBeweis: fileUploadRequiredSchema,
  schwerbehinderungBeweis: fileUploadRequiredSchema,
  kostenaufwaendigeErnaehrungBeweis: fileUploadRequiredSchema,
  versicherungenBeweis: fileUploadRequiredSchema,
  ratenzahlungenBeweis: fileUploadRequiredSchema,
  sonstigeAusgabenBeweis: fileUploadRequiredSchema,
  weitereDokumenteBeweis: fileUploadOptionalSchema,
};

const _partialSchema = z
  .object(prozesskostenhilfeDokumenteInputSchema)
  .partial();

export type prozesskostenhilfeDokumenteUserData = z.infer<
  typeof _partialSchema
>;
