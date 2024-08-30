import { CheckboxValue } from "~/components/inputs/Checkbox";
import {
  arbeitDone,
  arbeitsabzuegeDone,
  einkommenDone,
  einkuenfteDone,
  leistungenDone,
  staatlicheLeistungenDone,
} from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";

describe("Prozesskostenhilfe Finanzielle Angaben Einkuenfte doneFunctions", () => {
  describe("staatlicheLeistungenDone", () => {
    it("should return true if the user receives Grundsicherung", () => {
      const done = staatlicheLeistungenDone({
        context: { staatlicheLeistungenPKH: "grundsicherung" },
      });
      expect(done).toBe(true);
    });

    it("should return true if the user receives Asylbewerberleistungen", () => {
      const done = staatlicheLeistungenDone({
        context: { staatlicheLeistungenPKH: "asylbewerberleistungen" },
      });
      expect(done).toBe(true);
    });

    it("should return false if the user receives Buergergeld or Arbeitslosengeld and hasn't entered a value", () => {
      let done = staatlicheLeistungenDone({
        context: { staatlicheLeistungenPKH: "buergergeld" },
      });
      expect(done).toBe(false);
      done = staatlicheLeistungenDone({
        context: { staatlicheLeistungenPKH: "arbeitslosengeld" },
      });
      expect(done).toBe(false);
    });

    it("should return false if no value has been entered", () => {
      const done = staatlicheLeistungenDone({ context: {} });
      expect(done).toBe(false);
    });
  });

  describe.skip("arbeitsabzeugeDone", () => {
    it("should return false if the user hasn't entered an arbeitsWeg", () => {
      const done = arbeitsabzuegeDone({ context: {} });
      expect(done).toBe(false);
    });

    it("should return false if the user uses public transport and hasn't entered their monthly costs, or their place of work", () => {
      const done = arbeitsabzuegeDone({
        context: { arbeitsweg: "publicTransport" },
      });
      expect(done).toBe(false);
    });

    it("should return false if the user uses a private vehicle and hasn't entered their place of work", () => {
      const done = arbeitsabzuegeDone({
        context: { arbeitsweg: "privateVehicle" },
      });
      expect(done).toBe(false);
    });

    it("should return false if the user has additional work-related costs and hasn't entered them", () => {
      const done = arbeitsabzuegeDone({
        context: { arbeitsweg: "none", hasArbeitsausgaben: "yes" },
      });
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
    it("should return true if there are no leistungen", () => {
      const done = leistungenDone({ context: {} });
      expect(done).toBe(true);
    });

    it.each([
      { typ: "Wohngeld", expected: false },
      { typ: "Krankengeld", expected: false },
      { typ: "Elterngeld", expected: false },
      { typ: "Kindergeld", expected: false },
    ])(
      "Should return $expected if $typ is selected and no amount is entered",
      ({ typ, expected }) => {
        const done = leistungenDone({
          context: {
            [`has${typ}`]: CheckboxValue.on,
          },
        });
        expect(done).toBe(expected);
      },
    );
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

    it('should return false if the user receives support but hasn"t entered the amount', () => {
      const done = einkuenfteDone({ context: { receivesSupport: "yes" } });
      expect(done).toBe(false);
    });

    it('should return false if the user has further income but hasn"t entered the income', () => {
      const done = einkuenfteDone({ context: { hasFurtherIncome: "yes" } });
      expect(done).toBe(false);
    });
  });
});
