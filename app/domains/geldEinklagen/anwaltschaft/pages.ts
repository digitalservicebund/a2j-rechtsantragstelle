import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import {
  buildMoneyValidationSchema,
  formatCurrencyZodDescription,
} from "~/services/validation/money/buildMoneyValidationSchema";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";

export const geldEinklagenAnwaltschaftPages = {
  voraussetzungen: {
    stepId: "/voraussetzungen/intro",
  },
  klageInhalt: {
    stepId: "/inhalt-klage",
    pageSchema: {
      zahlungsklageSubjectLine: z
        .string()
        .trim()
        .max(100, { message: "max" })
        .optional(),
      zahlungsklageBezeichnung: z
        .string()
        .trim()
        .max(100, { message: "max" })
        .optional(),
      zahlungsklageNummer: z
        .string()
        .trim()
        .max(50, { message: "max" })
        .optional(),
      zahlungsklageGesamtstreitwert: buildMoneyValidationSchema({
        min: 1,
        max: 1000000,
      }).meta({ description: formatCurrencyZodDescription }),
    },
  },
  pilotgericht: {
    stepId: "/pilotgericht",
    pageSchema: {
      pilotgericht: z.enum([
        "bitburg",
        "bonn",
        "bremen",
        "duesseldorf",
        "eilenburg",
        "erding",
        "essen",
        "frankfurt-am-main",
        "hamburg-mitte",
        "koenigs-wusterhausen",
        "leipzig",
        "mannheim",
        "nuernberg",
        "nuertingen",
        "schoeneberg",
        "sinzig",
        "steinfurt",
      ]),
    },
  },
  prozessualeAusfuehrungen: {
    stepId: "/prozessantraege-prozessuale-ausfuehrungen",
    pageSchema: {
      muendlicheVerhandlung: schemaOrEmptyString(checkedOptional),
      videoverhandlung: schemaOrEmptyString(
        z.enum(["yes", "no", "noSpecification"]).optional(),
      ),
      versaeumnisurteil: schemaOrEmptyString(checkedOptional),
    },
  },
  rechtlicheWuerdigung: {
    stepId: "/rechtliche-wuerdigung",
    pageSchema: {
      rechtlicheWuerdigung: schemaOrEmptyString(
        z.string().trim().max(60000, { message: "max" }),
      ),
    },
  },
  downloadKlage: {
    stepId: "/klage-herunterladen",
  },
} as const satisfies PagesConfig;

export type GeldEinklagenAnwaltschaftPages =
  typeof geldEinklagenAnwaltschaftPages;
