import { klagendePersonDone } from "../doneFunctions";

describe("klagendePersonDone", () => {
  it("should return false given undefined fuerWenKlagen", () => {
    const actual = klagendePersonDone({
      context: {},
    });

    expect(actual).toBe(false);
  });

  describe("case for verkehrsunfall", () => {
    it("should return false given undefined klagendeKaufmann", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "verkehrsunfall",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true given a value for klagendeKaufmann", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "verkehrsunfall",
          klagendeKaufmann: "no",
        },
      });

      expect(actual).toBe(true);
    });
  });

  describe("case for schaden", () => {
    it("should return false given undefined klagendeKaufmann", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "schaden",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true given a value for klagendeKaufmann", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "schaden",
          klagendeKaufmann: "no",
        },
      });

      expect(actual).toBe(true);
    });
  });

  describe("case for miete", () => {
    it("should return true given mietePachtVertrag yes and mietePachtRaum yes", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "miete",
          mietePachtVertrag: "yes",
          mietePachtRaum: "yes",
        },
      });

      expect(actual).toBe(true);
    });

    describe("klagendeVerbraucher is no", () => {
      it("should return false given undefined klagendeKaufmann when mietePachtVertrag is no", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "miete",
            klagendeVerbraucher: "no",
            mietePachtVertrag: "no",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return false given undefined klagendeKaufmann when mietePachtVertrag is yes and mietePachtRaum is no", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "miete",
            klagendeVerbraucher: "no",
            mietePachtVertrag: "yes",
            mietePachtRaum: "no",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true given value to klagendeKaufmann when mietePachtVertrag is yes", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "miete",
            klagendeVerbraucher: "no",
            mietePachtVertrag: "yes",
            mietePachtRaum: "no",
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });
    });

    describe("klagendeVerbraucher is yes", () => {
      it("should return false given undefined klagendeHaustuergeschaeft when mietePachtVertrag is yes and mietePachtRaum is no", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "miete",
            klagendeVerbraucher: "yes",
            mietePachtVertrag: "yes",
            mietePachtRaum: "no",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true given value klagendeHaustuergeschaeft when mietePachtVertrag is yes and mietePachtRaum is no", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "miete",
            klagendeVerbraucher: "yes",
            mietePachtVertrag: "yes",
            mietePachtRaum: "no",
            klagendeHaustuergeschaeft: "no",
          },
        });

        expect(actual).toBe(true);
      });
    });
  });

  describe("case for versicherung", () => {
    it("should return false given undefined klagendeKaufmann", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "versicherung",
        },
      });

      expect(actual).toBe(false);
    });

    it("should return true given a value for klagendeKaufmann", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "versicherung",
          klagendeKaufmann: "no",
        },
      });

      expect(actual).toBe(true);
    });
  });

  describe("case for reisen", () => {
    it("should return false given an undefined klagendeVerbraucher", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "reisen",
        },
      });

      expect(actual).toBe(false);
    });

    describe("klagendeVerbraucher is no", () => {
      it("should return false given undefined klagendeKaufmann", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "reisen",
            klagendeVerbraucher: "no",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true given value for klagendeKaufmann", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "reisen",
            klagendeVerbraucher: "no",
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });
    });

    describe("klagendeVerbraucher is yes", () => {
      it("should return true given klagendeVertrag no", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "reisen",
            klagendeVerbraucher: "yes",
            klagendeVertrag: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false given klagendeHaustuergeschaeft undefined when klagendeVertrag is yes", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "reisen",
            klagendeVerbraucher: "yes",
            klagendeVertrag: "yes",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return false given value for klagendeHaustuergeschaeft when klagendeVertrag is yes", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "reisen",
            klagendeVerbraucher: "yes",
            klagendeVertrag: "yes",
            klagendeHaustuergeschaeft: "no",
          },
        });

        expect(actual).toBe(true);
      });
    });
  });

  describe("case for anderesRechtsproblem", () => {
    it("should return false given an undefined klagendeVerbraucher", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "anderesRechtsproblem",
        },
      });

      expect(actual).toBe(false);
    });

    describe("klagendeVerbraucher is no", () => {
      it("should return false given undefined klagendeKaufmann", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "anderesRechtsproblem",
            klagendeVerbraucher: "no",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true given value for klagendeKaufmann", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "anderesRechtsproblem",
            klagendeVerbraucher: "no",
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });
    });

    describe("klagendeVerbraucher is yes", () => {
      it("should return true given klagendeVertrag no", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "anderesRechtsproblem",
            klagendeVerbraucher: "yes",
            klagendeVertrag: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false given klagendeHaustuergeschaeft undefined when klagendeVertrag is yes", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "anderesRechtsproblem",
            klagendeVerbraucher: "yes",
            klagendeVertrag: "yes",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return false given value for klagendeHaustuergeschaeft when klagendeVertrag is yes", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "anderesRechtsproblem",
            klagendeVerbraucher: "yes",
            klagendeVertrag: "yes",
            klagendeHaustuergeschaeft: "no",
          },
        });

        expect(actual).toBe(true);
      });
    });
  });

  describe("case for urheberrecht", () => {
    it("should return false given an undefined klagendeVerbraucher", () => {
      const actual = klagendePersonDone({
        context: {
          fuerWenKlagen: "selbst",
          sachgebiet: "urheberrecht",
        },
      });

      expect(actual).toBe(false);
    });

    describe("klagendeVerbraucher is no", () => {
      it("should return false given undefined klagendeKaufmann", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "urheberrecht",
            klagendeVerbraucher: "no",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true given value for klagendeKaufmann", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "urheberrecht",
            klagendeVerbraucher: "no",
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });
    });

    describe("klagendeVerbraucher is yes", () => {
      it("should return true given klagendeVertrag no", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "urheberrecht",
            klagendeVerbraucher: "yes",
            klagendeVertrag: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false given klagendeHaustuergeschaeft undefined when klagendeVertrag is yes", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "urheberrecht",
            klagendeVerbraucher: "yes",
            klagendeVertrag: "yes",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return false given value for klagendeHaustuergeschaeft when klagendeVertrag is yes", () => {
        const actual = klagendePersonDone({
          context: {
            fuerWenKlagen: "selbst",
            sachgebiet: "urheberrecht",
            klagendeVerbraucher: "yes",
            klagendeVertrag: "yes",
            klagendeHaustuergeschaeft: "no",
          },
        });

        expect(actual).toBe(true);
      });
    });
  });
});
