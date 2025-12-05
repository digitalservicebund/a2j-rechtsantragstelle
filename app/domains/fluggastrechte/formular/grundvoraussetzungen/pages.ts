import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { airportSchema } from "~/services/validation/airport";
import { checkedRequired } from "~/services/validation/checkedCheckbox";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const fluggastrechteGrundvoraussetzungenPages = {
  grundvoraussetzungenDatenverarbeitung: {
    stepId: "grundvoraussetzungen/datenverarbeitung",
    pageSchema: {
      datenverarbeitungZustimmung: checkedRequired,
    },
  },
  grundvoraussetzungenStreitbeilegung: {
    stepId: "grundvoraussetzungen/streitbeilegung",
    pageSchema: {
      streitbeilegung: z.enum(["yes", "no", "noSpecification"]),
    },
  },
  grundvoraussetzungenStreitbeilegungGruende: {
    stepId: "grundvoraussetzungen/streitbeilegung-gruende",
    pageSchema: {
      streitbeilegungGruende: z.enum(["yes", "no", "noSpecification"]),
    },
  },
  grundvorraussetzungenProzessfaehig: {
    stepId: "grundvoraussetzungen/prozessfaehig",
  },
  grundvoraussetzungenAusgleichszahlung: {
    stepId: "grundvoraussetzungen/ausgleichszahlung",
  },
  grundvoraussetzungenDatenUebernahme: {
    stepId: "grundvoraussetzungen/daten-uebernahme",
    pageSchema: {
      fluggesellschaft: hiddenInputSchema(schemaOrEmptyString(z.string())),
      startAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
      endAirport: hiddenInputSchema(schemaOrEmptyString(airportSchema)),
      entschaedigung: hiddenInputSchema(
        schemaOrEmptyString(stringOptionalSchema),
      ),
      bereich: hiddenInputSchema(stringOptionalSchema),
    },
  },
  grundvoraussetzungenAmtsgericht: {
    stepId: "grundvoraussetzungen/amtsgericht",
  },
} satisfies PagesConfig;
