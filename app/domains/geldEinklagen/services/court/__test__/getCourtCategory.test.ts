import { getCourtCategory } from "~/domains/geldEinklagen/services/court/getCourtCategory";
import { ANGELEGENHEIT_INFO } from "~/services/gerichtsfinder/types";

describe("getCourtCategory", () => {
  it("should return URHEBERRECHT for urheberrecht sachgebiet", () => {
    const result = getCourtCategory("urheberrecht");
    expect(result).toBe(ANGELEGENHEIT_INFO.URHEBERRECHT);
  });

  it("should return PROZESSKOSTENHILFE for other sachgebiete", () => {
    const result = getCourtCategory("miete");
    expect(result).toBe(ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE);
  });

  it("should return PROZESSKOSTENHILFE when sachgebiet is undefined", () => {
    const result = getCourtCategory(undefined);
    expect(result).toBe(ANGELEGENHEIT_INFO.PROZESSKOSTENHILFE);
  });
});
