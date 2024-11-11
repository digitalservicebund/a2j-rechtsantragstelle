import { streitwertKostenDone } from "../doneFunctions";

describe("streitwertKostenDone", () => {
  it("should return true, if all the streitwert kosten has been full filled", () => {
    const actual = streitwertKostenDone({
      context: {
        prozesszinsen: "yes",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return false, if all context is missing", () => {
    const actual = streitwertKostenDone({ context: {} });

    expect(actual).toBe(false);
  });
});
