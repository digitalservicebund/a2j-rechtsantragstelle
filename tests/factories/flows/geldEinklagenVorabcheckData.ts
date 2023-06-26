import { Factory } from "fishery";
import type { GeldEinklagenVorabcheckContext } from "~/models/flows/geldEinklagen/pages";

export const kontaktaufnahmeYesDataFactory =
  Factory.define<GeldEinklagenVorabcheckContext>(() => {
    return { kontaktaufnahme: "yes" };
  });

export const kontaktaufnahmeNoDataFactory =
  kontaktaufnahmeYesDataFactory.params({ kontaktaufnahme: "no" });

export const fristYesDataFactory =
  Factory.define<GeldEinklagenVorabcheckContext>(() => {
    return {
      ...kontaktaufnahmeYesDataFactory.build(),
      fristAbgelaufen: "yes",
    };
  });

export const fristNotSetDataFactory = fristYesDataFactory.params({
  fristAbgelaufen: "yes",
});

export const fristNoDataFactory = fristYesDataFactory.params({
  fristAbgelaufen: "no",
});

export const verjaehrtNoDataFactory =
  Factory.define<GeldEinklagenVorabcheckContext>(() => {
    return {
      ...fristNotSetDataFactory.build(),
      verjaehrt: "no",
    };
  });

export const verjaehrtYesDataFactory = verjaehrtNoDataFactory.params({
  verjaehrt: "yes",
});

export const beweiseYesDataFactory =
  Factory.define<GeldEinklagenVorabcheckContext>(() => {
    return {
      ...verjaehrtNoDataFactory.build(),
      beweise: "yes",
    };
  });

export const happyPathDataFactory =
  Factory.define<GeldEinklagenVorabcheckContext>(() => {
    return {
      ...beweiseYesDataFactory.build(),
      gerichtsentscheidung: "no",
      verfahrenBegonnen: "no",
      privatperson: "yes",
      wohnsitzDeutschland: "yes",
      forderung: "lessOrEqual5000",
      bereich: "shopping",
      gegenseite: "privatperson",
      gegenseitePersonDeutschland: "yes",
    };
  });

export const beweiseNoDataFactory = beweiseYesDataFactory.params({
  beweise: "no",
});
