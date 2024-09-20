import type { Context } from "~/flows/contexts";
import type { GenericGuard } from "~/flows/guards.server";
import { kinderGuards } from "./guards";
import { kinderDone } from "../../../beratungshilfeFormular/finanzielleAngaben/doneFunctions";

export function getkinderXstateConfig<T extends Context>(transitions: {
  onBack: (string | { guard: GenericGuard<T>; target: string })[];
  onSubmit: string;
}) {
  return {
    id: "kinder",
    initial: "kinder-frage",
    meta: { done: kinderDone },
    states: {
      "kinder-frage": {
        on: {
          BACK: transitions.onBack,
          SUBMIT: [
            {
              guard: kinderGuards.hasKinderYes,
              target: "uebersicht",
            },
            transitions.onSubmit,
          ],
        },
      },
      uebersicht: {
        on: {
          BACK: "kinder-frage",
          SUBMIT: [
            {
              guard: kinderGuards.hasKinderYesAndEmptyArray,
              target: "warnung",
            },
            transitions.onSubmit,
          ],
          "add-kinder": {
            guard: kinderGuards.isValidKinderArrayIndex,
            target: "kinder",
          },
        },
      },
      warnung: {
        on: {
          BACK: "uebersicht",
          SUBMIT: transitions.onSubmit,
        },
      },
      kinder: {
        initial: "name",
        states: {
          name: {
            on: {
              BACK: "#kinder.uebersicht",
              SUBMIT: "wohnort",
            },
          },
          wohnort: {
            on: {
              BACK: "name",
              SUBMIT: [
                {
                  guard: kinderGuards.kindWohnortBeiAntragstellerYes,
                  target: "kind-eigene-einnahmen-frage",
                },
                {
                  guard: kinderGuards.kindWohnortBeiAntragstellerNo,
                  target: "kind-unterhalt-frage",
                },
              ],
            },
          },
          "kind-eigene-einnahmen-frage": {
            on: {
              BACK: "wohnort",
              SUBMIT: [
                {
                  guard: kinderGuards.kindEigeneEinnahmenYes,
                  target: "kind-eigene-einnahmen",
                },
                "#kinder.uebersicht",
              ],
            },
          },
          "kind-eigene-einnahmen": {
            on: {
              BACK: "kind-eigene-einnahmen-frage",
              SUBMIT: "#kinder.uebersicht",
            },
          },
          "kind-unterhalt-frage": {
            on: {
              BACK: "wohnort",
              SUBMIT: [
                {
                  guard: kinderGuards.kindUnterhaltYes,
                  target: "kind-unterhalt",
                },
                {
                  guard: kinderGuards.kindUnterhaltNo,
                  target: "kind-unterhalt-ende",
                },
              ],
            },
          },
          "kind-unterhalt": {
            on: {
              BACK: "kind-unterhalt-frage",
              SUBMIT: "#kinder.uebersicht",
            },
          },
          "kind-unterhalt-ende": {
            on: {
              BACK: "kind-unterhalt-frage",
              SUBMIT: "#kinder.uebersicht",
            },
          },
        },
      },
    },
  };
}
