import type { FunctionComponent } from "react";
import type { AnyZodObject } from "zod";

import { staatlicheLeistungenStep } from "./steps/staatlicheLeistungen";
import { exitRechtsschutzversicherungStep } from "./steps/exitRechtsschutzversicherung";
import { rechtsschutzversicherungStep } from "./steps/rechtsschutzversicherung";
import { klageEingereichtStep } from "./steps/klageEingereicht";
import { exitKlageEingereicht } from "./steps/exitKlageEingereicht";
import { hamburgOderBremenStep } from "./steps/hamburgOderBremen";
import { beratungshilfeBeantragtStep } from "./steps/beratungshilfeBeantragt";
import { wurdeVerklagtStep } from "./steps/wurdeVerklagt";
import { vermoegenStep } from "./steps/vermoegen";
import { exitVermoegenUnknownStep } from "./steps/exitVermoegenUnknown";
import { familienstandStep } from "./steps/familienstand";
import { successBuergergeldStep } from "./steps/successBürgergeld";
import { kidsCountStep } from "./steps/kidCount";
import { erwerbstaetigkeitStep } from "./steps/erwerbstaetigkeit";
import { einkommenPartnerStep } from "./steps/einkommenPartnerschaft";
import { einkommenSingleStep } from "./steps/einkommenSingle";
import { exitFreibetrag } from "./steps/exitFreibetrag";
import { successFreibetrag } from "./steps/successFreibetrag";
import { eigeninitiativeStep } from "./steps/eigeninitiative";
import { kostenfreieBeratungStep } from "./steps/kostenfreieBeratung";
import { kinderStep } from "./steps/kinder";
import { unterhaltStep } from "./steps/unterhalt";
import { unterhaltAmountStep } from "./steps/unterhaltAmount";
import type { ElementContent } from "~/services/cms/getPageConfig";
import { emptyStep } from "~/components/form/steps/emptyStep";

export const Steps = {
  staatlicheLeistungenStep,
  exitRechtsschutzversicherungStep,
  rechtsschutzversicherungStep,
  klageEingereichtStep,
  exitKlageEingereicht,
  hamburgOderBremenStep,
  beratungshilfeBeantragtStep,
  wurdeVerklagtStep,
  vermoegenStep,
  exitVermoegenUnknownStep,
  familienstandStep,
  successBuergergeldStep,
  kidsCountStep,
  erwerbstaetigkeitStep,
  einkommenPartnerStep,
  einkommenSingleStep,
  exitFreibetrag,
  successFreibetrag,
  eigeninitiativeStep,
  kostenfreieBeratungStep,
  kinderStep,
  unterhaltStep,
  unterhaltAmountStep,
  emptyStep,
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
