import type { StepInterface } from "~/components/form/steps";
import { Steps } from "~/components/form/steps";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";

// NOTE: This will get replaced by xstate machine definition
export const _formDefinition = {
  welcome: {
    step: Steps.WelcomeStep,
    next: "hasRechtschutzversicherung",
  },
  hasRechtschutzversicherung: {
    step: Steps.RechtSchutzVersicherungStep,
    back: "welcome",
    next: (formData: FormData) => {
      return formData.get("hasRechtschutzversicherung")
        ? "exitRechtschutzversicherung" // TODO: could point directly to step
        : "hasKlageEingereicht";
    },
  },
  exitRechtschutzversicherung: {
    back: "hasRechtschutzversicherung",
    step: Steps.ExitRechtschutzversicherungStep,
  },
  hasKlageEingereicht: {
    back: "hasRechtschutzversicherung",
    step: Steps.KlageEingereichtStep,
    next: (formData: FormData) => {
      return formData.get("hasKlageEingereicht")
        ? "exitKlageEingereicht"
        : "isHamburgOderBremen";
    },
  },
  exitKlageEingereicht: {
    back: "hasKlageEingereicht",
    step: Steps.ExitKlageEingereicht,
  },
  isHamburgOderBremen: {
    back: "hasKlageEingereicht",
    step: Steps.HamburgOderBremenStep,
    next: (formData: FormData) => {
      return formData.get("isHamburgOderBremen")
        ? "exitHamburgOrBremen"
        : "hasBeratungshilfeBeantragt";
    },
  },
  exitHamburgOrBremen: {
    back: "isHamburgOderBremen",
    step: Steps.ExitHamburgOrBremen,
  },
  hasBeratungshilfeBeantragt: {
    back: "isHamburgOderBremen",
    step: Steps.BeratungshilfeBeantragtStep,
    next: (formData: FormData) => {
      return formData.get("hasBeratungshilfeBeantragt")
        ? "exitBeratungshilfeBeantragt"
        : "hasSozialleistungen";
    },
  },
  exitBeratungshilfeBeantragt: {
    back: "hasBeratungshilfeBeantragt",
    step: Steps.ExitBeratungshilfeBeantragt,
  },
  hasSozialleistungen: {
    back: "hasBeratungshilfeBeantragt",
    step: Steps.SozialleistungStep,
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
