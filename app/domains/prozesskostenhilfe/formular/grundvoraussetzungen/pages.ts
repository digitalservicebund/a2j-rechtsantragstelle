import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const pkhFormularGrundvoraussetzungenPages = {
  nachueberpruefungFrage: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/grundvoraussetzungen/nachueberpruefung-frage",
    pageSchema: {
      formularArt: z.enum(["nachueberpruefung", "erstantrag"]),
    },
  },
  anhaengigesGerichtsverfahrenFrage: {
    shouldCollapseIntoParentNavItem: true,
    stepId:
      "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/anhaengiges-gerichtsverfahren-frage",
    pageSchema: {
      anhaengigesGerichtsverfahrenFrage: z.enum(["yes", "no", "dontKnow"]),
    },
  },
  nameGericht: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/name-gericht",
    pageSchema: {
      gerichtName: stringOptionalSchema,
    },
  },
  aktenzeichen: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/grundvoraussetzungen/anhaengiges-gerichtsverfahren/aktenzeichen",
    pageSchema: {
      aktenzeichen: stringOptionalSchema,
    },
  },
  klageersteller: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/grundvoraussetzungen/antrag/klageersteller",
    pageSchema: {
      verfahrenArt: z.enum(["verfahrenSelbststaendig", "verfahrenAnwalt"]),
    },
  },
  hinweis: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/grundvoraussetzungen/antrag/hinweis",
  },
  hinweisDigitalEinreichung: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/grundvoraussetzungen/einreichung/hinweis-digital-einreichung",
  },
  mjp: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/grundvoraussetzungen/einreichung/mjp",
  },
  hinweisPapierEinreichung: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/grundvoraussetzungen/einreichung/hinweis-papier-einreichung",
  },
  fall: {
    shouldCollapseIntoParentNavItem: true,
    stepId: "/grundvoraussetzungen/einreichung/fall",
    pageSchema: {
      versandArt: z.enum(["digital", "analog"]),
    },
  },
} as const satisfies PagesConfig;
