import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import { CheckboxValue } from "~/components/inputs/Checkbox";
import { type BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { AUSGABEN_ATTACHMENT_TITLE, fillAusgaben } from "../G_ausgaben";

const expensesRecipients = "ausgaben empfänger";
const paymentDeadlineDate = "12.12.2099";
describe("G_ausgaben", () => {
  describe("zahlungsverpflichtungen", () => {
    test.each([
      ["yes", [false, true]],
      ["no", [true, false]],
      [undefined, [false, false]],
    ] as const)(
      "sets ownership checkboxes for hasAusgaben %s",
      (hasAusgaben, expected) => {
        const { pdfValues } = pdfFillReducer({
          userData: { hasAusgaben },
          pdfParams: getBeratungshilfeParameters(),
          fillFunctions: [fillAusgaben],
        });
        expect(pdfValues.g1VerpflichtungenN.value).toBe(expected[0]);
        expect(pdfValues.g1VerpflichtungenJ.value).toBe(expected[1]);
      },
    );

    it("fills pdf fields", () => {
      const { pdfValues } = pdfFillReducer({
        userData: {
          ausgaben: [
            {
              art: "ausgaben art",
              zahlungsempfaenger: expensesRecipients,
              beitrag: "12,00",
              hasZahlungsfrist: "yes",
              zahlungsfrist: paymentDeadlineDate,
            },
          ],
        },
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillAusgaben],
      });
      expect(pdfValues.g21.value).toEqual("ausgaben art");
      expect(pdfValues.g31.value).toEqual(expensesRecipients);
      expect(pdfValues.g5Raten1.value).toEqual(paymentDeadlineDate);
      expect(pdfValues.g7Zahlung1.value).toEqual("12,00");
    });

    it("fills attachment when count is greater than the available field", () => {
      const mockuserData: BeratungshilfeFormularContext = {
        ausgaben: [
          {
            art: "ausgaben art 1",
            zahlungsempfaenger: expensesRecipients,
            beitrag: "12,00",
            hasZahlungsfrist: "yes",
            zahlungsfrist: paymentDeadlineDate,
          },
          {
            art: "ausgaben art 2",
            zahlungsempfaenger: expensesRecipients,
            beitrag: "12,00",
            hasZahlungsfrist: "yes",
            zahlungsfrist: paymentDeadlineDate,
          },
          {
            art: "ausgaben art 3",
            zahlungsempfaenger: expensesRecipients,
            beitrag: "12,00",
            hasZahlungsfrist: "yes",
            zahlungsfrist: paymentDeadlineDate,
          },
          {
            art: "ausgaben art 4",
            zahlungsempfaenger: expensesRecipients,
            beitrag: "12,00",
            hasZahlungsfrist: "yes",
            zahlungsfrist: paymentDeadlineDate,
          },
          {
            art: "ausgaben art 5",
            zahlungsempfaenger: expensesRecipients,
            beitrag: "12,00",
            hasZahlungsfrist: "yes",
            zahlungsfrist: paymentDeadlineDate,
          },
        ],
      };
      const { pdfValues, attachment } = pdfFillReducer({
        userData: mockuserData,
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillAusgaben],
      });

      expect(pdfValues.g21.value).toEqual("Siehe Anhang");
      expect(pdfValues.g31.value).toBeUndefined();
      expect(pdfValues.g5Raten1.value).toBeUndefined();
      expect(pdfValues.g7Zahlung1.value).toBeUndefined();
      expect(attachment[0].title).toEqual(AUSGABEN_ATTACHMENT_TITLE);
      expect(attachment[1].title).toBeDefined();
    });

    it("fills attachment when char is greater than max char of the field", () => {
      const mockuserData: BeratungshilfeFormularContext = {
        ausgaben: [
          {
            art: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam",
            zahlungsempfaenger: expensesRecipients,
            beitrag: "12,00",
            hasZahlungsfrist: "yes",
            zahlungsfrist: paymentDeadlineDate,
          },
          {
            art: expensesRecipients,
            zahlungsempfaenger:
              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam",
            beitrag: "12,00",
            hasZahlungsfrist: "yes",
            zahlungsfrist: paymentDeadlineDate,
          },
        ],
      };
      const { pdfValues, attachment } = pdfFillReducer({
        userData: mockuserData,
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillAusgaben],
      });

      expect(pdfValues.g21.value).toEqual("Siehe Anhang");
      expect(pdfValues.g31.value).toBeUndefined();
      expect(pdfValues.g5Raten1.value).toBeUndefined();
      expect(pdfValues.g7Zahlung1.value).toBeUndefined();

      expect(attachment[0].title).toEqual(AUSGABEN_ATTACHMENT_TITLE);

      expect(attachment[1].title).toBeDefined();
      expect(attachment.some((entry) => entry.title === "Ausgabe 1")).toBe(
        true,
      );
      expect(attachment.some((entry) => entry.title === "Ausgabe 2")).toBe(
        true,
      );
    });
  });
});

describe("besondere belastungen", () => {
  it("fills pdf field", () => {
    const { pdfValues } = pdfFillReducer({
      userData: {
        ausgabensituation: {
          pregnancy: CheckboxValue.on,
          singleParent: CheckboxValue.on,
          disability: CheckboxValue.off,
          medicalReasons: CheckboxValue.off,
        },
      },
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillAusgaben],
    });
    expect(pdfValues.g10Belastungen.value).toEqual(
      "Schwangerschaft, Alleinerziehend",
    );
  });

  test.each([
    [
      {
        pregnancy: CheckboxValue.on,
        singleParent: CheckboxValue.off,
        disability: CheckboxValue.off,
        medicalReasons: CheckboxValue.off,
      },
      [false, true],
    ],
    [
      {
        pregnancy: CheckboxValue.off,
        singleParent: CheckboxValue.off,
        disability: CheckboxValue.off,
        medicalReasons: CheckboxValue.off,
      },
      [true, false],
    ],
    [undefined, [false, false]],
  ] as const)(
    "sets besondereBelastung checkbox given %s",
    (ausgabensituation, expected) => {
      const { pdfValues } = pdfFillReducer({
        userData: { ausgabensituation },
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillAusgaben],
      });
      expect(pdfValues.g9SonstigeBelastungenN.value).toBe(expected[0]);
      expect(pdfValues.g9SonstigeBelastungenJ.value).toBe(expected[1]);
    },
  );
});
