import { geldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { validateZahlungsklageReferenzzeichen } from "~/domains/geldEinklagen/anwaltschaft/services/validation/validateZahlungsklageReferenzzeichen";
import { type MultiFieldsStepIdValidation } from "~/domains/types";
import { hauptUndNebenantraegePages } from "./hauptUndNebenantraege/pages";
import { validateHauptantragZins } from "./services/validation/validateHauptantragZins";
import { validateNebenantragZins } from "./services/validation/validateNebenantragZins";
import { validateSchmerzgeldNebenantragZins } from "./services/validation/validateSchmerzgeldNebenantragZins";

const _schema = Object.assign(
  {},
  ...Object.values(geldEinklagenAnwaltschaftPages)
    .filter((page) => "pageSchema" in page)
    .map(({ pageSchema }) => pageSchema),
  ...Object.values(hauptUndNebenantraegePages)
    .filter((page) => "pageSchema" in page)
    .map(({ pageSchema }) => pageSchema),
);

export const geldEinklagenAnwaltschaftMultiFieldsValidation: MultiFieldsStepIdValidation<
  typeof _schema
> = {
  "/inhalt-klage": validateZahlungsklageReferenzzeichen(),
  "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/hauptantrag/#/daten":
    validateHauptantragZins(),
  "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/#/nebenantraege/#/daten":
    validateNebenantragZins(),
  "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/#/nebenantraege/#/daten":
    validateSchmerzgeldNebenantragZins(),
};
