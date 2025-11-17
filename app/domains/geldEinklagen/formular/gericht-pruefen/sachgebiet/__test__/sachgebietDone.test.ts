import { sachgebietDone } from "../doneFunctions";

describe("sachgebietDone", () => {
  it("should return false if ausgeschlossen is missing", () => {
    const actual = sachgebietDone({
      context: {
        sachgebiet: "miete",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return false if sachgebiet is missing", () => {
    const actual = sachgebietDone({
      context: {
        ausgeschlossen: "no",
      },
    });

    expect(actual).toBe(false);
  });

  it("should return true if sachgebiet is anderesRechtsproblem", () => {
    const actual = sachgebietDone({
      context: {
        ausgeschlossen: "no",
        sachgebiet: "anderesRechtsproblem",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return true if sachgebiet is schaden", () => {
    const actual = sachgebietDone({
      context: {
        ausgeschlossen: "no",
        sachgebiet: "schaden",
      },
    });

    expect(actual).toBe(true);
  });

  it("should return true if sachgebiet is urheberrecht", () => {
    const actual = sachgebietDone({
      context: {
        ausgeschlossen: "no",
        sachgebiet: "urheberrecht",
      },
    });

    expect(actual).toBe(true);
  });

  describe("sachgebiet is miete", () => {
    it("should return false if mietePachtVertrag is missing", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "miete",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if mietePachtVertrag is no", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "miete",
          mietePachtVertrag: "no",
        },
      });

      expect(actual).toBe(true);
    });

    it("should return false if mietePachtVertrag is yes but mietePachtRaum is missing", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if mietePachtVertrag is yes but mietePachtRaum is present", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "no",
        },
      });

      expect(actual).toBe(true);
    });
  });

  describe("sachgebiet is versicherung", () => {
    it("should return false if versicherungVertrag is missing", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "versicherung",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if versicherungVertrag is no", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "versicherung",
          versicherungVertrag: "no",
        },
      });

      expect(actual).toBe(true);
    });

    it("should return false if versicherungVertrag is yes but versicherungsnehmer is missing", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "versicherung",
          versicherungVertrag: "yes",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if versicherungVertrag is yes but versicherungsnehmer is present", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "versicherung",
          versicherungVertrag: "yes",
          versicherungsnehmer: "no",
        },
      });

      expect(actual).toBe(true);
    });
  });

  describe("sachgebiet is reisen", () => {
    it("should return false if reiseArt is missing", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "reisen",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true if reiseArt is andereReise", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "reisen",
          reiseArt: "andereReise",
        },
      });

      expect(actual).toBe(true);
    });

    it("should return false if reiseArt is flug", () => {
      const actual = sachgebietDone({
        context: {
          ausgeschlossen: "no",
          sachgebiet: "reisen",
          reiseArt: "flug",
        },
      });

      expect(actual).toBe(false);
    });

    describe("sachgebiet is verkehrsunfall", () => {
      it("should return false if verkehrsunfallStrassenverkehr is missing", () => {
        const actual = sachgebietDone({
          context: {
            ausgeschlossen: "no",
            sachgebiet: "verkehrsunfall",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true if verkehrsunfallStrassenverkehr is present", () => {
        const actual = sachgebietDone({
          context: {
            ausgeschlossen: "no",
            sachgebiet: "verkehrsunfall",
            verkehrsunfallStrassenverkehr: "yes",
          },
        });

        expect(actual).toBe(true);
      });
    });
  });
});
