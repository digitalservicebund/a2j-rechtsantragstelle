import type { z } from "zod";
import type { prozesskostenhilfeFinanzielleAngabenContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/context";
import {
  hasRatenzahlungDone,
  hasSonstigeAusgabeDone,
  hasVersicherungDone,
  kinderDone,
  partnerBesondersAusgabenDone,
  partnerDone,
  partnerSupportDone,
  ratenzahlungDone,
  sonstigeAusgabeDone,
  versicherungDone,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/doneFunctions";

const mockedCompleteRatenzahlung: Partial<
  z.infer<typeof prozesskostenhilfeFinanzielleAngabenContext.ratenzahlungen>
>[0] = {
  art: "art",
  zahlungsempfaenger: "Someone",
  zahlungspflichtiger: "myself",
  betragGesamt: "50",
  restschuld: "100",
  laufzeitende: "01.01.2026",
};

const mockedCompleteSonstigeAusgabe: Partial<
  z.infer<typeof prozesskostenhilfeFinanzielleAngabenContext.sonstigeAusgaben>
>[0] = {
  art: "art",
  zahlungsempfaenger: "Someone",
  zahlungspflichtiger: "myself",
  betragGesamt: "50",
};

describe("Finanzielle Angaben doneFunctions", () => {
  describe("partnerDone", () => {
    it("should return true if the user receives grundsicherung or asylbewerberleistungen", () => {
      let done = partnerDone({
        context: { staatlicheLeistungen: "grundsicherung" },
      });
      expect(done).toBe(true);
      done = partnerDone({
        context: { staatlicheLeistungen: "asylbewerberleistungen" },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user doesn't have a partnerschaft", () => {
      let done = partnerDone({
        context: { partnerschaft: "no" },
      });
      expect(done).toBe(true);
      done = partnerDone({
        context: { partnerschaft: "widowed" },
      });
      expect(done).toBe(true);
      done = partnerDone({
        context: { partnerschaft: "separated" },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user's partner receives grundsicherung or asylbewerberleistungen", () => {
      let done = partnerDone({
        context: { "partner-staatlicheLeistungen": "grundsicherung" },
      });
      expect(done).toBe(true);
      done = partnerDone({
        context: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
      });
      expect(done).toBe(true);
    });
  });

  describe("partnerBesondersAusgabenDone", () => {
    it("should return true if the user has no besonders Ausgaben", () => {
      expect(
        partnerBesondersAusgabenDone({
          context: { partnerHasBesondersAusgaben: "no" },
        }),
      ).toBe(true);
    });

    it("should return false if the user has indicated besonders Ausgaben but hasn't entered anything", () => {
      expect(
        partnerBesondersAusgabenDone({
          context: { partnerHasBesondersAusgaben: "yes" },
        }),
      ).toBe(false);
    });

    it("should return true if the user has filled out besonders ausgaben", () => {
      expect(
        partnerBesondersAusgabenDone({
          context: {
            partnerHasBesondersAusgaben: "yes",
            partnerBesondersAusgabe: {
              beschreibung: "hello world",
              betrag: "100",
            },
          },
        }),
      ).toBe(true);
    });
  });

  describe("kinderDone", () => {
    it("should return true if the user receives staatliche leistungen", () => {
      expect(
        kinderDone({
          context: { staatlicheLeistungen: "grundsicherung" },
        }),
      ).toBe(true);
      expect(
        kinderDone({
          context: { staatlicheLeistungen: "asylbewerberleistungen" },
        }),
      ).toBe(true);
    });

    it("should return true if the user has no children", () => {
      expect(
        kinderDone({
          context: { hasKinder: "no" },
        }),
      ).toBe(true);
    });

    it("should return false if the user has incomplete children entered", () => {
      expect(
        kinderDone({
          context: { hasKinder: "yes" },
        }),
      ).toBe(false);
      expect(
        kinderDone({
          context: {
            hasKinder: "yes",
            kinder: [
              {
                vorname: "Kinder",
                nachname: "McKindery",
                geburtsdatum: "",
                wohnortBeiAntragsteller: "yes",
                eigeneEinnahmen: "yes",
                einnahmen: "",
                unterhalt: "yes",
                unterhaltsSumme: "",
              },
            ],
          },
        }),
      ).toBe(false);
    });

    it("should return true if the user a fully-entered child", () => {
      expect(
        kinderDone({
          context: {
            hasKinder: "yes",
            kinder: [
              {
                vorname: "Kinder",
                nachname: "McKindery",
                geburtsdatum: "2000-01-01",
                wohnortBeiAntragsteller: "yes",
                eigeneEinnahmen: "yes",
                einnahmen: "100",
                unterhalt: "yes",
                unterhaltsSumme: "100",
              },
            ],
          },
        }),
      ).toBe(true);
    });
  });

  describe("versicherungDone", () => {
    it("should return false if the user has indicated a sonstige versicherung but hasn't named it", () => {
      expect(versicherungDone({ beitrag: "100", art: "sonstige" })).toBe(false);
    });

    it("should return true for a completed versicherung entry", () => {
      expect(
        versicherungDone({ beitrag: "100", art: "unfallversicherung" }),
      ).toBe(true);
      expect(
        versicherungDone({
          beitrag: "100",
          art: "sonstige",
          sonstigeArt: "beschreibung",
        }),
      ).toBe(true);
    });
  });

  describe("hasVersicherungDone", () => {
    it("should return false if the versicherungen array is empty", () => {
      expect(hasVersicherungDone({ context: { versicherungen: [] } })).toBe(
        false,
      );
    });

    it("should return false if the versicherungen array contains an incomplete entry", () => {
      expect(
        hasVersicherungDone({
          context: {
            versicherungen: [
              {
                art: "sonstige",
                beitrag: "100",
              },
            ],
          },
        }),
      ).toBe(false);
    });

    it("should return true if the versicherungen array contains only complete entries", () => {
      expect(
        hasVersicherungDone({
          context: {
            versicherungen: [
              {
                art: "unfallversicherung",
                beitrag: "100",
              },
              {
                art: "sonstige",
                sonstigeArt: "beschreibung",
                beitrag: "100",
              },
            ],
          },
        }),
      ).toBe(true);
    });
  });

  describe("ratenzahlungDone", () => {
    it("should return false if the user has entered an incomplete ratenzahlung", () => {
      expect(ratenzahlungDone(undefined)).toBe(false);
      expect(
        ratenzahlungDone({
          ...mockedCompleteRatenzahlung,
          zahlungspflichtiger: "myselfAndPartner",
        }),
      ).toBe(false);
    });

    it("should return true for a completed ratenzahlung entry", () => {
      expect(ratenzahlungDone(mockedCompleteRatenzahlung)).toBe(true);
      expect(
        ratenzahlungDone({
          ...mockedCompleteRatenzahlung,
          zahlungspflichtiger: "myselfAndPartner",
          betragEigenerAnteil: "50",
          betragGesamt: "100",
        }),
      ).toBe(true);
    });
  });

  describe("hasRatenzahlungDone", () => {
    it("should return false if the ratenzahlungen array is empty", () => {
      expect(hasRatenzahlungDone({ context: { ratenzahlungen: [] } })).toBe(
        false,
      );
    });

    it("should return false if the ratenzahlungen array contains an incomplete entry", () => {
      expect(
        hasRatenzahlungDone({
          context: {
            ratenzahlungen: [],
          },
        }),
      ).toBe(false);
      expect(
        hasRatenzahlungDone({
          context: {
            ratenzahlungen: [
              {
                ...mockedCompleteRatenzahlung,
                zahlungspflichtiger: "myselfAndSomeoneElse",
              },
            ],
          },
        }),
      ).toBe(false);
    });

    it("should return true if the ratenzahlungen array contains only complete entries", () => {
      expect(
        hasRatenzahlungDone({
          context: {
            ratenzahlungen: [mockedCompleteRatenzahlung],
          },
        }),
      ).toBe(true);
    });
  });

  describe("sonstigeAusgabeDone", () => {
    it("should return false if the user has entered an incomplete sonstige ausgabe", () => {
      expect(sonstigeAusgabeDone(undefined)).toBe(false);
      expect(
        sonstigeAusgabeDone({
          ...mockedCompleteSonstigeAusgabe,
          zahlungspflichtiger: "myselfAndPartner",
        }),
      ).toBe(false);
    });

    it("should return true for a completed sonstige ausgabe entry", () => {
      expect(sonstigeAusgabeDone(mockedCompleteSonstigeAusgabe)).toBe(true);
      expect(
        sonstigeAusgabeDone({
          ...mockedCompleteSonstigeAusgabe,
          zahlungspflichtiger: "myselfAndPartner",
          betragEigenerAnteil: "50",
        }),
      ).toBe(true);
    });
  });

  describe("hasSonstigeAusgabeDone", () => {
    it("should return false if the sonstigeAusgaben array is empty", () => {
      expect(
        hasSonstigeAusgabeDone({ context: { sonstigeAusgaben: [] } }),
      ).toBe(false);
    });

    it("should return false if the sonstigeAusgaben array contains an incomplete entry", () => {
      expect(
        hasSonstigeAusgabeDone({
          context: {
            sonstigeAusgaben: [],
          },
        }),
      ).toBe(false);
      expect(
        hasSonstigeAusgabeDone({
          context: {
            sonstigeAusgaben: [
              {
                ...mockedCompleteSonstigeAusgabe,
                zahlungspflichtiger: "myselfAndSomeoneElse",
              },
            ],
          },
        }),
      ).toBe(false);
    });

    it("should return true if the sonstigeAusgaben array contains only complete entries", () => {
      expect(
        hasSonstigeAusgabeDone({
          context: {
            sonstigeAusgaben: [mockedCompleteSonstigeAusgabe],
          },
        }),
      ).toBe(true);
    });
  });

  describe("partnerSupportDone", () => {
    it("should return false if the user hasn't stated yes or no", () => {
      const done = partnerSupportDone({
        context: { "partner-receivesSupport": undefined },
      });
      expect(done).toBe(false);
    });

    it("should return false if the user stated yes but hasn't entered the amount", () => {
      const done = partnerSupportDone({
        context: { "partner-receivesSupport": "yes" },
      });
      expect(done).toBe(false);
    });

    it("should return true if the user's partner doesn't receive a pension", () => {
      const done = partnerSupportDone({
        context: { "partner-receivesSupport": "no" },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user's partner receives a pension and has entered the amount", () => {
      const done = partnerSupportDone({
        context: {
          "partner-receivesSupport": "no",
          "partner-supportAmount": "100",
        },
      });
      expect(done).toBe(true);
    });
  });
});
