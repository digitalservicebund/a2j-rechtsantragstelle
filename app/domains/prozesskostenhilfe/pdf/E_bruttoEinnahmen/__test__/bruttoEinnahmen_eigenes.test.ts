import { faker } from "@faker-js/faker";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { createFinancialEntry } from "tests/fixtures/prozesskostenhilfeFormularData";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import {
  fillAndereLeistungen,
  fillEinkommenType,
  fillOwnBruttoEinnahmen,
  fillRente,
  fillStaatlicheLeistungen,
  fillWeitereEinkuenfte,
} from "~/domains/prozesskostenhilfe/pdf/E_bruttoEinnahmen/bruttoEinnahmen_eigenes";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "../../../../../services/pdf/attachment";

let pdfParams: ProzesskostenhilfePDF;

describe("bruttoEinnahmen_eigenes", () => {
  // Ensure we have a clean copy of the pdfParams before each test, as each function mutates the object
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });
  describe("fillStaatlicheLeistungen", () => {
    it("should indicate if a user receives Buergergeld, and if so, the amount", () => {
      const { pdfValues } = fillStaatlicheLeistungen({
        userData: {
          staatlicheLeistungen: "buergergeld",
          buergergeld: "100",
        },
        pdfValues: pdfParams,
      });
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
      ).toBe("100 netto");
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
      ).toBe("250 netto");
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
      const { pdfValues } = fillOwnBruttoEinnahmen({
        userData: { staatlicheLeistungen: "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_10.value).toBeUndefined();
      expect(pdfValues.nein_12.value).toBeUndefined();
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
      const { pdfValues } = fillOwnBruttoEinnahmen({
        userData: { staatlicheLeistungen: "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_10.value).toBeUndefined();
      expect(pdfValues.nein_12.value).toBeUndefined();
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
      ).toBe("1000 netto");
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
      ).toBe("1000 netto");
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
      ).toBe("1000 netto");
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3
          .value,
      ).toBe("1000 brutto");
    });
  });

  describe("fillRente", () => {
    it("should not report pension if the user receives grundsicherung", () => {
      const { pdfValues } = fillRente({
        userData: { staatlicheLeistungen: "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_12.value).toBe(undefined);
      expect(pdfValues.nein_13.value).toBe(undefined);
    });

    it("should not report pension if the user receives asylbewerberleistungen", () => {
      const { pdfValues } = fillRente({
        userData: { staatlicheLeistungen: "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_12.value).toBe(undefined);
      expect(pdfValues.nein_13.value).toBe(undefined);
    });

    it("should report no pension if the user doesn't receive one", () => {
      const { pdfValues } = fillRente({
        userData: { receivesPension: "no" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_13.value).toBe(true);
    });

    it("should report that a user receives a pension, along with the amount", () => {
      const { pdfValues } = fillRente({
        userData: { receivesPension: "yes", pensionAmount: "1000" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_12.value).toBe(true);
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro9
          .value,
      ).toBe("1000 netto");
    });
  });

  describe("fillAndereLeistungen", () => {
    it('check "no" for all other leistungen fields if none are selected and the following question has been answered', () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: { hasFurtherIncome: "no" },
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
      ).toBe("100 netto");
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
      ).toBe("250 netto");
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
      ).toBe("50 netto");
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
      ).toBe("10000 netto");
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

    it("should indicate Asylbewerberleistungen", () => {
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: { staatlicheLeistungen: "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBe("Asylbewerberleistungen");
    });

    it("should indicate Grundsicherung", () => {
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: { staatlicheLeistungen: "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.undefined_8.value).toBe(true);
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBe("Grundsicherung oder Sozialhilfe");
    });

    it("should indicate if the user has one additional Einkunft", () => {
      const singleEinkunft = createFinancialEntry();
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: {
          hasFurtherIncome: "yes",
          weitereEinkuenfte: [singleEinkunft],
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.undefined_8.value).toBe(true);
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toContain(singleEinkunft.beschreibung);
      expect(pdfValues.euroBrutto.value).toBe(`${singleEinkunft.betrag} netto`);

      // Second field should remain blank
      expect(
        pdfValues[
          "2HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow2"
        ].value,
      ).toBeUndefined();
      expect(pdfValues.euroBrutto2.value).toBeUndefined();
    });

    it("should indicate if the user has two additional Einkuenfte", () => {
      const twoEinkuenfte = faker.helpers.multiple(createFinancialEntry, {
        count: 2,
      });
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: { weitereEinkuenfte: twoEinkuenfte },
        pdfValues: pdfParams,
      });

      expect(pdfValues.undefined_8.value).toBe(true);
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toContain(twoEinkuenfte[0].beschreibung);
      expect(pdfValues.euroBrutto.value).toBe(
        `${twoEinkuenfte[0].betrag} netto`,
      );

      // Second field should also be filled
      expect(
        pdfValues[
          "2HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow2"
        ].value,
      ).toContain(twoEinkuenfte[1].beschreibung);
      expect(pdfValues.euroBrutto2.value).toBe(
        `${twoEinkuenfte[1].betrag} netto`,
      );
    });

    it('should print "Siehe Anhang", the collective monthly amount, and add an attachment if there are more than 2 Einkuenfte', () => {
      const threeEinkuenfte = faker.helpers.multiple(createFinancialEntry, {
        count: 3,
      });

      const { pdfValues, attachment } = fillWeitereEinkuenfte({
        userData: { weitereEinkuenfte: threeEinkuenfte },
        pdfValues: pdfParams,
      });
      expect(pdfValues.undefined_8.value).toBe(true);
      expect(
        pdfValues[
          "1HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow1"
        ].value,
      ).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);
      expect(attachment?.length).toBeGreaterThan(0);
      expect(attachment?.at(0)).toEqual({
        level: "h3",
        title: "2. Andere Einnahmen",
      });
      expect(attachment?.at(1)?.text).toContain(" netto");
      threeEinkuenfte.forEach((einkunft, index) => {
        expect(attachment?.at(1 + index)?.text).contain(einkunft.betrag);
        expect(attachment?.at(1 + index)?.title).contain(einkunft.beschreibung);
      });
    });
  });
});
