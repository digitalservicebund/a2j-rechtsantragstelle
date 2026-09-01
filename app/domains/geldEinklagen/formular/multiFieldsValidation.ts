import { type MultiFieldsStepIdValidation } from "~/domains/types";
import { validatePersonenAuswahl } from "../services/validation/validatePersonenAuswahl";
import { geldEinklagenKlageErstellenPages } from "./klage-erstellen/pages";

const _schema =
  geldEinklagenKlageErstellenPages
    .begruendungBeschreibungAbschnitteBeweisPersonAuswahl.pageSchema;

export const geldEinklagenMultiFieldsValidation: MultiFieldsStepIdValidation<
  typeof _schema
> = {
  "/klage-erstellen/begruendung/beschreibung/abschnitte/#/personen/#/auswahl":
    validatePersonenAuswahl,
};
