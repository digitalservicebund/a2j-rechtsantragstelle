import { type CheckboxValue } from "~/components/formElements/Checkbox";
import {
  partnerArbeitDone,
  partnerEinkommenDone,
  partnerEinkuenfteDone,
  partnerFurtherIncomeDone,
  partnerLeistungenDone,
  partnerPensionDone,
  partnerStaatlicheLeistungenDone,
} from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/doneFunctions";

describe("Partner Einkuenfte doneFunctions", () => {
  describe("partnerStaatlicheLeistungenDone", () => {
    it("should return true if the user receives Grundsicherung", () => {
      const done = partnerStaatlicheLeistungenDone({
        context: { "partner-staatlicheLeistungen": "grundsicherung" },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user receives Asylbewerberleistungen", () => {
      const done = partnerStaatlicheLeistungenDone({
        context: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
      });
      expect(done).toBe(true);
    });

    it("should return false if the user receives Buergergeld or Arbeitslosengeld and hasn't entered a value", () => {
      let done = partnerStaatlicheLeistungenDone({
        context: { "partner-staatlicheLeistungen": "buergergeld" },
      });
      expect(done).toBe(false);
      done = partnerStaatlicheLeistungenDone({
        context: { "partner-staatlicheLeistungen": "arbeitslosengeld" },
      });
      expect(done).toBe(false);
    });

    it("should return false if no value has been entered", () => {
      const done = partnerStaatlicheLeistungenDone({ context: {} });
      expect(done).toBe(false);
    });
  });

  describe("partnerEinkommenDone", () => {
    it("should return false if the user is employed and hasn't entered their income", () => {
      let done = partnerEinkommenDone({
        context: { "partner-employmentType": "employed" },
      });
      expect(done).toBe(false);
      done = partnerEinkommenDone({
        context: { "partner-employmentType": "employedAndSelfEmployed" },
      });
      expect(done).toBe(false);
    });

    it("should first return false if the user is self employed and hasn't entered their self-employment income", () => {
      const done = partnerEinkommenDone({
        context: { "partner-employmentType": "selfEmployed" },
      });
      expect(done).toBe(false);
    });
  });

  describe("partnerLeistungenDone", () => {
    it("should return false if there are no leistungen", () => {
      const done = partnerLeistungenDone({ context: {} });
      expect(done).toBe(false);
    });

    it.each([
      { typ: "wohngeld", expected: false },
      { typ: "krankengeld", expected: false },
      { typ: "elterngeld", expected: false },
      { typ: "kindergeld", expected: false },
    ])(
      "Should return $expected if $typ is selected and no amount is entered",
      ({ typ, expected }) => {
        const done = partnerLeistungenDone({
          context: {
            partnerLeistungen: {
              [typ]: "on" as CheckboxValue,
            },
          },
        });
        expect(done).toBe(expected);
      },
    );

    it('should return true if the user selects "none of the above"', () => {
      expect(
        partnerLeistungenDone({
          context: {
            partnerLeistungen: {
              none: "on",
            },
          },
        }),
      ).toBe(true);
    });
  });

  describe("partnerArbeitDone", () => {
    it("should return true if the user doesn't work", () => {
      const done = partnerArbeitDone({
        context: { "partner-currentlyEmployed": "no" },
      });
      expect(done).toBe(true);
    });
  });

  describe("partnerEinkuenfteDone", () => {
    vi.doMock(
      "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/partner/doneFunctions",
      async (importOriginal) => {
        const partnerDoneFunctions: object = await importOriginal();
        return {
          ...partnerDoneFunctions,
          partnerStaatlicheLeistungenDone: () => true,
          partnerArbeitDone: () => true,
          partnerLeistungenDone: () => true,
        };
      },
    );

    it("should return false if the user receives a pension but hasn't entered the amount", () => {
      const done = partnerEinkuenfteDone({
        context: { "partner-receivesPension": "yes" },
      });
      expect(done).toBe(false);
    });

    it('should return false if the user has further income but hasn"t entered the income', () => {
      const done = partnerEinkuenfteDone({
        context: { "partner-hasFurtherIncome": "yes" },
      });
      expect(done).toBe(false);
    });
  });

  describe("partnerPensionDone", () => {
    it("should return false if the user hasn't stated yes or no", () => {
      const done = partnerPensionDone({
        context: { "partner-receivesPension": undefined },
      });
      expect(done).toBe(false);
    });

    it("should return false if the user stated yes but hasn't entered the amount", () => {
      const done = partnerPensionDone({
        context: { "partner-receivesPension": "yes" },
      });
      expect(done).toBe(false);
    });

    it("should return true if the user doesn't receive a pension", () => {
      const done = partnerPensionDone({
        context: { "partner-receivesPension": "no" },
      });
      expect(done).toBe(true);
    });
  });

  describe("partnerFurtherIncomeDone", () => {
    it("should return false if the user hasn't stated yes or no", () => {
      const done = partnerFurtherIncomeDone({
        context: { "partner-hasFurtherIncome": undefined },
      });
      expect(done).toBe(false);
    });

    it("should return false if the user stated yes but hasn't entered the income", () => {
      const done = partnerFurtherIncomeDone({
        context: { "partner-hasFurtherIncome": "yes" },
      });
      expect(done).toBe(false);
    });
  });
});
