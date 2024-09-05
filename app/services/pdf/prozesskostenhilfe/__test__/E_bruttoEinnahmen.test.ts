import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import {
  fillAndereLeistungen,
  fillEinkommenType,
  fillStaatlicheLeistungen,
} from "~/services/pdf/prozesskostenhilfe/E_bruttoEinnahmen";

let pdfParams: ProzesskostenhilfePDF;

describe("E_bruttoEinnahmen", () => {
  // Ensure we have a clean copy of the pdfParams before each test, as each function mutates the object
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });
  describe("fillStaatlicheLeistungen", () => {
    it("should indicate Grundsicherung in field E2 if Grundsicherung is selected, setting all other staatlicheLeistungen fields to false", () => {
      const { pdfValues } = fillStaatlicheLeistungen({
        userData: { staatlicheLeistungen: "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.undefined_8.value).toBe(true);
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBe("Grundsicherung oder Sozialhilfe");
      expect(pdfValues.nein_17.value).toBe(true);
      expect(pdfValues.nein_15.value).toBe(true);
    });

    it("should indicate Asylbewerberleistungen in field E2 if Asylbewerberleistungen is selected, setting all other staatlicheLeistungen fields to false", () => {
      const { pdfValues } = fillStaatlicheLeistungen({
        userData: { staatlicheLeistungen: "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.undefined_8.value).toBe(true);
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBe("Asylbewerberleistungen");
      expect(pdfValues.nein_17.value).toBe(true);
      expect(pdfValues.nein_15.value).toBe(true);
    });

    it("should indicate if a user receives Buergergeld, and if so, the amount", () => {
      const { pdfValues } = fillStaatlicheLeistungen({
        userData: {
          staatlicheLeistungen: "buergergeld",
          buergergeld: "100",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_22.value).toBe(true); // Grundsicherung or Asylbewerberleistungen
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBeUndefined();
      expect(pdfValues.ja_16.value).toBe(true);
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro11
          .value,
      ).toBe("100€");
      expect(pdfValues.nein_15.value).toBe(true);
    });

    it("should indicate if a user receives Arbeitslostengeld, and if so, the amount", () => {
      const { pdfValues } = fillStaatlicheLeistungen({
        userData: {
          staatlicheLeistungen: "arbeitslosengeld",
          arbeitslosengeld: "250",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_22.value).toBe(true); // Grundsicherung or Asylbewerberleistungen
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBeUndefined();
      expect(pdfValues.ja_14.value).toBe(true);
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro10
          .value,
      ).toBe("250€");
      expect(pdfValues.nein_17.value).toBe(true);
    });
  });

  describe("fillEinkommenType", () => {
    it("should report no income if the user doesn't work for income", () => {
      const { pdfValues } = fillEinkommenType({
        userData: { currentlyEmployed: "no" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_10.value).toBe(true);
      expect(pdfValues.nein_12.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro
          .value,
      ).toBeUndefined();
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3
          .value,
      ).toBeUndefined();
    });

    it("should report no income if the user receives Grundsicherung", () => {
      const { pdfValues } = fillEinkommenType({
        userData: { staatlicheLeistungen: "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_10.value).toBe(true);
      expect(pdfValues.nein_12.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro
          .value,
      ).toBeUndefined();
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3
          .value,
      ).toBeUndefined();
    });

    it("should report no income if the user receives Asylbewerberleistungen", () => {
      const { pdfValues } = fillEinkommenType({
        userData: { staatlicheLeistungen: "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_10.value).toBe(true);
      expect(pdfValues.nein_12.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro
          .value,
      ).toBeUndefined();
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3
          .value,
      ).toBeUndefined();
    });

    it("should report employment income if the user is an employee", () => {
      const { pdfValues } = fillEinkommenType({
        userData: {
          employmentType: "employed",
          nettoEinkuenfteAlsArbeitnehmer: "1000",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_9.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro
          .value,
      ).toBe("1000€");
      expect(pdfValues.nein_12.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3
          .value,
      ).toBeUndefined();
    });

    it("should report self-employment income if the user is self-employed", () => {
      const { pdfValues } = fillEinkommenType({
        userData: {
          employmentType: "selfEmployed",
          selbststaendigMonatlichesEinkommen: "1000",
          selbststaendigBruttoNetto: "netto",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_11.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3
          .value,
      ).toBe("1000€ netto");
      expect(pdfValues.nein_10.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro
          .value,
      ).toBeUndefined();
    });

    it("should report both employment and self-employment income", () => {
      const { pdfValues } = fillEinkommenType({
        userData: {
          employmentType: "employedAndSelfEmployed",
          nettoEinkuenfteAlsArbeitnehmer: "1000",
          selbststaendigMonatlichesEinkommen: "1000",
          selbststaendigBruttoNetto: "brutto",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_9.value).toBe(true);
      expect(pdfValues.ja_11.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro
          .value,
      ).toBe("1000€");
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3
          .value,
      ).toBe("1000€ brutto");
    });
  });

  describe("fillAndereLeistungen", () => {
    it('check "no" for all other leistungen fields if none are selected', () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: {},
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_18.value).toBe(true);
      expect(pdfValues.nein_19.value).toBe(true);
      expect(pdfValues.nein_20.value).toBe(true);
      expect(pdfValues.nein_21.value).toBe(true);
    });

    it("should indicate if a user receives Wohngeld", () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: { hasWohngeld: CheckboxValue.on, wohngeldAmount: "100" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_19.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchWohngeldinEuro7.value,
      ).toBe("100€");
    });
    it("should indicate if a user receives Krankengeld", () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: {
          hasKrankengeld: CheckboxValue.on,
          krankengeldAmount: "250",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_18.value).toBe(true);
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro12
          .value,
      ).toBe("250€");
    });
    it("should indicate if a user receives Elterngeld", () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: { hasElterngeld: CheckboxValue.on, elterngeldAmount: "50" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_20.value).toBe(true);
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro13
          .value,
      ).toBe("50€");
    });
    it("should indicate if a user receives Kindergeld", () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: {
          hasKindergeld: CheckboxValue.on,
          kindergeldAmount: "10000",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_17.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchKindergeldIKinderzuschlaginEuro6
          .value,
      ).toBe("10000€");
    });
  });
});
