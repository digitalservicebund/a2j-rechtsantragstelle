import { type GeldEinklagenSachgebietType } from "~/domains/geldEinklagen/formular/userData";
import {
  ANGELEGENHEIT_INFO,
  type AngelegenheitInfo,
} from "~/services/gerichtsfinder/types";

export const getCourtCategory = (
  sachgebiet?: GeldEinklagenSachgebietType,
): AngelegenheitInfo =>
  sachgebiet === "urheberrecht"
    ? ANGELEGENHEIT_INFO.URHEBERRECHT
    : ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE;
