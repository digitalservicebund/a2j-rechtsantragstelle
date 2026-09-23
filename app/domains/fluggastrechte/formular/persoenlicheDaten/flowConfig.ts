import { z } from "zod/mini";
import { weiterePersonenArraySchema } from "~/domains/fluggastrechte/formular/persoenlicheDaten/pages";
import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";
import type { FluggastrechteFormularPages } from "../pages";

export const persoenlicheDatenFlowConfig = {
  personDaten: [
    {
      target: "weiterePersonenFrage",
      guard: (context) =>
        objectKeysNonEmpty(context, [
          "vorname",
          "nachname",
          "strasse",
          "hausnummer",
          "plz",
          "ort",
        ]),
    },
  ],
  weiterePersonenFrage: [
    {
      target: "weiterePersonenUebersicht",
      guard: ({ isWeiterePersonen }) => isWeiterePersonen === "yes",
    },
    {
      target: "prozessfuehrungZeugen",
    },
  ],
  weiterePersonenUebersicht: [
    {
      target: "weiterePersonenDaten",
      type: "addArrayItem",
    },
    {
      target: "weiterePersonenWarnung",
      guard: ({ isWeiterePersonen, weiterePersonen }) =>
        isWeiterePersonen === "yes" && !weiterePersonen?.length,
    },
    {
      target: "prozessfuehrungZeugen",
      guard: ({ weiterePersonen }) =>
        z.validate(weiterePersonenArraySchema, weiterePersonen),
    },
  ],
  weiterePersonenDaten: [
    {
      guard: ({ weiterePersonen, pageData }) => {
        const arrayIndex = pageData?.arrayIndexes?.at(0);
        if (!weiterePersonen || arrayIndex === undefined) return false;
        return z.validate(
          weiterePersonenArraySchema.unwrap(),
          weiterePersonen[arrayIndex],
        );
      },
      target: "weiterePersonenUebersicht",
    },
  ],
  weiterePersonenWarnung: "weiterePersonenUebersicht",
} satisfies Partial<TransitionConfigMap<FluggastrechteFormularPages>>;
