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
import { kinderAnzahlStep } from "./steps/kinderAnzahl";
import { erwerbstaetigkeitStep } from "./steps/erwerbstaetigkeit";
import { einkommenFamilieStep } from "./steps/einkommenFamilie";
import { einkommenSingleStep } from "./steps/einkommenSingle";
import { exitFreibetrag } from "./steps/exitFreibetrag";
import { successFreibetrag } from "./steps/successFreibetrag";
import { eigeninitiativeStep } from "./steps/eigeninitiative";
import { kostenfreieBeratungStep } from "./steps/kostenfreieBeratung";
import { kinderStep } from "./steps/kinder";
import { unterhaltStep } from "./steps/unterhalt";
import { unterhaltSummeStep } from "./steps/unterhaltSumme";
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
  kinderAnzahlStep,
  erwerbstaetigkeitStep,
  einkommenFamilieStep,
  einkommenSingleStep,
  exitFreibetrag,
  successFreibetrag,
  eigeninitiativeStep,
  kostenfreieBeratungStep,
  kinderStep,
  unterhaltStep,
  unterhaltSummeStep,
  emptyStep,
} as const;

export type StepComponentProps = { content: ElementContent[] };
export type FormComponent = FunctionComponent<StepComponentProps>;

interface StepComponent {
  component: FormComponent;
}
interface StepComponentWithSchema {
  component: FormComponent;
  schema: AnyZodObject;
}

export type StepInterface = StepComponent | StepComponentWithSchema;
