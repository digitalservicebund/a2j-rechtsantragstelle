import { type CheckboxValue } from "~/components/formElements/Checkbox";
import {
  arbeitDone,
  einkommenDone,
  einkuenfteDone,
  furtherIncomeDone,
  leistungenDone,
  pensionDone,
  staatlicheLeistungenDone,
} from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/doneFunctions";

describe("Prozesskostenhilfe Finanzielle Angaben Einkuenfte doneFunctions", () => {
  describe("staatlicheLeistungenDone", () => {
    it("should return true if the user receives Grundsicherung", () => {
      const done = staatlicheLeistungenDone({
        context: { staatlicheLeistungen: "grundsicherung" },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user receives Asylbewerberleistungen", () => {
      const done = staatlicheLeistungenDone({
        context: { staatlicheLeistungen: "asylbewerberleistungen" },
      });
      expect(done).toBe(true);
    });

    it("should return false if the user receives Buergergeld or Arbeitslosengeld and hasn't entered a value", () => {
      let done = staatlicheLeistungenDone({
        context: { staatlicheLeistungen: "buergergeld" },
      });
      expect(done).toBe(false);
      done = staatlicheLeistungenDone({
        context: { staatlicheLeistungen: "arbeitslosengeld" },
      });
      expect(done).toBe(false);
    });

    it("should return false if no value has been entered", () => {
      const done = staatlicheLeistungenDone({ context: {} });
      expect(done).toBe(false);
    });
  });

  describe("einkommenDone", () => {
    it("should return false if the user is employed and hasn't entered their income", () => {
      let done = einkommenDone({
        context: { employmentType: "employed" },
      });
      expect(done).toBe(false);
      done = einkommenDone({
        context: { employmentType: "employedAndSelfEmployed" },
      });
      expect(done).toBe(false);
    });

    it("should first return false if the user is self employed and hasn't entered their self-employment income", () => {
      const done = einkommenDone({
        context: { employmentType: "selfEmployed" },
      });
      expect(done).toBe(false);
    });
  });

  describe("leistungenDone", () => {
    it("should return false if there are no leistungen", () => {
      const done = leistungenDone({ context: {} });
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
        const done = leistungenDone({
          context: {
            leistungen: {
              [typ]: "on" as CheckboxValue,
            },
          },
        });
        expect(done).toBe(expected);
      },
    );

    it('should return true if the user selects "none of the above"', () => {
      expect(
        leistungenDone({
          context: {
            leistungen: {
              none: "on",
            },
          },
        }),
      ).toBe(true);
    });
  });

  describe("arbeitDone", () => {
    it("should return true if the user doesn't work", () => {
      const done = arbeitDone({ context: { currentlyEmployed: "no" } });
      expect(done).toBe(true);
    });
  });

  describe("einkuenfteDone", () => {
    vi.doMock(
      "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions",
      async (importOriginal) => {
        const doneFunctions: object = await importOriginal();
        return {
          ...doneFunctions,
          staatlicheLeistungenDone: () => true,
          arbeitDone: () => true,
          leistungenDone: () => true,
        };
      },
    );

    it("should return false if the user receives a pension but hasn't entered the amount", () => {
      const done = einkuenfteDone({ context: { receivesPension: "yes" } });
      expect(done).toBe(false);
    });

    it('should return false if the user has further income but hasn"t entered the income', () => {
      const done = einkuenfteDone({ context: { hasFurtherIncome: "yes" } });
      expect(done).toBe(false);
    });
  });

  describe("pensionDone", () => {
    it("should return false if the user hasn't stated yes or no", () => {
      const done = pensionDone({ context: { receivesPension: undefined } });
      expect(done).toBe(false);
    });

    it("should return false if the user stated yes but hasn't entered the amount", () => {
      const done = pensionDone({ context: { receivesPension: "yes" } });
      expect(done).toBe(false);
    });

    it("should return true if the user doesn't receive a pension", () => {
      const done = pensionDone({ context: { receivesPension: "no" } });
      expect(done).toBe(true);
    });
  });

  describe("furtherIncomeDone", () => {
    it("should return false if the user hasn't stated yes or no", () => {
      const done = furtherIncomeDone({
        context: { hasFurtherIncome: undefined },
      });
      expect(done).toBe(false);
    });

    it("should return false if the user stated yes but hasn't entered the income", () => {
      const done = furtherIncomeDone({
        context: { hasFurtherIncome: "yes" },
      });
      expect(done).toBe(false);
    });
  });
});
