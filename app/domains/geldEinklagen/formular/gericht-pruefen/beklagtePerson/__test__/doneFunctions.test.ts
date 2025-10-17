import { beklagtePersonDone } from "../doneFunctions";

const sachgebiete: Array<
  | "versicherung"
  | "reisen"
  | "anderesRechtsproblem"
  | "schaden"
  | "verkehrsunfall"
> = [
  "versicherung",
  "reisen",
  "anderesRechtsproblem",
  "schaden",
  "verkehrsunfall",
];

describe("beklagtePersonDone", () => {
  it("should return false when fuerWenBeklagen is missing", () => {
    const actual = beklagtePersonDone({
      context: {},
    });

    expect(actual).toBe(false);
  });

  describe("sachgebiet urheberrecht", () => {
    describe("fuerWenBeklagen person", () => {
      it("should return false when is missing beklagtePersonGeldVerdienen", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "person",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true when klagendeKaufmann is no", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is no ", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is unknown ", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "unknown",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes and beklagtePersonKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "person",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: undefined,
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true when klagendeKaufmann is yes, beklagtePersonKaufmann yes and has value for gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
            gerichtsstandsvereinbarung: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes, beklagtePersonKaufmann yes and missing gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
          },
        });

        expect(actual).toBe(false);
      });
    });

    describe("fuerWenBeklagen organisation", () => {
      it("should return true when klagendeKaufmann is no", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "organisation",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "organisation",
            beklagtePersonGeldVerdienen: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is no ", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "organisation",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is unknown ", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "organisation",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "unknown",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes and beklagtePersonKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "organisation",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: undefined,
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true when klagendeKaufmann is yes, beklagtePersonKaufmann yes and has value for gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "organisation",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
            gerichtsstandsvereinbarung: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes, beklagtePersonKaufmann yes and missing gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            fuerWenBeklagen: "organisation",
            beklagtePersonGeldVerdienen: "no",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
          },
        });

        expect(actual).toBe(false);
      });
    });
  });

  describe("sachgebiet miete", () => {
    it("should return true when mietePachtRaum is yes", () => {
      const actual = beklagtePersonDone({
        context: {
          sachgebiet: "miete",
          fuerWenBeklagen: "person",
          mietePachtRaum: "yes",
        },
      });

      expect(actual).toBe(true);
    });

    describe("mietePachtRaum is no", () => {
      const baseContextMietePachtRaumNo = {
        sachgebiet: "miete" as const,
        fuerWenBeklagen: "person" as const,
        mietePachtRaum: "no" as const,
      };

      it("should return true when klagendeKaufmann is no", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumNo,
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumNo,
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes and beklagtePersonKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumNo,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: undefined,
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is no ", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumNo,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is unknown ", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumNo,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "unknown",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes, beklagtePersonKaufmann yes and has value for gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumNo,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
            gerichtsstandsvereinbarung: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes, beklagtePersonKaufmann yes and missing gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumNo,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
          },
        });

        expect(actual).toBe(false);
      });
    });

    describe("mietePachtRaum is undefined", () => {
      const baseContextMietePachtRaumUndefined = {
        sachgebiet: "miete" as const,
        fuerWenBeklagen: "person" as const,
        mietePachtRaum: undefined,
      };

      it("should return true when klagendeKaufmann is no", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumUndefined,
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumUndefined,
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes and beklagtePersonKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumUndefined,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: undefined,
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is no ", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumUndefined,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is unknown ", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumUndefined,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "unknown",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes, beklagtePersonKaufmann yes and has value for gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumUndefined,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
            gerichtsstandsvereinbarung: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes, beklagtePersonKaufmann yes and missing gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumUndefined,
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
          },
        });

        expect(actual).toBe(false);
      });
    });
  });

  sachgebiete.forEach((sachgebiet) => {
    describe(`sachgebiet ${sachgebiet}`, () => {
      it("should return true when klagendeKaufmann is no", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            fuerWenBeklagen: "person",
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            fuerWenBeklagen: "person",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes and beklagtePersonKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            fuerWenBeklagen: "person",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: undefined,
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is no ", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            fuerWenBeklagen: "person",
            beklagtePersonKaufmann: "no",
            klagendeKaufmann: "yes",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is unknown ", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            fuerWenBeklagen: "person",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "unknown",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes, beklagtePersonKaufmann yes and has value for gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            fuerWenBeklagen: "person",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
            gerichtsstandsvereinbarung: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes, beklagtePersonKaufmann yes and missing gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            fuerWenBeklagen: "person",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
          },
        });

        expect(actual).toBe(false);
      });
    });
  });
});
