import { faker } from "@faker-js/faker";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { createFinancialEntry } from "tests/fixtures/prozesskostenhilfeFormularData";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import {
  fillAndereLeistungen,
  fillAndereLeistungenPartner,
  fillEinkommenType,
  fillEinkommenTypePartner,
  fillRente,
  fillRentePartner,
  fillStaatlicheLeistungen,
  fillStaatlicheLeistungenPartner,
  fillSupportPartner,
  fillWeitereEinkuenfte,
  fillWeitereEinkuenftePartner,
} from "~/services/pdf/prozesskostenhilfe/E_bruttoEinnahmen";
import { newPageHint } from "../../attachment";

let pdfParams: ProzesskostenhilfePDF;

describe("E_bruttoEinnahmen", () => {
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
      ).toBe("100 €");
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
      ).toBe("250 €");
      expect(pdfValues.nein_17.value).toBe(true);
    });
  });

  describe("fillStaatlicheLeistungenPartner", () => {
    it("should indicate if a user's partner receives Buergergeld, and if so, the amount", () => {
      const { pdfValues } = fillStaatlicheLeistungenPartner({
        userData: {
          "partner-staatlicheLeistungen": "buergergeld",
          "partner-buergergeld": "100",
        },
        pdfValues: pdfParams,
      });
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
        ].value,
      ).toBeUndefined();
      expect(pdfValues.ja_29.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH10.value).toBe("100 €");
      expect(pdfValues.nein_28.value).toBe(true);
    });

    it("should indicate if a user's partner receives Arbeitslostengeld, and if so, the amount", () => {
      const { pdfValues } = fillStaatlicheLeistungenPartner({
        userData: {
          "partner-staatlicheLeistungen": "arbeitslosengeld",
          "partner-arbeitslosengeld": "250",
        },
        pdfValues: pdfParams,
      });
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
        ].value,
      ).toBeUndefined();
      expect(pdfValues.ja_27.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH9.value).toBe("250 €");
      expect(pdfValues.nein_30.value).toBe(true);
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
      ).toBe("1000 €");
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
      ).toBe("1000 € netto");
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
      ).toBe("1000 €");
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchSelbststaendigeArbeitinEuro3
          .value,
      ).toBe("1000 € brutto");
    });
  });

  describe("fillRente", () => {
    it("should report no pension if the user receives grundsicherung", () => {
      const { pdfValues } = fillRente({
        userData: { staatlicheLeistungen: "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_13.value).toBe(true);
    });

    it("should report no pension if the user receives asylbewerberleistungen", () => {
      const { pdfValues } = fillRente({
        userData: { staatlicheLeistungen: "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_13.value).toBe(true);
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
          .monatlicheBruttoeinnahmendurchNichtselbststaendigeArbeitinEuro8
          .value,
      ).toBe("1000 €");
    });
  });

  describe("fillRentePartner", () => {
    it("should report no pension if the user's partner receives grundsicherung", () => {
      const { pdfValues } = fillRentePartner({
        userData: { "partner-staatlicheLeistungen": "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_26.value).toBe(true);
    });

    it("should report no pension if the user's partner receives asylbewerberleistungen", () => {
      const { pdfValues } = fillRentePartner({
        userData: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_26.value).toBe(true);
    });

    it("should report no pension if the user's partner doesn't receive one", () => {
      const { pdfValues } = fillRentePartner({
        userData: { "partner-receivesPension": "no" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_26.value).toBe(true);
    });

    it("should report that a user's partner receives a pension, along with the amount", () => {
      const { pdfValues } = fillRentePartner({
        userData: {
          "partner-receivesPension": "yes",
          "partner-pensionAmount": "1000",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_25.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH8.value).toBe("1000 €");
    });
  });

  describe("fillSupportPartner", () => {
    it("should report no support if the user's partner receives grundsicherung", () => {
      const { pdfValues } = fillSupportPartner({
        userData: { "partner-staatlicheLeistungen": "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_24.value).toBe(true);
    });

    it("should report no support if the user's partner receives asylbewerberleistungen", () => {
      const { pdfValues } = fillSupportPartner({
        userData: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_24.value).toBe(true);
    });

    it("should report no support if the user's partner doesn't receive one", () => {
      const { pdfValues } = fillSupportPartner({
        userData: { "partner-receivesSupport": "no" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_24.value).toBe(true);
    });

    it("should report that a user's partner receives support, along with the amount", () => {
      const { pdfValues } = fillSupportPartner({
        userData: {
          "partner-receivesSupport": "yes",
          "partner-supportAmount": "1000",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_23.value).toBe(true);
      expect(pdfValues.belegnummerH17.value).toBe("1000 €");
    });
  });

  describe("fillEinkommenTypePartner", () => {
    it("should report no income if the user's partner doesn't work for income", () => {
      const { pdfValues } = fillEinkommenTypePartner({
        userData: { "partner-currentlyEmployed": "no" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_23.value).toBe(true);
      expect(pdfValues.nein_25.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH1.value).toBeUndefined();
      expect(pdfValues.monatlicheBruttoeinnahmenH2.value).toBeUndefined();
    });

    it("should report no income if the user's partner receives Grundsicherung", () => {
      const { pdfValues } = fillEinkommenTypePartner({
        userData: { "partner-staatlicheLeistungen": "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_23.value).toBe(true);
      expect(pdfValues.nein_25.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH1.value).toBeUndefined();
      expect(pdfValues.monatlicheBruttoeinnahmenH2.value).toBeUndefined();
    });

    it("should report no income if the user's partner receives Asylbewerberleistungen", () => {
      const { pdfValues } = fillEinkommenTypePartner({
        userData: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_23.value).toBe(true);
      expect(pdfValues.nein_25.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH1.value).toBeUndefined();
      expect(pdfValues.monatlicheBruttoeinnahmenH2.value).toBeUndefined();
    });

    it("should report employment income if the user's partner is an employee", () => {
      const { pdfValues } = fillEinkommenTypePartner({
        userData: {
          "partner-employmentType": "employed",
          "partner-nettoEinkuenfteAlsArbeitnehmer": "1000",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_22.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH1.value).toBe("1000 €");
      expect(pdfValues.nein_25.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH2.value).toBeUndefined();
    });

    it("should report self-employment income if the user's partner is self-employed", () => {
      const { pdfValues } = fillEinkommenTypePartner({
        userData: {
          "partner-employmentType": "selfEmployed",
          "partner-selbststaendigMonatlichesEinkommen": "1000",
          "partner-selbststaendigBruttoNetto": "netto",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_24.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH2.value).toBe("1000 € netto");
      expect(pdfValues.nein_23.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH1.value).toBeUndefined();
    });

    it("should report both employment and self-employment income for the user's partner", () => {
      const { pdfValues } = fillEinkommenTypePartner({
        userData: {
          "partner-employmentType": "employedAndSelfEmployed",
          "partner-nettoEinkuenfteAlsArbeitnehmer": "1000",
          "partner-selbststaendigMonatlichesEinkommen": "1000",
          "partner-selbststaendigBruttoNetto": "brutto",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_22.value).toBe(true);
      expect(pdfValues.ja_24.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH1.value).toBe("1000 €");
      expect(pdfValues.monatlicheBruttoeinnahmenH2.value).toBe("1000 € brutto");
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
      ).toBe("100 €");
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
      ).toBe("250 €");
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
      ).toBe("50 €");
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
      ).toBe("10000 €");
    });
  });

  describe("fillAndereLeistungenPartner", () => {
    it('check "no" for all other leistungen fields if none are selected', () => {
      const { pdfValues } = fillAndereLeistungenPartner({
        userData: {},
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_33.value).toBe(true);
      expect(pdfValues.nein_32.value).toBe(true);
      expect(pdfValues.nein_34.value).toBe(true);
      expect(pdfValues.nein_31.value).toBe(true);
    });

    it("should indicate if a user's partner receives Wohngeld", () => {
      const { pdfValues } = fillAndereLeistungenPartner({
        userData: {
          "partner-hasWohngeld": CheckboxValue.on,
          "partner-wohngeldAmount": "100",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_32.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH6.value).toBe("100 €");
    });
    it("should indicate if a user's partner receives Krankengeld", () => {
      const { pdfValues } = fillAndereLeistungenPartner({
        userData: {
          "partner-hasKrankengeld": CheckboxValue.on,
          "partner-krankengeldAmount": "250",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_31.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH11.value).toBe("250 €");
    });
    it("should indicate if a user's partner receives Elterngeld", () => {
      const { pdfValues } = fillAndereLeistungenPartner({
        userData: {
          "partner-hasElterngeld": CheckboxValue.on,
          "partner-elterngeldAmount": "50",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_33.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH12.value).toBe("50 €");
    });
    it("should indicate if a user's partner receives Kindergeld", () => {
      const { pdfValues } = fillAndereLeistungenPartner({
        userData: {
          "partner-hasKindergeld": CheckboxValue.on,
          "partner-kindergeldAmount": "10000",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_30.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmenH5.value).toBe("10000 €");
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
      expect(pdfValues.euroBrutto.value).toBe(`${singleEinkunft.betrag} €`);

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
      expect(pdfValues.euroBrutto.value).toBe(`${twoEinkuenfte[0].betrag} €`);

      // Second field should also be filled
      expect(
        pdfValues[
          "2HabenSieandereEinnahmenaucheinmaligeoderunregelmaessigeWennJabitteArtBezugszeitraumundHoeheangebenzBWeihnachtsUrlaubsgeldjaehrlichSteuererstattungjaehrlichBAfoeGmtlRow2"
        ].value,
      ).toContain(twoEinkuenfte[1].beschreibung);
      expect(pdfValues.euroBrutto2.value).toBe(`${twoEinkuenfte[1].betrag} €`);
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
      ).toBe(newPageHint);
      expect(attachment?.length).toBeGreaterThan(0);
      expect(attachment?.at(0)).toEqual({
        level: "h3",
        title: "2. Andere Einnahmen",
      });
      expect(attachment?.at(1)?.text).toContain(" €");
      threeEinkuenfte.forEach((einkunft, index) => {
        expect(attachment?.at(1 + index)?.text).contain(einkunft.betrag);
        expect(attachment?.at(1 + index)?.title).contain(einkunft.beschreibung);
      });
    });
  });

  describe("fillWeitereEinkuenftePartner", () => {
    it("check \"no\" if the user's partner doesn't have any weitere Einkuenfte and doesn't receive staatliche Leistungen", () => {
      const { pdfValues } = fillWeitereEinkuenftePartner({
        userData: {},
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_35.value).toBe(true);
    });

    it("should indicate Asylbewerberleistungen", () => {
      const { pdfValues } = fillWeitereEinkuenftePartner({
        userData: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
        ].value,
      ).toBe("Asylbewerberleistungen");
    });

    it("should indicate Grundsicherung", () => {
      const { pdfValues } = fillWeitereEinkuenftePartner({
        userData: { "partner-staatlicheLeistungen": "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_35.value).toBe(true);
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
        ].value,
      ).toBe("Grundsicherung oder Sozialhilfe");
    });

    it("should indicate if the user's partner has one additional Einkunft", () => {
      const singleEinkunft = createFinancialEntry();
      const { pdfValues } = fillWeitereEinkuenftePartner({
        userData: {
          "partner-hasFurtherIncome": "yes",
          "partner-weitereEinkuenfte": [singleEinkunft],
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_35.value).toBe(true);
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
        ].value,
      ).toContain(singleEinkunft.beschreibung);
      expect(pdfValues.euroBrutto3.value).toBe(`${singleEinkunft.betrag} €`);

      // Second field should remain blank
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben2"
        ].value,
      ).toBeUndefined();
      expect(pdfValues.euroBrutto4.value).toBeUndefined();
    });

    it("should indicate if the user's partner has two additional Einkuenfte", () => {
      const twoEinkuenfte = faker.helpers.multiple(createFinancialEntry, {
        count: 2,
      });
      const { pdfValues } = fillWeitereEinkuenftePartner({
        userData: { "partner-weitereEinkuenfte": twoEinkuenfte },
        pdfValues: pdfParams,
      });

      expect(pdfValues.ja_35.value).toBe(true);
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
        ].value,
      ).toContain(twoEinkuenfte[0].beschreibung);
      expect(pdfValues.euroBrutto3.value).toBe(`${twoEinkuenfte[0].betrag} €`);

      // Second field should also be filled
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben2"
        ].value,
      ).toContain(twoEinkuenfte[1].beschreibung);
      expect(pdfValues.euroBrutto4.value).toBe(`${twoEinkuenfte[1].betrag} €`);
    });

    it('should print "Siehe Anhang", the collective monthly amount, and add an attachment if there are more than 2 Einkuenfte', () => {
      const threeEinkuenfte = faker.helpers.multiple(createFinancialEntry, {
        count: 3,
      });

      const { pdfValues, attachment } = fillWeitereEinkuenftePartner({
        userData: { "partner-weitereEinkuenfte": threeEinkuenfte },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_35.value).toBe(true);
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben"
        ].value,
      ).toBe(newPageHint);
      expect(attachment?.length).toBeGreaterThan(0);
      expect(attachment?.at(0)).toEqual({
        level: "h3",
        title: "2. Andere Einnahmen",
      });
      expect(attachment?.at(1)?.text).toContain(" €");
      threeEinkuenfte.forEach((einkunft, index) => {
        expect(attachment?.at(1 + index)?.text).contain(einkunft.betrag);
        expect(attachment?.at(1 + index)?.title).contain(einkunft.beschreibung);
      });
    });
  });
});
