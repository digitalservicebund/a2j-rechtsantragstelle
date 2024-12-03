import { prozessfuehrungDone } from "../doneFunctions";

describe("prozessfuehrungDone", () => {
  it("should return true, if all the prozessfuehrung has been full filled", () => {
    const actual = prozessfuehrungDone({
      context: {
        versaeumnisurteil: "yes",
        videoverhandlung: "yes",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return false, if versaeumnisurteil is missing", () => {
    const actual = prozessfuehrungDone({
      context: {
        videoverhandlung: "yes",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if videoverhandlung is missing", () => {
    const actual = prozessfuehrungDone({
      context: {
        versaeumnisurteil: "yes",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false, if all context is missing", () => {
    const actual = prozessfuehrungDone({ context: {} });

    expect(actual).toBe(false);
  });
});
