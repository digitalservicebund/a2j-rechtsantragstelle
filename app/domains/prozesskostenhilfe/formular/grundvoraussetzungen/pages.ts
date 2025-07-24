import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";

export const pkhFormularGrundvoraussetzungenPages = {
  nachueberpruefungFrage: {
    stepId: "grundvoraussetzungen/nachueberpruefung-frage",
    pageSchema: {
      formularArt: z.enum(
        ["nachueberpruefung", "erstantrag"],
        customRequiredErrorMessage,
      ),
    },
  },
  nameGericht: {
    stepId: "grundvoraussetzungen/nachueberpruefung/name-gericht",
    pageSchema: {
      gerichtName: stringOptionalSchema,
    },
  },
  aktenzeichen: {
    stepId: "grundvoraussetzungen/nachueberpruefung/aktenzeichen",
    pageSchema: {
      aktenzeichen: stringOptionalSchema,
    },
  },
  klageersteller: {
    stepId: "grundvoraussetzungen/antrag/klageersteller",
    pageSchema: {
      verfahrenArt: z.enum(
        ["verfahrenSelbststaendig", "verfahrenAnwalt"],
        customRequiredErrorMessage,
      ),
    },
  },
  hinweis: {
    stepId: "grundvoraussetzungen/antrag/hinweis",
  },
  hinweisDigitalEinreichung: {
    stepId: "grundvoraussetzungen/einreichung/hinweis-digital-einreichung",
  },
  mjp: {
    stepId: "grundvoraussetzungen/einreichung/mjp",
  },
  hinweisPapierEinreichung: {
    stepId: "grundvoraussetzungen/einreichung/hinweis-papier-einreichung",
  },
  fall: {
    stepId: "grundvoraussetzungen/einreichung/fall",
    pageSchema: {
      versandArt: z.enum(["digital", "analog"], customRequiredErrorMessage),
    },
  },
} as const satisfies PagesConfig;
