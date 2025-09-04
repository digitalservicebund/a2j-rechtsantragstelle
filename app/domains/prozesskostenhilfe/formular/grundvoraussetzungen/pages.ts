import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const pkhFormularGrundvoraussetzungenPages = {
  nachueberpruefungFrage: {
    stepId: "grundvoraussetzungen/nachueberpruefung-frage",
    pageSchema: {
      formularArt: z.enum(["nachueberpruefung", "erstantrag"]),
    },
  },
  anhaengigesGerichtsverfahrenFrage: {
    stepId:
      "grundvoraussetzungen/anhaengiges-gerichtsverfahren/anhaengiges-gerichtsverfahren-frage",
    pageSchema: {
      anhaengigesGerichtsverfahrenFrage: z.enum(["yes", "no", "dontKnow"]),
    },
  },
  nameGericht: {
    stepId: "grundvoraussetzungen/anhaengiges-gerichtsverfahren/name-gericht",
    pageSchema: {
      gerichtName: stringOptionalSchema,
    },
  },
  aktenzeichen: {
    stepId: "grundvoraussetzungen/anhaengiges-gerichtsverfahren/aktenzeichen",
    pageSchema: {
      aktenzeichen: stringOptionalSchema,
    },
  },
  klageersteller: {
    stepId: "grundvoraussetzungen/antrag/klageersteller",
    pageSchema: {
      verfahrenArt: z.enum(["verfahrenSelbststaendig", "verfahrenAnwalt"]),
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
      versandArt: z.enum(["digital", "analog"]),
    },
  },
} as const satisfies PagesConfig;
