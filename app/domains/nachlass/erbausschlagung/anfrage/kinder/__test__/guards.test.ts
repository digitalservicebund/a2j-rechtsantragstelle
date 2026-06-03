import { type NachlassErbausschlagungAnfrageKind } from "~/domains/nachlass/services/pdf/sections/childrenOfRenunciantPerson/createChildrenOfRenunciantPerson";
import { isKinderUebersichtFilled } from "../guards";

describe("guards", () => {
  describe("isKinderUebersichtFilled", () => {
    it("should return false if numberOfKids is undefined", () => {
      const actual = isKinderUebersichtFilled({
        context: { numberOfKids: undefined, kinder: [] },
      });

      expect(actual).toBe(false);
    });

    it("should return false if kinder is undefined", () => {
      const actual = isKinderUebersichtFilled({
        context: { numberOfKids: 2, kinder: undefined },
      });

      expect(actual).toBe(false);
    });

    it("should return false if numberOfKids does not match kinder length", () => {
      const actual = isKinderUebersichtFilled({
        context: { numberOfKids: 2, kinder: [] },
      });

      expect(actual).toBe(false);
    });

    it("should return true if all required fields are filled for all kids", () => {
      const actual = isKinderUebersichtFilled({
        context: {
          numberOfKids: 2,
          kinder: [
            {
              vorname: "Max",
              nachname: "Mustermann",
              geburtsdatum: {
                day: "01",
                month: "01",
                year: "2000",
              },
              wohnortBeiAntragsteller: "yes",
            },
            {
              vorname: "Erika",
              nachname: "Mustermann",
              geburtsdatum: {
                day: "01",
                month: "01",
                year: "2000",
              },
              wohnortBeiAntragsteller: "no",
              strasse: "Musterstrasse",
              hausnummer: "1",
              plz: "12345",
              ort: "Musterstadt",
            },
          ],
        },
      });

      expect(actual).toBe(true);
    });

    describe("kid under 18 years old", () => {
      const mockKidData = {
        vorname: "Max",
        nachname: "Mustermann",
        geburtsdatum: {
          day: "01",
          month: "01",
          year: new Date().getFullYear() - 10 + "",
        },
        wohnortBeiAntragsteller: "yes",
      } satisfies NachlassErbausschlagungAnfrageKind;

      it("should return false if it is missing the optionSorgerecht", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: undefined,
              },
            ],
          },
        });

        expect(actual).toBe(false);
      });

      it("should return false if optionSorgerecht is yes and missing hasRenouncedInheritance", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "yes",
                hasRenouncedInheritance: undefined,
              },
            ],
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true if optionSorgerecht is yes and hasRenouncedInheritance is defined", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "yes",
                hasRenouncedInheritance: "yes",
              },
            ],
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true if optionSorgerecht is anotherPerson and has all custodian fields", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "anotherPerson",
                hasSorgerechtSameAddress: "yes",
                vornameSorgerecht: "Max",
                nachnameSorgerecht: "Mustermann",
              },
            ],
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false if optionSorgerecht is anotherPerson and missing custodian fields", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "anotherPerson",
                hasSorgerechtSameAddress: "yes",
                vornameSorgerecht: undefined,
                nachnameSorgerecht: undefined,
              },
            ],
          },
        });

        expect(actual).toBe(false);
      });

      it("should return false if optionSorgerecht is anotherPerson and missing custody address data", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "anotherPerson",
                hasSorgerechtSameAddress: "no",
                vornameSorgerecht: "Max",
                nachnameSorgerecht: "Mustermann",
              },
            ],
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true if optionSorgerecht is anotherPerson and has all custody address data", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "anotherPerson",
                hasSorgerechtSameAddress: "no",
                vornameSorgerecht: "Max",
                nachnameSorgerecht: "Mustermann",
                strasseSorgerecht: "Musterstrasse",
                hausnummerSorgerecht: "1",
                plzSorgerecht: "12345",
                ortSorgerecht: "Musterstadt",
              },
            ],
          },
        });

        expect(actual).toBe(true);
      });

      it("should return true if optionSorgerecht is shared and has all custodian fields", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "shared",
                hasSorgerechtSameAddress: "yes",
                vornameSorgerecht: "Max",
                nachnameSorgerecht: "Mustermann",
                hasRenouncedInheritance: "no",
              },
            ],
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false if optionSorgerecht is shared and missing custodian fields", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "shared",
                hasSorgerechtSameAddress: "yes",
                vornameSorgerecht: "Max",
                nachnameSorgerecht: "Mustermann",
                hasRenouncedInheritance: undefined,
              },
            ],
          },
        });

        expect(actual).toBe(false);
      });

      it("should return false if optionSorgerecht is shared and missing custody address data", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "shared",
                hasSorgerechtSameAddress: "no",
                vornameSorgerecht: "Max",
                nachnameSorgerecht: "Mustermann",
                hasRenouncedInheritance: "no",
              },
            ],
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true if optionSorgerecht is shared and has all custody address data", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "shared",
                hasSorgerechtSameAddress: "no",
                vornameSorgerecht: "Max",
                nachnameSorgerecht: "Mustermann",
                hasRenouncedInheritance: "no",
                strasseSorgerecht: "Musterstrasse",
                hausnummerSorgerecht: "1",
                plzSorgerecht: "12345",
                ortSorgerecht: "Musterstadt",
              },
            ],
          },
        });

        expect(actual).toBe(true);
      });

      it("should return false if optionSorgerecht is anotherOrganization and missing organization custody fields", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "anotherOrganization",
                organizationNameSorgerecht: undefined,
                organizationStrasseSorgerecht: undefined,
                organizationHausnummerSorgerecht: undefined,
                organizationPlzSorgerecht: undefined,
                organizationOrtSorgerecht: undefined,
              },
            ],
          },
        });

        expect(actual).toBe(false);
      });

      it("should return true if optionSorgerecht is anotherOrganization and has all organization custody fields", () => {
        const actual = isKinderUebersichtFilled({
          context: {
            numberOfKids: 1,
            kinder: [
              {
                ...mockKidData,
                optionSorgerecht: "anotherOrganization",
                organizationNameSorgerecht: "Musterfirma",
                organizationStrasseSorgerecht: "Musterstrasse",
                organizationHausnummerSorgerecht: "1",
                organizationPlzSorgerecht: "12345",
                organizationOrtSorgerecht: "Musterstadt",
              },
            ],
          },
        });

        expect(actual).toBe(true);
      });
    });
  });
});
