import type { Flow } from "~/domains/flows.server";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { getAbgabeStrings } from "~/domains/prozesskostenhilfe/formular/abgabe/stringReplacements";
import { getAntragstellendePersonStrings } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/stringReplacements";
import { getVereinfachteErklaerungStrings } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/stringReplacements";
import { prozesskostenhilfeFormularPages } from "~/domains/prozesskostenhilfe/formular/pages";
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
import { PageConfigMap } from "~/services/flow/newFlowEngine/types";

const steps = xStateTargetsFromPagesConfig(prozesskostenhilfeFormularPages);

export const prozesskostenhilfeFormular = {
  flowType: "formFlow",
  config: {states: {}},
  newEngineConfig: prozesskostenhilfeFormularFlowConfig,
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
  asyncFlowActions: {
    "/weitere-angaben": trackNotDoneStateAbgabeUeberpruefung,
  },
} satisfies Flow<PageConfigMap>;
