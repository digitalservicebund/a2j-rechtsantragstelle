import type { FunctionComponent } from "react";
import type { AnyZodObject } from "zod";

import { staatlicheLeistungenStep } from "./steps/staatlicheLeistungen";
import { rechtsschutzversicherungStep } from "./steps/rechtsschutzversicherung";
import { klageEingereichtStep } from "./steps/klageEingereicht";
import { hamburgOderBremenStep } from "./steps/hamburgOderBremen";
import { beratungshilfeBeantragtStep } from "./steps/beratungshilfeBeantragt";
import { wurdeVerklagtStep } from "./steps/wurdeVerklagt";
import { vermoegenStep } from "./steps/vermoegen";
import { partnerschaftStep } from "./steps/partnerschaft";
import { kinderAnzahlStep } from "./steps/kinderAnzahl";
import { erwerbstaetigkeitStep } from "./steps/erwerbstaetigkeit";
import { einkommenStep } from "./steps/einkommen";
import { eigeninitiativeStep } from "./steps/eigeninitiative";
import { kostenfreieBeratungStep } from "./steps/kostenfreieBeratung";
import { kinderStep } from "./steps/kinder";
import { unterhaltStep } from "./steps/unterhalt";
import { unterhaltSummeStep } from "./steps/unterhaltSumme";
import { emptyStep } from "~/components/form/steps/emptyStep";
import { mieteStep } from "./steps/miete";
import { weitereZahlungenStep } from "./steps/weitereZahlungen";
import { weitereZahlungenSummeStep } from "./steps/weitereZahlungenSumme";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { genauigkeitStep } from "~/components/form/steps/genauigkeit";
import { einkommenPartnerStep } from "~/components/form/steps/einkommenPartner";
import { einkommenKinderStep } from "~/components/form/steps/einkommenKinder";

export const Steps = {
  staatlicheLeistungenStep,
  rechtsschutzversicherungStep,
  klageEingereichtStep,
  hamburgOderBremenStep,
  beratungshilfeBeantragtStep,
  wurdeVerklagtStep,
  vermoegenStep,
  genauigkeitStep,
  partnerschaftStep,
  einkommenPartnerStep,
  kinderAnzahlStep,
  einkommenKinderStep,
  erwerbstaetigkeitStep,
  einkommenStep,
  eigeninitiativeStep,
  kostenfreieBeratungStep,
  kinderStep,
  unterhaltStep,
  unterhaltSummeStep,
  emptyStep,
  mieteStep,
  weitereZahlungenStep,
  weitereZahlungenSummeStep,
} as const;

export type StepComponentProps = {
  content: StrapiFormComponent[];
  additionalContext?: Record<string, string>;
  defaultValues?: Record<string, any>;
};
export type FormComponent = FunctionComponent<StepComponentProps>;

interface StepComponent {
  component: FormComponent;
}
interface StepComponentWithSchema {
  component: FormComponent;
  schema: AnyZodObject;
  additionalContext?: string[];
}

export type StepInterface = StepComponent | StepComponentWithSchema;
