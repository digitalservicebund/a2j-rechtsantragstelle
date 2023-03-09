import type { FunctionComponent } from "react";
import type { ZodObject } from "zod";

import { sozialleistungStep } from "./steps/hasSozialleistungen";
import { exitRechtschutzversicherungStep } from "./steps/exitRechtschutzversicherung";
import { welcomeStep } from "./steps/welcome";
import { rechtSchutzVersicherungStep } from "./steps/hasRechtschutzversicherung";
import { klageEingereichtStep } from "./steps/hasKlageEingereicht";
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

export const Steps = {
  sozialleistungStep,
  exitRechtschutzversicherungStep,
  welcomeStep,
  rechtSchutzVersicherungStep,
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
};

export interface StepInterface {
  component: FunctionComponent<any>;
  schema?: ZodObject<any>;
}
