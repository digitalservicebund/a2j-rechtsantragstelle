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
import { partnerschaftStep } from "./steps/partnerschaft";
import { successBuergergeldStep } from "./steps/successBürgergeld";
import { kinderAnzahlStep } from "./steps/kinderAnzahl";
import { erwerbstaetigkeitStep } from "./steps/erwerbstaetigkeit";
import { einkommenStep } from "./steps/einkommen";
import { abschlussNoStep } from "./steps/abschlussNo";
import { abschlussYesStep } from "./steps/abschlussYes";
import { abschlussMaybeBeratungStep } from "./steps/abschlussMaybeBeratung";
import { abschlussMaybeSelfhelpStep } from "./steps/abschlussMaybeSelfhelp";
import { eigeninitiativeStep } from "./steps/eigeninitiative";
import { kostenfreieBeratungStep } from "./steps/kostenfreieBeratung";
import { kinderStep } from "./steps/kinder";
import { unterhaltStep } from "./steps/unterhalt";
import { unterhaltSummeStep } from "./steps/unterhaltSumme";
import { emptyStep } from "~/components/form/steps/emptyStep";
import { mieteStep } from "./steps/miete";
import { weitereZahlungenStep } from "./steps/weitereZahlungen";
import { weitereZahlungenSummeStep } from "./steps/weitereZahlungenSumme";
import type { FormComponentCMS } from "~/services/cms/models/formComponents";
import { genauigkeitStep } from "~/components/form/steps/genauigkeit";
import { einkommenPartnerStep } from "~/components/form/steps/einkommenPartner";
import { einkommenKinderStep } from "~/components/form/steps/einkommenKinder";

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
  genauigkeitStep,
  partnerschaftStep,
  einkommenPartnerStep,
  successBuergergeldStep,
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
  abschlussNoStep,
  abschlussYesStep,
  abschlussMaybeSelfhelpStep,
  abschlussMaybeBeratungStep,
} as const;

export type StepComponentProps = {
  content: FormComponentCMS[];
  additionalContext?: Record<string, string>;
};
export type FormComponent = FunctionComponent<StepComponentProps>;

interface StepComponent {
  component: FormComponent;
}
interface StepComponentWithSchema {
  component: FormComponent;
  schema: AnyZodObject;
}

export type StepInterface = StepComponent | StepComponentWithSchema;
