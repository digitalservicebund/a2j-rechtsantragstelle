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
  it("should return false when gegenWenBeklagen is missing", () => {
    const actual = beklagtePersonDone({
      context: {},
    });

    expect(actual).toBe(false);
  });

  describe("sachgebiet urheberrecht", () => {
    describe("gegenWenBeklagen person", () => {
      it("should return false when is missing beklagtePersonGeldVerdienen", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            gegenWenBeklagen: "person",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true when beklagtePersonGeldVerdienen is no", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            gegenWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when beklagtePersonGeldVerdienen is yes and klagendeKaufmann is no", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            gegenWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "yes",
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when beklagtePersonGeldVerdienen is yes and klagendeKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            gegenWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "yes",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when beklagtePersonGeldVerdienen and klagendeKaufmann are yes and beklagtePersonKaufmann is no", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            gegenWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "yes",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when beklagtePersonGeldVerdienen, klagendeKaufmann and beklagtePersonKaufmann are yes and missing gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            gegenWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "yes",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true when beklagtePersonGeldVerdienen, klagendeKaufmann and beklagtePersonKaufmann are yes and contains gerichtsstandsvereinbarung", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            gegenWenBeklagen: "person",
            beklagtePersonGeldVerdienen: "yes",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
            gerichtsstandsvereinbarung: "no",
          },
        });

        expect(actual).toBe(true);
      });
    });

    describe("gegenWenBeklagen organisation", () => {
      it("should return true when klagendeKaufmann is no", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            gegenWenBeklagen: "organisation",
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
            gegenWenBeklagen: "organisation",
            beklagtePersonGeldVerdienen: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is yes and beklagtePersonKaufmann is no ", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: "urheberrecht",
            gegenWenBeklagen: "organisation",
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
            gegenWenBeklagen: "organisation",
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
            gegenWenBeklagen: "organisation",
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
            gegenWenBeklagen: "organisation",
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
            gegenWenBeklagen: "organisation",
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
    it("should return true when mietePachtRaum and mietePachtVertrag are yes with gegenWenBeklagen", () => {
      const actual = beklagtePersonDone({
        context: {
          sachgebiet: "miete",
          gegenWenBeklagen: "person",
          mietePachtVertrag: "yes",
          mietePachtRaum: "yes",
        },
      });

      expect(actual).toBe(true);
    });

    it("should return true when mietePachtVertrag is no", () => {
      const actual = beklagtePersonDone({
        context: {
          sachgebiet: "miete",
          gegenWenBeklagen: "person",
          mietePachtVertrag: "no",
        },
      });

      expect(actual).toBe(true);
    });

    describe("mietePachtRaum is no", () => {
      const baseContextMietePachtRaumNo = {
        sachgebiet: "miete" as const,
        gegenWenBeklagen: "person" as const,
        mietePachtVertrag: "yes" as const,
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

      it("should return true when verbraucher is yes", () => {
        const actual = beklagtePersonDone({
          context: {
            ...baseContextMietePachtRaumNo,
            klagendeVerbraucher: "yes",
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
  });

  for (const sachgebiet of sachgebiete) {
    describe(`sachgebiet ${sachgebiet}`, () => {
      it("should return true when klagendeKaufmann is no", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            gegenWenBeklagen: "person",
            klagendeKaufmann: "no",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true when klagendeKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            gegenWenBeklagen: "person",
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false when klagendeKaufmann is yes and beklagtePersonKaufmann is undefined", () => {
        const actual = beklagtePersonDone({
          context: {
            sachgebiet: sachgebiet,
            gegenWenBeklagen: "person",
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
            gegenWenBeklagen: "person",
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
            gegenWenBeklagen: "person",
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
            gegenWenBeklagen: "person",
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
            gegenWenBeklagen: "person",
            klagendeKaufmann: "yes",
            beklagtePersonKaufmann: "yes",
          },
        });

        expect(actual).toBe(false);
      });
    });
  }
});
