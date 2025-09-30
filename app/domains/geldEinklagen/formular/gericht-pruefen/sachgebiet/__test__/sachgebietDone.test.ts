import { sachgebietDone } from "../doneFunctions";

describe("sachgebietDone", () => {
  it("should return false if sachgebietAusgeschlossen is missing", () => {
    const actual = sachgebietDone({
      context: {
        besondere: "miete",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false if besondere is missing", () => {
    const actual = sachgebietDone({
      context: {
        sachgebietAusgeschlossen: "no",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return true if besondere is anderesRechtsproblem", () => {
    const actual = sachgebietDone({
      context: {
        sachgebietAusgeschlossen: "no",
        besondere: "anderesRechtsproblem",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return true if besondere is anderesRechtsproblem", () => {
    const actual = sachgebietDone({
      context: {
        sachgebietAusgeschlossen: "no",
        besondere: "schaden",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return false if besondere is urheberrecht", () => {
    const actual = sachgebietDone({
      context: {
        sachgebietAusgeschlossen: "no",
        besondere: "urheberrecht",
      },
    });

    expect(actual).toBe(false);
  });

  describe("besondere is miete", () => {
    it("should return false if mietePachtVertrag is missing", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "miete",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if mietePachtVertrag is no", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "miete",
          mietePachtVertrag: "no",
        },
      });

      expect(actual).toBe(true);
    });

    it("should return false if mietePachtVertrag is yes but mietePachtRaum is missing", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "miete",
          mietePachtVertrag: "yes",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if mietePachtVertrag is yes but mietePachtRaum is present", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
        },
      });

      expect(actual).toBe(true);
    });
  });

  describe("besondere is versicherung", () => {
    it("should return false if versicherungVertrag is missing", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "versicherung",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if versicherungVertrag is no", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "versicherung",
          versicherungVertrag: "no",
        },
      });

      expect(actual).toBe(true);
    });

    it("should return false if versicherungVertrag is yes but versicherungsnummer is missing", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "versicherung",
          versicherungVertrag: "yes",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if versicherungVertrag is yes but versicherungsnummer is present", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "versicherung",
          versicherungVertrag: "yes",
          versicherungsnummer: "no",
        },
      });

      expect(actual).toBe(true);
    });
  });

  describe("besondere is reisen", () => {
    it("should return false if reiseArt is missing", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "reisen",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if reiseArt is andereReise", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "reisen",
          reiseArt: "andereReise",
        },
      });

      expect(actual).toBe(true);
    });

    it("should return false if reiseArt is flug", () => {
      const actual = sachgebietDone({
        context: {
          sachgebietAusgeschlossen: "no",
          besondere: "reisen",
          reiseArt: "flug",
        },
      });

      expect(actual).toBe(false);
    });

    describe("besondere is verkehrsunfall", () => {
      it("should return false if verkehrsunfallStrassenverkehr is missing", () => {
        const actual = sachgebietDone({
          context: {
            sachgebietAusgeschlossen: "no",
            besondere: "verkehrsunfall",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true if verkehrsunfallStrassenverkehr is present", () => {
        const actual = sachgebietDone({
          context: {
            sachgebietAusgeschlossen: "no",
            besondere: "verkehrsunfall",
            verkehrsunfallStrassenverkehr: "yes",
          },
        });

        expect(actual).toBe(true);
      });
    });
  });
});
