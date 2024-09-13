import { reasonsToDisplayBeratungshilfe } from "app/flows/beratungshilfeVorabcheck";
import { guards } from "~/flows/beratungshilfeVorabcheck/guards";

describe("reasonsToDisplayBeratungshilfe", () => {
  it("returns false if no data given", () => {
    const result = reasonsToDisplayBeratungshilfe({});
    expect(result).toEqual({
      eigeninitiativeWarning: false,
      incomeTooHigh: false,
    });
  });

  it("returns eigeninitiative true if eigeninitiative no", () => {
    const result = reasonsToDisplayBeratungshilfe({
      eigeninitiative: "no",
    });
    expect(result).toEqual({
      eigeninitiativeWarning: true,
      incomeTooHigh: false,
    });
  });

  it("returns incomeTooHigh true if short path and verfuegbaresEinkommen yes", () => {
    const result = reasonsToDisplayBeratungshilfe({
      genauigkeit: "no",
      verfuegbaresEinkommen: "yes",
    });
    expect(result).toEqual({
      eigeninitiativeWarning: false,
      incomeTooHigh: true,
    });
  });

  it("returns incomeTooHigh false if short path and verfuegbaresEinkommen no", () => {
    const result = reasonsToDisplayBeratungshilfe({
      genauigkeit: "no",
      verfuegbaresEinkommen: "no",
    });
    expect(result).toEqual({
      eigeninitiativeWarning: false,
      incomeTooHigh: false,
    });
  });

  it("returns incomeTooHigh true if long path and isIncomeTooHigh true", () => {
    vi.spyOn(guards, "isIncomeTooHigh").mockReturnValue(true);
    const result = reasonsToDisplayBeratungshilfe({
      genauigkeit: "yes",
    });
    expect(result).toEqual({
      eigeninitiativeWarning: false,
      incomeTooHigh: true,
    });
  });

  it("returns incomeTooHigh false if long path and isIncomeTooHigh false", () => {
    vi.spyOn(guards, "isIncomeTooHigh").mockReturnValue(false);
    const result = reasonsToDisplayBeratungshilfe({
      genauigkeit: "yes",
    });
    expect(result).toEqual({
      eigeninitiativeWarning: false,
      incomeTooHigh: false,
    });
  });
});
