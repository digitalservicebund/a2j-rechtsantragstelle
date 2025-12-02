import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { checkedRequired } from "~/services/validation/checkedCheckbox";

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
  },
  grundvoraussetzungenAmtsgericht: {
    stepId: "grundvoraussetzungen/amtsgericht",
  },
} satisfies PagesConfig;
