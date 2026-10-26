import type { Flow } from "~/domains/flows.server";
import { getAbgabeStrings } from "~/domains/prozesskostenhilfe/formular/abgabe/stringReplacements";
import { getAntragstellendePersonStrings } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/stringReplacements";
import { getVereinfachteErklaerungStrings } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/stringReplacements";
import {
  getKinderStrings,
  getArrayIndexStrings,
  geldAnlagenStrings,
} from "~/domains/shared/formular/stringReplacements";
import { getGrundvoraussetzungenStringReplacements } from "./grundvoraussetzungen/stringReplacements";
import { belegeStrings } from "./stringReplacements";
import { type ProzesskostenhilfeFormularUserData } from "./userData";
import trackNotDoneStateAbgabeUeberpruefung from "../services/trackNotDoneStateAbgabeUeberpruefung";
import { prozesskostenhilfeFormularFlowConfig } from "./flowConfig";
import { prozesskostenhilfePdfFromUserdata } from "../services/pdf";
import { type Translations } from "~/services/translations/getTranslationByKey";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";

export const prozesskostenhilfeFormular = {
  flowType: "formFlow",
  config: prozesskostenhilfeFormularFlowConfig,
  stringReplacements: (context: ProzesskostenhilfeFormularUserData) => ({
    ...getKinderStrings(context),
    ...getArrayIndexStrings(context),
    ...getAntragstellendePersonStrings(context),
    ...getVereinfachteErklaerungStrings(context),
    ...geldAnlagenStrings(context),
    ...getAbgabeStrings(context),
    ...belegeStrings(context),
    ...getGrundvoraussetzungenStringReplacements(context),
  }),
  metaConfiguration: {
    "/abgabe": { excludedFromValidation: true },
    "/abgabe/ueberpruefung": { triggerValidation: true },
  },
  posFlowActions: {
    "/weitere-angaben": trackNotDoneStateAbgabeUeberpruefung,
  },
  pdfConfig: {
    pdfFunction: async (
      userData: ProzesskostenhilfeFormularUserData,
      translations?: Translations,
    ) => await prozesskostenhilfePdfFromUserdata(userData, translations),
    name: `Erklaerung_Prozesskostenhilfe`,
  },
} satisfies Flow<PageConfigMap>;
