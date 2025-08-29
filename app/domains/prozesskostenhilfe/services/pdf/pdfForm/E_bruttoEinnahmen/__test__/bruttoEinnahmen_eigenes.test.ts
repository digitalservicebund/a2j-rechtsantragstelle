import { faker } from "@faker-js/faker";
import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { createFinancialEntry } from "~/domains/prozesskostenhilfe/formular/__test__/prozesskostenhilfeFormularData";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";
import {
  fillAndereLeistungen,
  fillEinkommenType,
  fillOwnBruttoEinnahmen,
  fillRente,
  fillStaatlicheLeistungen,
  fillWeitereEinkuenfte,
} from "../bruttoEinnahmen_eigenes";

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
      expect(pdfValues.andereEinnahmen1.value).toBeUndefined();
      expect(pdfValues.e20.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchBuergergeldinEuro.value,
      ).toBe("100 netto");
      expect(pdfValues.e17.value).toBe(true);
    });

    it("should indicate if a user receives Arbeitslostengeld, and if so, the amount", () => {
      const { pdfValues } = fillStaatlicheLeistungen({
        userData: {
          staatlicheLeistungen: "arbeitslosengeld",
          arbeitslosengeld: "250",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.andereEinnahmen1.value).toBeUndefined();
      expect(pdfValues.e18.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchArbeitslosengeldinEuro.value,
      ).toBe("250 netto");
      expect(pdfValues.e19.value).toBe(true);
    });
  });

  describe("fillEinkommenType", () => {
    it("should report no income if the user doesn't work for income", () => {
      const { pdfValues } = fillEinkommenType({
        userData: { currentlyEmployed: "no" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e1.value).toBe(true);
      expect(pdfValues.e3.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchnichtselbstaendigeArbeitinEuro
          .value,
      ).toBeUndefined();
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchselbstaendigeArbeitGewerbebetriebLandundForstwirtschaftinEur
          .value,
      ).toBeUndefined();
    });

    it("should report no income if the user receives Grundsicherung", () => {
      const { pdfValues } = fillOwnBruttoEinnahmen({
        userData: { staatlicheLeistungen: "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e1.value).toBeUndefined();
      expect(pdfValues.e3.value).toBeUndefined();
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchnichtselbstaendigeArbeitinEuro
          .value,
      ).toBeUndefined();
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchselbstaendigeArbeitGewerbebetriebLandundForstwirtschaftinEur
          .value,
      ).toBeUndefined();
    });

    it("should report no income if the user receives Asylbewerberleistungen", () => {
      const { pdfValues } = fillOwnBruttoEinnahmen({
        userData: { staatlicheLeistungen: "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e1.value).toBeUndefined();
      expect(pdfValues.e3.value).toBeUndefined();
      expect(pdfValues.e26.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchnichtselbstaendigeArbeitinEuro
          .value,
      ).toBeUndefined();
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchselbstaendigeArbeitGewerbebetriebLandundForstwirtschaftinEur
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
      expect(pdfValues.e2.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchnichtselbstaendigeArbeitinEuro
          .value,
      ).toBe("1000 netto");
      expect(pdfValues.e3.value).toBe(true);
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchselbstaendigeArbeitGewerbebetriebLandundForstwirtschaftinEur
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
      expect(pdfValues.e4.value).toBe(true);
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchselbstaendigeArbeitGewerbebetriebLandundForstwirtschaftinEur
          .value,
      ).toBe("1000 netto");
      expect(pdfValues.e1.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchnichtselbstaendigeArbeitinEuro
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
      expect(pdfValues.e2.value).toBe(true);
      expect(pdfValues.e4.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchnichtselbstaendigeArbeitinEuro
          .value,
      ).toBe("1000 netto");
      expect(
        pdfValues
          .monatlicheBruttoeinnahmendurchselbstaendigeArbeitGewerbebetriebLandundForstwirtschaftinEur
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
      expect(pdfValues.e16.value).toBe(undefined);
      expect(pdfValues.e15.value).toBe(undefined);
    });

    it("should not report pension if the user receives asylbewerberleistungen", () => {
      const { pdfValues } = fillRente({
        userData: { staatlicheLeistungen: "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e16.value).toBe(undefined);
      expect(pdfValues.e15.value).toBe(undefined);
    });

    it("should report no pension if the user doesn't receive one", () => {
      const { pdfValues } = fillRente({
        userData: { receivesPension: "no" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e15.value).toBe(true);
    });

    it("should report that a user receives a pension, along with the amount", () => {
      const { pdfValues } = fillRente({
        userData: { receivesPension: "yes", pensionAmount: "1000" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e16.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchRentePensioninEuro.value,
      ).toBe("1000 netto");
    });
  });

  describe("fillAndereLeistungen", () => {
    it('check "no" for all other leistungen fields if none are selected and the following question has been answered', () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: { hasFurtherIncome: "no" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e9.value).toBe(true);
      expect(pdfValues.e11.value).toBe(true);
      expect(pdfValues.e21.value).toBe(true);
      expect(pdfValues.e23.value).toBe(true);
    });

    it("should indicate if a user receives Wohngeld", () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: { leistungen: { wohngeld: "on" }, wohngeldAmount: "100" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e12.value).toBe(true);
      expect(pdfValues.monatlicheBruttoeinnahmendurchWohngeldinEuro.value).toBe(
        "100 netto",
      );
    });
    it("should indicate if a user receives Krankengeld", () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: {
          leistungen: { krankengeld: "on" },
          krankengeldAmount: "250",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e22.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchKrankengeldinEuro.value,
      ).toBe("250 netto");
    });
    it("should indicate if a user receives Elterngeld", () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: { leistungen: { elterngeld: "on" }, elterngeldAmount: "50" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e24.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchElterngeldinEuro.value,
      ).toBe("50 netto");
    });
    it("should indicate if a user receives Kindergeld", () => {
      const { pdfValues } = fillAndereLeistungen({
        userData: {
          leistungen: { kindergeld: "on" },
          kindergeldAmount: "10000",
        },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e10.value).toBe(true);
      expect(
        pdfValues.monatlicheBruttoeinnahmendurchKindergeldKinderzuschlaginEuro
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
      expect(pdfValues.e25.value).toBe(true);
    });

    it("should indicate Asylbewerberleistungen", () => {
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: { staatlicheLeistungen: "asylbewerberleistungen" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.andereEinnahmen1.value).toBe("Asylbewerberleistungen");
    });

    it("should indicate Grundsicherung", () => {
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: { staatlicheLeistungen: "grundsicherung" },
        pdfValues: pdfParams,
      });
      expect(pdfValues.e26.value).toBe(true);
      expect(pdfValues.andereEinnahmen1.value).toBe(
        "Grundsicherung oder Sozialhilfe",
      );
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
      expect(pdfValues.e26.value).toBe(true);
      expect(pdfValues.andereEinnahmen1.value).toContain(
        singleEinkunft.beschreibung,
      );
      expect(pdfValues.bruttobezug1.value).toBe(
        `${singleEinkunft.betrag} netto`,
      );

      // Second field should remain blank
      expect(pdfValues.andereEinnahmen2.value).toBeUndefined();
      expect(pdfValues.bruttobezug2.value).toBeUndefined();
    });

    it("should indicate if the user has two additional Einkuenfte", () => {
      const twoEinkuenfte = faker.helpers.multiple(createFinancialEntry, {
        count: 2,
      });
      const { pdfValues } = fillWeitereEinkuenfte({
        userData: { weitereEinkuenfte: twoEinkuenfte },
        pdfValues: pdfParams,
      });

      expect(pdfValues.e26.value).toBe(true);
      expect(pdfValues.andereEinnahmen1.value).toContain(
        twoEinkuenfte[0].beschreibung,
      );
      expect(pdfValues.bruttobezug1.value).toBe(
        `${twoEinkuenfte[0].betrag} netto`,
      );

      // Second field should also be filled
      expect(pdfValues.andereEinnahmen2.value).toContain(
        twoEinkuenfte[1].beschreibung,
      );
      expect(pdfValues.bruttobezug2.value).toBe(
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
      expect(pdfValues.e26.value).toBe(true);
      expect(pdfValues.andereEinnahmen1.value).toBe(
        SEE_IN_ATTACHMENT_DESCRIPTION,
      );
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
