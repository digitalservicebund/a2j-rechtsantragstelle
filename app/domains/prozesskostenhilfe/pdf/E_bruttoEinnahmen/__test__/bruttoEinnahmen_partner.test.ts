import { faker } from "@faker-js/faker";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { createFinancialEntry } from "tests/fixtures/prozesskostenhilfeFormularData";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import {
  fillAndereLeistungenPartner,
  fillBesondersHoheAusgabenPartner,
  fillBruttoEinnahmenPartner,
  fillEinkommenTypePartner,
  fillRentePartner,
  fillStaatlicheLeistungenPartner,
  fillSupportPartner,
  fillWeitereEinkuenftePartner,
} from "~/domains/prozesskostenhilfe/pdf/E_bruttoEinnahmen/bruttoEinnahmen_partner";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";

let pdfParams: ProzesskostenhilfePDF;

describe("bruttoEinnahmen_partner", () => {
  // Ensure we have a clean copy of the pdfParams before each test, as each function mutates the object
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
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
      expect(pdfValues.monatlicheBruttoeinnahmenH10.value).toBe("100 netto");
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
      expect(pdfValues.monatlicheBruttoeinnahmenH9.value).toBe("250 netto");
      expect(pdfValues.nein_30.value).toBe(true);
    });
  });

  describe("fillRentePartner", () => {
    it("should not report pension if the user's partner receives grundsicherung", () => {
      const { pdfValues } = fillRentePartner({
        userData: { "partner-staatlicheLeistungen": "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_25.value).toBe(undefined);
      expect(pdfValues.nein_26.value).toBe(undefined);
    });

    it("should not report pension if the user's partner receives asylbewerberleistungen", () => {
      const { pdfValues } = fillRentePartner({
        userData: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.ja_25.value).toBe(undefined);
      expect(pdfValues.nein_26.value).toBe(undefined);
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
      expect(pdfValues.monatlicheBruttoeinnahmenH8.value).toBe("1000 netto");
    });
  });

  describe("fillSupportPartner", () => {
    it("should not report support if the user's partner receives grundsicherung", () => {
      const { pdfValues } = fillSupportPartner({
        userData: { "partner-staatlicheLeistungen": "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_24.value).toBe(undefined);
      expect(pdfValues.ja_23.value).toBe(undefined);
    });

    it("should not report support if the user's partner receives asylbewerberleistungen", () => {
      const { pdfValues } = fillSupportPartner({
        userData: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_24.value).toBe(undefined);
      expect(pdfValues.ja_23.value).toBe(undefined);
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
      expect(pdfValues.monatlicheBruttoeinnahmenH7.value).toBe("1000 netto");
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
      const { pdfValues } = fillBruttoEinnahmenPartner({
        userData: { "partner-staatlicheLeistungen": "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_23.value).toBeUndefined();
      expect(pdfValues.nein_25.value).toBeUndefined();
      expect(pdfValues.monatlicheBruttoeinnahmenH1.value).toBeUndefined();
      expect(pdfValues.monatlicheBruttoeinnahmenH2.value).toBeUndefined();
    });

    it("should report no income if the user's partner receives Asylbewerberleistungen", () => {
      const { pdfValues } = fillBruttoEinnahmenPartner({
        userData: { "partner-staatlicheLeistungen": "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.nein_23.value).toBeUndefined();
      expect(pdfValues.nein_25.value).toBeUndefined();
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
      expect(pdfValues.monatlicheBruttoeinnahmenH1.value).toBe("1000 netto");
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
      expect(pdfValues.monatlicheBruttoeinnahmenH2.value).toBe("1000 netto");
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
      expect(pdfValues.monatlicheBruttoeinnahmenH1.value).toBe("1000 netto");
      expect(pdfValues.monatlicheBruttoeinnahmenH2.value).toBe("1000 brutto");
    });
  });

  describe("fillAndereLeistungenPartner", () => {
    it('check "no" for all other leistungen fields if none are selected and the following question has been answered', () => {
      const { pdfValues } = fillAndereLeistungenPartner({
        userData: { "partner-hasFurtherIncome": "yes" },
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
      expect(pdfValues.monatlicheBruttoeinnahmenH6.value).toBe("100 netto");
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
      expect(pdfValues.monatlicheBruttoeinnahmenH11.value).toBe("250 netto");
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
      expect(pdfValues.monatlicheBruttoeinnahmenH12.value).toBe("50 netto");
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
      expect(pdfValues.monatlicheBruttoeinnahmenH5.value).toBe("10000 netto");
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
      expect(pdfValues.euroBrutto3.value).toBe(
        `${singleEinkunft.betrag} netto`,
      );

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
      expect(pdfValues.euroBrutto3.value).toBe(
        `${twoEinkuenfte[0].betrag} netto`,
      );

      // Second field should also be filled
      expect(
        pdfValues[
          "hatIhrEhegatteeingetragenerLebenspartnerbzwIhreEhegattineingetrageneLebenspartnerinandereEinnahmenBitteangeben2"
        ].value,
      ).toContain(twoEinkuenfte[1].beschreibung);
      expect(pdfValues.euroBrutto4.value).toBe(
        `${twoEinkuenfte[1].betrag} netto`,
      );
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

  describe("fillBesondersHoheAusgabenPartner", () => {
    it("should append an attachment if the user has entered an additional expense for their partner", () => {
      const { attachment } = fillBesondersHoheAusgabenPartner({
        userData: {
          partnerHasBesondersAusgaben: "yes",
          partnerBesondersAusgabe: {
            beschreibung: "Woah so expensive",
            betrag: "10000",
          },
        },
        pdfValues: pdfParams,
      });
      expect(attachment?.length).toBeGreaterThan(0);
      expect(attachment?.at(0)).toEqual({
        level: "h3",
        title: "Besonders Hohe Ausgaben",
      });
      expect(attachment?.at(1)?.title).toContain("Woah so expensive");
      expect(attachment?.at(1)?.text).toContain("10000 netto Monatlich");
    });
  });
});
