import { streitwertKostenDone } from "../doneFunctions";

describe("streitwertKostenDone", () => {
  it("should return true, if all the streitwert kosten has been fullied", () => {
    const actual = streitwertKostenDone({
      context: {
        versaeumnisurteil: "yes",
        prozesszinsen: "yes",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return false, if versaeumnisurteil is missing", () => {
    const actual = streitwertKostenDone({
      context: {
        prozesszinsen: "yes",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if prozesszinsen is missing", () => {
    const actual = streitwertKostenDone({
      context: {
        versaeumnisurteil: "yes",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if all context is missing", () => {
    const actual = streitwertKostenDone({ context: {} });

    expect(actual).toBe(false);
  });
});
