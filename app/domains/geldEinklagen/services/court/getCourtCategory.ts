import { type GeldEinklagenSachgebietType } from "~/domains/geldEinklagen/formular/userData";
import {
  ANGELEGENHEIT_INFO,
  type AngelegenheitInfo,
} from "~/services/gerichtsfinder/types";

const courtCategoryMapping: Partial<
  Record<GeldEinklagenSachgebietType, AngelegenheitInfo>
> = {
  urheberrecht: ANGELEGENHEIT_INFO.URHEBERRECHT,
};

export const getCourtCategory = (
  sachgebiet?: GeldEinklagenSachgebietType,
): AngelegenheitInfo =>
  (sachgebiet && courtCategoryMapping[sachgebiet]) ||
  ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE;
