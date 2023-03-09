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
};

export interface StepInterface {
  component: FunctionComponent<any>;
  schema?: ZodObject<any>;
}
