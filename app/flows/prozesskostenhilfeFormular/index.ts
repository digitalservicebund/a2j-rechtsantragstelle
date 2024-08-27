import _ from "lodash";
import type { BasicTypes } from "~/flows/contexts";
import abgabeFlow from "./abgabe/flow.json";
import { prozesskostenhilfeAbgabeGuards } from "./abgabe/guards";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import {
  andereUnterhaltszahlungenDone,
  eigentumDone,
  eigentumZusammenfassungDone,
  einkuenfteDone,
  kinderDone,
  partnerDone,
} from "./finanzielleAngaben/doneFunctions";
import finanzielleAngabenFlow from "./finanzielleAngaben/flow.json";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";
import prozesskostenhilfeFormularFlow from "./flow.json";
import { getMissingInformationStrings } from "./stringReplacements";
import type { AbgabeContext } from "../shared/abgabe/context";
import { finanzielleAngabenArrayConfig } from "../shared/finanzielleAngaben/arrayConfiguration";
import {
  eigentumZusammenfassungShowWarnings,
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../shared/stringReplacements";

export const prozesskostenhilfeFormular = {
  cmsSlug: "form-flow-pages",
  config: _.merge(prozesskostenhilfeFormularFlow, {
    meta: {
      arrays: {
        ...finanzielleAngabenArrayConfig(
          "/prozesskostenhilfe/formular/finanzielle-angaben",
        ),
        arbeitsausgaben: {
          url: "/prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/arbeitsausgabe",
          initialInputUrl: "daten",
          statementUrl:
            "/prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/abzuege/arbeitsausgaben/uebersicht",
          statementKey: "showAlways",
          event: "add-arbeitsausgaben",
          // If the sum entered is paid quarterly, yearly or one-time, the amount is divided appropriately and displayed
          arrayDataModifier: (
            arbeitsausgaben: Record<string, BasicTypes>[],
          ) => {
            return arbeitsausgaben.map((arbeitsausgabe) => {
              const paymentFrequency = arbeitsausgabe["zahlungsfrequenz"];
              const amount = parseInt(arbeitsausgabe["betrag"] as string);
              switch (paymentFrequency) {
                case "yearly":
                case "one-time":
                  return _.merge(arbeitsausgabe, {
                    proMonat: `${Math.ceil(amount / 12)}€`,
                  });
                case "quarterly":
                  return _.merge(arbeitsausgabe, {
                    proMonat: `${Math.ceil(amount / 3)}€`,
                  });
                default:
                  return arbeitsausgabe;
              }
            });
          },
        },
      },
    },
    states: {
      start: { meta: { done: () => true } },
      "finanzielle-angaben": _.merge(finanzielleAngabenFlow, {
        states: {
          einkuenfte: { meta: { done: einkuenfteDone } },
          partner: { meta: { done: partnerDone } },
          kinder: { meta: { done: kinderDone } },
          "andere-unterhaltszahlungen": {
            meta: { done: andereUnterhaltszahlungenDone },
          },
          eigentum: { meta: { done: eigentumDone } },
          "eigentum-zusammenfassung": {
            meta: { done: eigentumZusammenfassungDone },
          },
        },
      }),
      abgabe: _.merge(abgabeFlow, {
        meta: { done: () => false },
      }),
    },
  }),
  guards: {
    ...finanzielleAngabeGuards,
    ...prozesskostenhilfeAbgabeGuards,
  },
  stringReplacements: (context: ProzesskostenhilfeFormularContext) => ({
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...eigentumZusammenfassungShowWarnings(context),
    ...geldAnlagenStrings(context),
    ...getMissingInformationStrings(context),
  }),
} as const;

export type ProzesskostenhilfeFormularContext =
  ProzesskostenhilfeFinanzielleAngabenContext & AbgabeContext;
