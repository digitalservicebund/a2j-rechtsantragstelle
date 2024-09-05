import { faker } from "@faker-js/faker";
import _ from "lodash";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { FinancialEntry } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import {
  fillAndereLeistungen,
  fillEinkommenType,
  fillStaatlicheLeistungen,
  fillWeitereEinkuenfte,
} from "~/services/pdf/prozesskostenhilfe/E_bruttoEinnahmen";
import { getTotalMonthlyFinancialEntries } from "~/services/pdf/util";

let pdfParams: ProzesskostenhilfePDF;

describe("E_bruttoEinnahmen", () => {
  // Ensure we have a clean copy of the pdfParams before each test, as each function mutates the object
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });
  describe("fillStaatlicheLeistungen", () => {
    it("should indicate Grundsicherung in field E2 if Grundsicherung is selected, setting all other staatlicheLeistungenPKH fields to false", () => {
      const { pdfValues } = fillStaatlicheLeistungen({
        userData: { staatlicheLeistungenPKH: "grundsicherung" },
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

    it("should indicate Asylbewerberleistungen in field E2 if Asylbewerberleistungen is selected, setting all other staatlicheLeistungenPKH fields to false", () => {
      const { pdfValues } = fillStaatlicheLeistungen({
        userData: { staatlicheLeistungenPKH: "asylbewerberleistungen" },
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
          staatlicheLeistungenPKH: "buergergeld",
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
          staatlicheLeistungenPKH: "arbeitslosengeld",
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
        userData: { staatlicheLeistungenPKH: "grundsicherung" },
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
        userData: { staatlicheLeistungenPKH: "asylbewerberleistungen" },
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

  describe("fillWeitereEinkuenfte", () => {
    it("check \"no\" if the user doesn't have any weitere Einkuenfte and doesn't receive staatliche Leistungen", () => {
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: {},
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_22.value).toBe(true);
    });

    it("should indicate if the user has one additional Einkunft", () => {
      const singleEinkunft: FinancialEntry = {
        beschreibung: faker.word.sample(),
        betrag: faker.finance.amount().toString(),
      };
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: {
          hasFurtherIncome: "yes",
          weitereEinkuenfte: [singleEinkunft],
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.undefined_8.value).toBe(true);
      expect(pdfValues.nein_22.value).toBe(false);
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBe(singleEinkunft.beschreibung);
      expect(pdfValues.euroBrutto.value).toBe(`${singleEinkunft.betrag}€`);

      // Second field should remain blank
      expect(
        pdfValues[
          "2HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow2"
        ].value,
      ).toBeUndefined();
      expect(pdfValues.euroBrutto2.value).toBeUndefined();
    });

    it("should indicate if the user has two additional Einkuenfte", () => {
      const twoEinkuenfte: FinancialEntry[] = _.times(2, () => ({
        beschreibung: faker.word.sample(),
        betrag: faker.finance.amount().toString(),
      }));
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: {
          hasFurtherIncome: "yes",
          weitereEinkuenfte: twoEinkuenfte,
        },
        pdfValues: pdfParams,
      });

      expect(pdfValues.undefined_8.value).toBe(true);
      expect(pdfValues.nein_22.value).toBe(false);
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBe(twoEinkuenfte[0].beschreibung);
      expect(pdfValues.euroBrutto.value).toBe(`${twoEinkuenfte[0].betrag}€`);

      // Second field should also be filled
      expect(
        pdfValues[
          "2HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow2"
        ].value,
      ).toBe(twoEinkuenfte[1].beschreibung);
      expect(pdfValues.euroBrutto2.value).toBe(`${twoEinkuenfte[1].betrag}€`);
    });

    it('should print "Siehe Anhang", the collective monthly amount, and add an attachment if there are more than 2 Einkuenfte', () => {
      const threeEinkuenfte: FinancialEntry[] = _.times(3, () => ({
        beschreibung: faker.word.sample(),
        betrag: faker.finance.amount().toString(),
      }));

      const { pdfValues, attachment } = fillWeitereEinkuenfte({
        userData: {
          hasFurtherIncome: "yes",
          weitereEinkuenfte: threeEinkuenfte,
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.undefined_8.value).toBe(true);
      expect(pdfValues.nein_22.value).toBe(false);
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBe("Siehe Anhang");
      expect(pdfValues.euroBrutto.value).toBe(
        `${getTotalMonthlyFinancialEntries(threeEinkuenfte)}€`,
      );
      expect(attachment?.length).toBeGreaterThan(0);
      expect(attachment?.at(0)).toEqual({
        level: "h2",
        title: "Brutto Einnahmen",
      });
      expect(attachment?.at(1)).toEqual({
        level: "h3",
        title: "Weitere Einkünfte",
      });
      threeEinkuenfte.forEach((einkunft, index) => {
        expect(attachment?.at(2 + index)).toEqual({
          text: `${einkunft.betrag}€/Monat`,
          title: einkunft.beschreibung,
        });
      });
    });
  });
});
