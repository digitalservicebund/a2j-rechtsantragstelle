import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  pdfFileUploadArrayOptionalSchema,
  pdfFileUploadArrayRequiredSchema,
} from "~/services/validation/pdfFileSchema";

export const berHAntragAbgabePages = {
  abgabe: {
    stepId: "abgabe",
  },
  ueberpruefung: {
    stepId: "abgabe/ueberpruefung",
  },
  zusammenfassung: {
    stepId: "abgabe/zusammenfassung",
  },
  art: {
    stepId: "abgabe/art",
    pageSchema: {
      abgabeArt: z.enum(["online", "ausdrucken"]),
    },
  },
  dokumente: {
    stepId: "abgabe/dokumente",
    pageSchema: {
      arbeitslosengeldBeweis: pdfFileUploadArrayRequiredSchema,
      wohngeldBeweis: pdfFileUploadArrayRequiredSchema,
      bafoegBeweis: pdfFileUploadArrayRequiredSchema,
      krankengeldBeweis: pdfFileUploadArrayRequiredSchema,
      elterngeldBeweis: pdfFileUploadArrayRequiredSchema,
      buergergeldBeweis: pdfFileUploadArrayRequiredSchema,
      asylbewerberleistungenBeweis: pdfFileUploadArrayRequiredSchema,
      keineLeistungenBeweis: pdfFileUploadArrayRequiredSchema,
      grundsicherungBeweis: pdfFileUploadArrayRequiredSchema,
      lebensversicherungBeweis: pdfFileUploadArrayRequiredSchema,
      bausparvertragBeweis: pdfFileUploadArrayRequiredSchema,
      wertpapiereBeweis: pdfFileUploadArrayRequiredSchema,
      guthabenkontoBeweis: pdfFileUploadArrayRequiredSchema,
      sparkontoBeweis: pdfFileUploadArrayRequiredSchema,
      grundeigentumBeweis: pdfFileUploadArrayRequiredSchema,
      schwangerschaftAngabeBeweis: pdfFileUploadArrayRequiredSchema,
      schwerbehinderungBeweis: pdfFileUploadArrayRequiredSchema,
      medizinischeGruendeBeweis: pdfFileUploadArrayRequiredSchema,
      weitereAusgabenBeweis: pdfFileUploadArrayRequiredSchema,
      weitereDokumenteBeweis: pdfFileUploadArrayOptionalSchema,
    },
  },
  ausdrucken: {
    stepId: "abgabe/ausdrucken",
  },
  online: {
    stepId: "abgabe/online",
  },
} as const satisfies PagesConfig;
