import {
  ANGELEGENHEIT_INFO,
  type AngelegenheitInfo,
} from "~/services/gerichtsfinder/types";

export const getCourtCategory = (
  sachgebiet?: string,
): AngelegenheitInfo => {
  switch (sachgebiet) {
    case "urheberrecht":
      return ANGELEGENHEIT_INFO.URHEBERRECHT;
    // for nachlasssachen related
    default:
      return ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE;
  }
};
