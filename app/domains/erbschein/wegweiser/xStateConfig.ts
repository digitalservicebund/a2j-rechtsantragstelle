import type { Config } from "~/services/flow/server/types";
import { erbscheinWegweiserPages } from "~/domains/erbschein/wegweiser/pages";
import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";
import mapValues from "lodash/mapValues";

const stepIds = mapValues(erbscheinWegweiserPages, (v) => v.stepId);

// Machine ID used for absolute xState #id references from nested states
const machineId = "/erbschein/wegweiser";

// =============================================================================
// GUARDS
// =============================================================================

/** Guard: Check if there are living 1st order heirs (children or grandchildren) */
function hasLiving1stOrderHeirs({
  context,
}: {
  context: ErbscheinWegweiserUserData;
}) {
  if (context.hatKinder !== "yes") return false;
  const kinder = context.kinder ?? [];
  // At least one living child = 1st order heir exists
  if (kinder.some((k) => k.istVerstorben === "no")) return true;
  // Or a deceased child has living grandchildren
  return kinder.some(
    (k) =>
      k.istVerstorben === "yes" &&
      k.kinder?.some((gc) => gc.istVerstorben === "no"),
  );
}

// =============================================================================
// STATE MACHINE CONFIG
// =============================================================================

export const erbscheinWegweiserXstateConfig = {
  id: machineId,
  initial: stepIds.start,
  states: {
    // --- Vorabcheck: Do you need an Erbschein? ---
    [stepIds.start]: {
      on: { SUBMIT: stepIds.staatsangehoerigkeit },
    },
    [stepIds.staatsangehoerigkeit]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.staatsangehoerigkeit !== "german",
            target: stepIds.auslaendischerErbfall,
          },
          stepIds.lebensmittelpunkt,
        ],
        BACK: stepIds.start,
      },
    },
    [stepIds.lebensmittelpunkt]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.lebensmittelpunkt === "ausland",
            target: stepIds.auslaendischerErbfall,
          },
          stepIds.testamentOderErbvertrag,
        ],
        BACK: stepIds.staatsangehoerigkeit,
      },
    },
    [stepIds.auslaendischerErbfall]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.staatsangehoerigkeit !== "german",
            target: stepIds.staatsangehoerigkeit,
          },
          stepIds.lebensmittelpunkt,
        ],
      },
    },
    [stepIds.testamentOderErbvertrag]: {
      on: {
        BACK: stepIds.lebensmittelpunkt,
        SUBMIT: [
          {
            guard: ({ context }) => context.testamentType === "notarized",
            target: stepIds.notarizedTestament,
          },
          {
            guard: ({ context }) => context.testamentType === "erbvertrag",
            target: stepIds.erbvertrag,
          },
          stepIds.grundeigentum,
        ],
      },
    },
    [stepIds.notarizedTestament]: {
      on: { BACK: stepIds.testamentOderErbvertrag },
    },
    [stepIds.erbvertrag]: {
      on: { BACK: stepIds.testamentOderErbvertrag },
    },
    [stepIds.grundeigentum]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.hasGrundeigentum === "yes" &&
              context.testamentType === "handwritten",
            target: stepIds.erbscheinRequiredHandwrittenTestament,
          },
          {
            guard: ({ context }) =>
              context.hasGrundeigentum === "yes" &&
              context.testamentType === "none",
            target: stepIds.erbscheinRequiredNoTestament,
          },
          stepIds.unternehmen,
        ],
        BACK: stepIds.testamentOderErbvertrag,
      },
    },
    [stepIds.erbscheinRequiredHandwrittenTestament]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.hasGrundeigentum === "yes",
            target: stepIds.grundeigentum,
          },
          stepIds.unternehmen,
        ],
        // Continue to family tree collection after the informational page
        SUBMIT: stepIds.ehepartnerFrage,
      },
    },
    [stepIds.erbscheinRequiredNoTestament]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.hasGrundeigentum === "yes",
            target: stepIds.grundeigentum,
          },
          {
            guard: ({ context }) => context.hasUnternehmen === "yes",
            target: stepIds.unternehmen,
          },
          stepIds.bankRequestedErbschein,
        ],
        // Continue to family tree collection after the informational page
        SUBMIT: stepIds.ehepartnerFrage,
      },
    },
    [stepIds.unternehmen]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.hasUnternehmen === "yes" &&
              context.testamentType === "handwritten",
            target: stepIds.erbscheinRequiredHandwrittenTestament,
          },
          {
            guard: ({ context }) =>
              context.hasUnternehmen === "yes" &&
              context.testamentType === "none",
            target: stepIds.erbscheinRequiredNoTestament,
          },
          stepIds.bankRequestedErbschein,
        ],
        BACK: stepIds.grundeigentum,
      },
    },
    [stepIds.bankRequestedErbschein]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.bankRequestedErbschein === "no",
            target: stepIds.erbscheinNotRequired,
          },
          stepIds.erbscheinRequiredNoTestament,
        ],
        BACK: stepIds.unternehmen,
      },
    },
    [stepIds.erbscheinNotRequired]: {
      on: {
        BACK: stepIds.bankRequestedErbschein,
      },
    },

    // =========================================================================
    // ERBFOLGE: Family tree collection (geschlossen variant)
    // Flow: Spouse → Children → (if no 1st order) → Parents → Siblings
    // =========================================================================

    // --- Spouse (Ehepartner) ---
    [stepIds.ehepartnerFrage]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.hatEhepartner === "yes",
            target: stepIds.ehepartnerDaten,
          },
          stepIds.kinderFrage,
        ],
        BACK: [
          {
            guard: ({ context }) => context.testamentType === "handwritten",
            target: stepIds.erbscheinRequiredHandwrittenTestament,
          },
          stepIds.erbscheinRequiredNoTestament,
        ],
      },
    },
    [stepIds.ehepartnerDaten]: {
      on: {
        SUBMIT: stepIds.kinderFrage,
        BACK: stepIds.ehepartnerFrage,
      },
    },

    // --- 1st Order: Children (Kinder) with geschlossen pattern ---
    [stepIds.kinderFrage]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.hatKinder === "yes",
            target: stepIds.kinderAnzahl,
          },
          // No children → check 2nd order
          stepIds.elternFrage,
        ],
        BACK: [
          {
            guard: ({ context }) => context.hatEhepartner === "yes",
            target: stepIds.ehepartnerDaten,
          },
          stepIds.ehepartnerFrage,
        ],
      },
    },
    [stepIds.kinderAnzahl]: {
      on: {
        SUBMIT: stepIds.kinderEingabe,
        BACK: stepIds.kinderFrage,
      },
    },
    [stepIds.kinderEingabe]: {
      on: {
        SUBMIT: stepIds.kinderUebersicht,
        BACK: stepIds.kinderAnzahl,
      },
    },
    [stepIds.kinderUebersicht]: {
      on: {
        BACK: stepIds.kinderEingabe,
        SUBMIT: [
          // If there are living 1st order heirs → done with family tree
          {
            guard: hasLiving1stOrderHeirs,
            target: stepIds.erbfolgeErgebnis,
          },
          // Otherwise → need to check 2nd order
          stepIds.elternFrage,
        ],
      },
    },

    // --- 2nd Order: Parents (Eltern) ---
    [stepIds.elternFrage]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.hatEltern === "yes",
            target: stepIds.elternEingabe,
          },
          stepIds.geschwisterFrage,
        ],
        BACK: [
          // If user had children, go back to children overview
          {
            guard: ({ context }) => context.hatKinder === "yes",
            target: stepIds.kinderUebersicht,
          },
          // Otherwise go back to the kinder question
          stepIds.kinderFrage,
        ],
      },
    },
    [stepIds.elternEingabe]: {
      on: {
        SUBMIT: stepIds.geschwisterFrage,
        BACK: stepIds.elternFrage,
      },
    },

    // --- 2nd Order: Siblings (Geschwister) ---
    [stepIds.geschwisterFrage]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.hatGeschwister === "yes",
            target: stepIds.geschwisterAnzahl,
          },
          stepIds.erbfolgeErgebnis,
        ],
        BACK: [
          {
            guard: ({ context }) => context.hatEltern === "yes",
            target: stepIds.elternEingabe,
          },
          stepIds.elternFrage,
        ],
      },
    },
    [stepIds.geschwisterAnzahl]: {
      on: {
        SUBMIT: stepIds.geschwisterEingabe,
        BACK: stepIds.geschwisterFrage,
      },
    },
    [stepIds.geschwisterEingabe]: {
      on: {
        SUBMIT: stepIds.geschwisterUebersicht,
        BACK: stepIds.geschwisterAnzahl,
      },
    },
    [stepIds.geschwisterUebersicht]: {
      on: {
        BACK: stepIds.geschwisterEingabe,
        SUBMIT: stepIds.erbfolgeErgebnis,
      },
    },

    // --- Final result after family tree collection ---
    [stepIds.erbfolgeErgebnis]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.hatGeschwister === "yes",
            target: stepIds.geschwisterUebersicht,
          },
          {
            guard: ({ context }) => context.hatKinder === "yes",
            target: stepIds.kinderUebersicht,
          },
          stepIds.geschwisterFrage,
        ],
      },
    },
  },
} satisfies Config<ErbscheinWegweiserUserData>;
