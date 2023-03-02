import type { FunctionComponent } from "react";
import type { ZodObject } from "zod";

import { SozialleistungStep } from "./steps/hasSozialleistungen";
import { ExitRechtschutzversicherungStep } from "./steps/exitRechtschutzversicherung";
import { WelcomeStep } from "./steps/welcome";
import { RechtSchutzVersicherungStep } from "./steps/hasRechtschutzversicherung";
import { KlageEingereichtStep } from "./steps/hasKlageEingereicht";
import { ExitKlageEingereicht } from "./steps/exitKlageEingereicht";
import { ExitHamburgOrBremen } from "./steps/exitHamburgOrBremen";
import { ExitBeratungshilfeBeantragt } from "./steps/exitBeratungshilfeBeantragt";
import { HamburgOderBremenStep } from "./steps/isHamburgOderBremen";
import { BeratungshilfeBeantragtStep } from "./steps/hasBeratungshilfeBeantragt";

export const Steps = {
  SozialleistungStep,
  ExitRechtschutzversicherungStep,
  WelcomeStep,
  RechtSchutzVersicherungStep,
  KlageEingereichtStep,
  ExitKlageEingereicht,
  ExitHamburgOrBremen,
  ExitBeratungshilfeBeantragt,
  HamburgOderBremenStep,
  BeratungshilfeBeantragtStep,
};

export interface StepInterface {
  component: FunctionComponent<any>;
  schema?: ZodObject<any>;
}
