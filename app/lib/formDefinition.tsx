import type { StepInterface } from "~/components/form/steps";
import { Steps } from "~/components/form/steps";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { YesNoAnswer } from "~/components/form/answers";

// NOTE: This will get replaced by xstate machine definition
export const _formDefinition = {
  welcome: {
    step: Steps.welcomeStep,
    next: "hasRechtschutzversicherung",
  },
  hasRechtschutzversicherung: {
    step: Steps.rechtSchutzVersicherungStep,
    back: "welcome",
    next: (formData: FormData) => {
      return formData.get("hasRechtschutzversicherung") === YesNoAnswer.Enum.yes
        ? "exitRechtschutzversicherung" // TODO: could point directly to step
        : "hasKlageEingereicht";
    },
  },
  exitRechtschutzversicherung: {
    back: "hasRechtschutzversicherung",
    step: Steps.exitRechtschutzversicherungStep,
  },
  hasKlageEingereicht: {
    back: "hasRechtschutzversicherung",
    step: Steps.klageEingereichtStep,
    next: (formData: FormData) => {
      return formData.get("hasKlageEingereicht") === YesNoAnswer.Enum.yes
        ? "exitKlageEingereicht"
        : "isHamburgOderBremen";
    },
  },
  exitKlageEingereicht: {
    back: "hasKlageEingereicht",
    step: Steps.exitKlageEingereicht,
  },
  isHamburgOderBremen: {
    back: "hasKlageEingereicht",
    step: Steps.hamburgOderBremenStep,
    next: (formData: FormData) => {
      return formData.get("isHamburgOderBremen") === YesNoAnswer.Enum.yes
        ? "exitHamburgOrBremen"
        : "hasBeratungshilfeBeantragt";
    },
  },
  exitHamburgOrBremen: {
    back: "isHamburgOderBremen",
    step: Steps.exitHamburgOrBremen,
  },
  hasBeratungshilfeBeantragt: {
    back: "isHamburgOderBremen",
    step: Steps.beratungshilfeBeantragtStep,
    next: (formData: FormData) => {
      return formData.get("hasBeratungshilfeBeantragt") === YesNoAnswer.Enum.yes
        ? "exitBeratungshilfeBeantragt"
        : "hasSozialleistungen";
    },
  },
  exitBeratungshilfeBeantragt: {
    back: "hasBeratungshilfeBeantragt",
    step: Steps.exitBeratungshilfeBeantragt,
  },
  hasSozialleistungen: {
    back: "hasBeratungshilfeBeantragt",
    step: Steps.sozialleistungStep,
  },
};

export type AllowedIDs = keyof typeof _formDefinition;
export type NullableIDs = AllowedIDs | null;
export const initial: AllowedIDs = "welcome";
export type StepDecision = (context: FormData) => NullableIDs;

interface StepDefinition {
  step: StepInterface;
  next: NullableIDs | StepDecision;
  back: NullableIDs;
}
type FormDefinition = Record<AllowedIDs, StepDefinition>;
export const formDefinition = _formDefinition as FormDefinition;

export const allValidators = Object.fromEntries(
  Object.entries(formDefinition).map(([key, value]) => [
    key,
    value.step.schema ? withZod(value.step.schema) : withZod(z.object({})),
  ])
);
