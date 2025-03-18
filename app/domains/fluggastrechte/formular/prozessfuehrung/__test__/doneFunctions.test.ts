import { prozessfuehrungDone } from "../doneFunctions";

describe("prozessfuehrungDone", () => {
  it("should return true, if all the prozessfuehrung has been full filled", () => {
    const actual = prozessfuehrungDone({
      context: {
        hasZeugen: "yes",
        versaeumnisurteil: "yes",
        videoverhandlung: "yes",
      },
    });

    expect(actual).toBe(true);
  });
  it("should return true if videoverhandlung was answered with noSpecification", () => {
    const actual = prozessfuehrungDone({
      context: {
        hasZeugen: "yes",
        versaeumnisurteil: "yes",
        videoverhandlung: "noSpecification",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return false, if versaeumnisurteil is missing", () => {
    const actual = prozessfuehrungDone({
      context: {
        hasZeugen: "yes",
        videoverhandlung: "yes",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if videoverhandlung is missing", () => {
    const actual = prozessfuehrungDone({
      context: {
        hasZeugen: "yes",
        versaeumnisurteil: "yes",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false when hasZeugen is missing", () => {
    const actual = prozessfuehrungDone({
      context: {
        videoverhandlung: "no",
        versaeumnisurteil: "no",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if all context is missing", () => {
    const actual = prozessfuehrungDone({ context: {} });

    expect(actual).toBe(false);
  });
});
