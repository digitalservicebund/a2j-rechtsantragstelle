import { geldEinklagenAnwaltschaftPages } from "~/domains/geldEinklagen/anwaltschaft/pages";
import { validateZahlungsklageReferenzzeichen } from "~/domains/geldEinklagen/anwaltschaft/services/validation/validateZahlungsklageReferenzzeichen";
import { type MultiFieldsStepIdValidation } from "~/domains/types";

const _schema = Object.assign(
  {},
  ...Object.values(geldEinklagenAnwaltschaftPages)
    .filter((page) => "pageSchema" in page)
    .map(({ pageSchema }) => pageSchema),
);
export const geldEinklagenAnwaltschaftMultiFieldsValidation: MultiFieldsStepIdValidation<
  typeof _schema
> = {
  "/inhalt-klage": validateZahlungsklageReferenzzeichen(),
};
