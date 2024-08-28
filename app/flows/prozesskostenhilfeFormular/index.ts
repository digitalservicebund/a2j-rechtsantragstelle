import _ from "lodash";
import type { BasicTypes } from "~/flows/contexts";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import { einkuenfteDone } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import { finanzielleAngabeEinkuenfteGuards } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/guards";
import abgabeFlow from "./abgabe/flow.json";
import { prozesskostenhilfeAbgabeGuards } from "./abgabe/guards";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "./finanzielleAngaben/context";
import {
  andereUnterhaltszahlungenDone,
  eigentumDone,
  eigentumZusammenfassungDone,
  kinderDone,
  partnerDone,
} from "./finanzielleAngaben/doneFunctions";
import einkuenfteFlow from "./finanzielleAngaben/einkuenfte/flow.json";
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

/**
 * If an entered sum is paid or received quarterly, yearly or one-time, the amount is divided appropriately and displayed per month
 * @param financialEntries
 * @returns
 */
const addMonthlyAmounts = (financialEntries: Record<string, BasicTypes>[]) => {
  return financialEntries.map((financialEntry) => {
    const paymentFrequency = financialEntry["zahlungsfrequenz"];
    const amount = parseInt(financialEntry["betrag"] as string);
    switch (paymentFrequency) {
      case "yearly":
      case "one-time":
        return _.merge(financialEntry, {
          proMonat: `${Math.ceil(amount / 12)}€`,
        });
      case "quarterly":
        return _.merge(financialEntry, {
          proMonat: `${Math.ceil(amount / 3)}€`,
        });
      default:
        return financialEntry;
    }
  });
};

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
          arrayDataModifier: addMonthlyAmounts,
        },
        weitereEinkuenfte: {
          url: "/prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/einkunft",
          initialInputUrl: "daten",
          statementUrl:
            "/prozesskostenhilfe/formular/finanzielle-angaben/einkuenfte/weitere-einkuenfte/uebersicht",
          statementKey: "showAlways",
          event: "add-einkunft",
          arrayDataModifier: addMonthlyAmounts,
        },
      },
    },
    states: {
      start: { meta: { done: () => true } },
      "finanzielle-angaben": _.merge(finanzielleAngabenFlow, {
        states: {
          einkuenfte: _.merge(einkuenfteFlow, {
            meta: { done: einkuenfteDone },
          }),
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
    ...finanzielleAngabeEinkuenfteGuards,
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
  ProzesskostenhilfeFinanzielleAngabenContext &
    ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext &
    AbgabeContext;
