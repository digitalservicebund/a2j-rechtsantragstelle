import {
  ausgabenDone,
  kinderDone,
  kraftfahrzeugDone,
  partnerBesondersAusgabenDone,
  partnerDone,
  partnerSupportDone,
  wohnungDone,
} from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/doneFunctions";
import { kraftfahrzeugWertInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { type ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";

const mockedCompleteKraftfahrzeug: NonNullable<
  ProzesskostenhilfeFinanzielleAngabenUserData["kraftfahrzeuge"]
>[0] = {
  hasArbeitsweg: "yes",
  wert: "over10000",
  eigentuemer: "myself",
  art: "kraftfahrzeug",
  marke: "Mercedes",
  kilometerstand: 200000,
  baujahr: "1990",
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
                geburtsdatum: undefined,
                wohnortBeiAntragsteller: "yes",
                eigeneEinnahmen: "yes",
                einnahmen: undefined,
              } as any,
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
                geburtsdatum: "01.11.2015",
                wohnortBeiAntragsteller: "yes",
                eigeneEinnahmen: "yes",
                einnahmen: "100",
              },
            ],
          },
        }),
      ).toBe(true);
    });
  });

  describe("kraftfahrzeugDone", () => {
    it("should return false if the kraftfahrzeug is missing any information and worth more than 10000", () => {
      [
        kraftfahrzeugWertInputSchema.enum.over10000,
        kraftfahrzeugWertInputSchema.enum.unsure,
      ].forEach((v) => {
        expect(
          kraftfahrzeugDone({
            ...mockedCompleteKraftfahrzeug,
            wert: v,
            hasArbeitsweg: undefined,
          }),
        ).toBe(false);
        expect(
          kraftfahrzeugDone({
            ...mockedCompleteKraftfahrzeug,
            wert: v,
            eigentuemer: undefined,
          }),
        ).toBe(false);
        expect(
          kraftfahrzeugDone({
            ...mockedCompleteKraftfahrzeug,
            wert: v,
            art: undefined,
          }),
        ).toBe(false);
        expect(
          kraftfahrzeugDone({
            ...mockedCompleteKraftfahrzeug,
            wert: v,
            marke: undefined,
          }),
        ).toBe(false);
        expect(
          kraftfahrzeugDone({
            ...mockedCompleteKraftfahrzeug,
            wert: v,
            kilometerstand: undefined,
          }),
        ).toBe(false);
        expect(
          kraftfahrzeugDone({
            ...mockedCompleteKraftfahrzeug,
            wert: v,
            baujahr: undefined,
          }),
        ).toBe(false);
      });
    });

    it("should return true if the kraftfahrzeug is worth less than 10000 and detailed car information is missing", () => {
      expect(
        kraftfahrzeugDone({
          ...mockedCompleteKraftfahrzeug,
          wert: "under10000",
          eigentuemer: undefined,
          art: undefined,
          marke: undefined,
          kilometerstand: undefined,
          baujahr: undefined,
        }),
      ).toBeTruthy();
    });

    it("should return false if the kraftfahrzeug is missing wert and arbeitsweg information", () => {
      expect(
        kraftfahrzeugDone({
          hasArbeitsweg: undefined,
          wert: undefined,
        }),
      ).toBe(false);
    });

    it("should return true if a kraftfahrzeug is complete", () => {
      expect(kraftfahrzeugDone(mockedCompleteKraftfahrzeug)).toBe(true);
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

  describe("wohnungDone", () => {
    it("should return false if the apartment size or number of rooms isn't given", () => {
      expect(
        wohnungDone({
          context: { apartmentSizeSqm: undefined },
        }),
      ).toBe(false);
      expect(
        wohnungDone({
          context: { numberOfRooms: undefined },
        }),
      ).toBe(false);
    });

    it("should return true if the applicant is a renter", () => {
      expect(
        wohnungDone({
          context: {
            apartmentSizeSqm: 55,
            numberOfRooms: 2,
            livingSituation: "alone",
            rentsApartment: "yes",
            garageParkplatz: "no",
            totalRent: "1000",
          },
        }),
      ).toBe(true);

      expect(
        wohnungDone({
          context: {
            apartmentSizeSqm: 55,
            numberOfRooms: 2,
            livingSituation: "withOthers",
            apartmentPersonCount: 2,
            rentsApartment: "yes",
            garageParkplatz: "no",
            totalRent: "1000",
            sharedRent: "500",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the renter doesn't enter the total rent or parkplatz info", () => {
      expect(
        wohnungDone({
          context: {
            apartmentSizeSqm: 55,
            numberOfRooms: 2,
            livingSituation: "alone",
            rentsApartment: "yes",
            garageParkplatz: "no",
          },
        }),
      ).toBe(false);

      expect(
        wohnungDone({
          context: {
            apartmentSizeSqm: 55,
            numberOfRooms: 2,
            livingSituation: "alone",
            rentsApartment: "yes",
            totalRent: "1000",
          },
        }),
      ).toBe(false);
    });

    it("should return true if the applicant is an owner", () => {
      expect(
        wohnungDone({
          context: {
            apartmentSizeSqm: 55,
            numberOfRooms: 2,
            livingSituation: "alone",
            rentsApartment: "no",
            utilitiesCostOwned: "100",
            heatingCostsOwned: "120",
          },
        }),
      ).toBe(true);
    });

    it("should return false if the shared owner doesn't enter the shared utilities costs", () => {
      expect(
        wohnungDone({
          context: {
            apartmentSizeSqm: 55,
            numberOfRooms: 2,
            livingSituation: "withOthers",
            rentsApartment: "no",
            utilitiesCostOwned: "100",
            heatingCostsOwned: "120",
            utilitiesCostOwnShared: undefined,
          },
        }),
      ).toBe(false);
    });
  });

  describe("ausgabenDone", () => {
    it("returns true without ausgabe", () => {
      expect(
        ausgabenDone({
          context: { hasAusgaben: "no", besondereBelastungen: { none: "on" } },
        }),
      ).toBe(true);
    });

    describe("needs any valid ausgabe", () => {
      type Ausgaben = "sonstigeAusgaben" | "ratenzahlungen" | "versicherungen";

      const zahlung = {
        art: "art",
        zahlungsempfaenger: "Someone",
        zahlungspflichtiger: "myself",
        betragGesamt: "50",
      } as const;

      const ausgabenItems = {
        sonstigeAusgaben: zahlung,
        ratenzahlungen: {
          ...zahlung,
          restschuld: "100",
          laufzeitende: "01.01.2026",
        },
        versicherungen: {
          beitrag: "100",
          art: "sonstige",
          sonstigeArt: "beschreibung",
        },
      } as const satisfies {
        [K in Ausgaben]: NonNullable<
          ProzesskostenhilfeFinanzielleAngabenUserData[K]
        >[0];
      };

      Object.entries(ausgabenItems).forEach(([key, item]) => {
        it(`returns true with valid ${key}`, () => {
          expect(
            ausgabenDone({
              context: {
                hasAusgaben: "yes",
                besondereBelastungen: { none: "on" },
                [key]: [item],
              },
            }),
          ).toBe(true);
        });
      });
    });
  });
});
