import {
  latestPfaendungsfreibetraegeYear,
  getPfaendungsfreibetraege,
  pfaendungsbeitraegePerYear,
} from "~/domains/kontopfaendung/wegweiser/pfaendungsfreibetraege";

vi.spyOn(console, "warn");

describe("getPfaendungsfreibetraege", () => {
  it(`returns Pfaendungsfreibetraege for ${latestPfaendungsfreibetraegeYear}`, () => {
    expect(getPfaendungsfreibetraege(latestPfaendungsfreibetraegeYear)).toEqual(
      pfaendungsbeitraegePerYear[latestPfaendungsfreibetraegeYear],
    );
  });

  it("returns Pfaendungsfreibetraege for the last valid year if current year is not found, and shows the user a warning", () => {
    const nonExistentYear = latestPfaendungsfreibetraegeYear + 1;
    const freibetraege = getPfaendungsfreibetraege(nonExistentYear);
    // oxlint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledWith(
      `No Pfändungsfreibeträge for year ${nonExistentYear}, using last valid Pfändungsfreibeträge from ${latestPfaendungsfreibetraegeYear}`,
    );
    expect(freibetraege).toEqual(
      pfaendungsbeitraegePerYear[latestPfaendungsfreibetraegeYear],
    );
  });
});
