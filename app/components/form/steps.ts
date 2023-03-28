import type { FunctionComponent } from "react";
import type { AnyZodObject } from "zod";

import { sozialleistungStep } from "./steps/hasSozialleistungen";
import { exitRechtsschutzversicherungStep } from "./steps/exitRechtsschutzversicherung";
import { rechtsschutzversicherungStep } from "./steps/rechtsschutzversicherung";
import { klageEingereichtStep } from "./steps/klageEingereicht";
import { exitKlageEingereicht } from "./steps/exitKlageEingereicht";
import { exitHamburgOrBremen } from "./steps/exitHamburgOrBremen";
import { exitBeratungshilfeBeantragt } from "./steps/exitBeratungshilfeBeantragt";
import { hamburgOderBremenStep } from "./steps/isHamburgOderBremen";
import { beratungshilfeBeantragtStep } from "./steps/hasBeratungshilfeBeantragt";
import { wurdeVerklagtStep } from "./steps/wurdeVerklagt";
import { vermoegenStep } from "./steps/vermoegen";
import { successLeistungStep } from "./steps/success";
import { exitVermoegenStep } from "./steps/exitVermoegen";
import { exitVermoegenUnknownStep } from "./steps/exitVermoegenUnknown";
import { familienstandStep } from "./steps/familienstand";
import { successBuergergeldStep } from "./steps/successBürgergeld";
import { kidsCountStep } from "./steps/kidCount";
import { erwaerbstaetigStep } from "./steps/isErwaerbstaetig";
import { einkommenPartnerStep } from "./steps/einkommenPartnerschaft";
import { einkommenSingleStep } from "./steps/einkommenSingle";
import { exitFreibetrag } from "./steps/exitFreibetrag";
import { successFreibetrag } from "./steps/successFreibetrag";
import { selfHelpStep } from "./steps/selfhelp";
import { selfHelpWarning } from "./steps/selfhelpWarning";
import { freeServicesWarning } from "./steps/freeServicesWarning";
import { freeServicesStep } from "./steps/freeServices";
import { kidsStep } from "./steps/hasKids";
import { unterhaltStep } from "./steps/unterhalt";
import { unterhaltAmountStep } from "./steps/unterhaltAmount";
import type { ElementContent } from "~/services/cms/getPageConfig";

export const Steps = {
  sozialleistungStep,
  exitRechtsschutzversicherungStep,
  rechtsschutzversicherungStep,
  klageEingereichtStep,
  exitKlageEingereicht,
  exitHamburgOrBremen,
  exitBeratungshilfeBeantragt,
  hamburgOderBremenStep,
  beratungshilfeBeantragtStep,
  wurdeVerklagtStep,
  vermoegenStep,
  successLeistungStep,
  exitVermoegenStep,
  exitVermoegenUnknownStep,
  familienstandStep,
  successBuergergeldStep,
  kidsCountStep,
  erwaerbstaetigStep,
  einkommenPartnerStep,
  einkommenSingleStep,
  exitFreibetrag,
  successFreibetrag,
  selfHelpStep,
  selfHelpWarning,
  freeServicesStep,
  freeServicesWarning,
  kidsStep,
  unterhaltStep,
  unterhaltAmountStep,
} as const;

interface StepComponent {
  component: FunctionComponent<any>;
}
interface StepComponentWithSchema {
  component: FunctionComponent<any>;
  schema: AnyZodObject;
}

export type StepComponentProps = { content: ElementContent[] };

export type StepInterface = StepComponent | StepComponentWithSchema;

export function isStepComponentWithSchema(
  component: StepInterface
): component is StepComponentWithSchema {
  return "schema" in component;
}
