import type { Context } from "~/flows/contexts";
import type { GenericGuard} from "~/flows/guards.server";
import { kinderDone } from "../doneFunctions";
import { finanzielleAngabeGuards as guards } from "../guards";

export function getkinderXstateConfig<T extends Context>(transitions: {
    onBack: (string | { guard: GenericGuard<T>; target: string })[] 
    onSubmit: string
  }) {
        return { id: "kinder",
        initial: "kinder-frage",
        meta: { done: kinderDone },
        states: {
          "kinder-frage": {
            on: {
              BACK: transitions.onBack,
              SUBMIT: [
                {
                  guard: guards.hasKinderYes,
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
                  guard: guards.hasKinderYesAndEmptyArray,
                  target: "warnung",
                },
                transitions.onSubmit,
              ],
              "add-kinder": {
                guard: guards.isValidKinderArrayIndex,
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
                      guard: guards.kindWohnortBeiAntragstellerYes,
                      target: "kind-eigene-einnahmen-frage",
                    },
                    {
                      guard: guards.kindWohnortBeiAntragstellerNo,
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
                      guard: guards.kindEigeneEinnahmenYes,
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
                      guard: guards.kindUnterhaltYes,
                      target: "kind-unterhalt",
                    },
                    {
                      guard: guards.kindUnterhaltNo,
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
    }
}