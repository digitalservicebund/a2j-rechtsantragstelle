import { CheckboxValue } from "~/components/inputs/Checkbox";
import { type BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import {
  AUSGABEN_ATTACHMENT_TITLE,
  fillAusgaben,
} from "~/services/pdf/beratungshilfe/sections/G_ausgaben";
import { pdfFillReducer } from "~/services/pdf/prozesskostenhilfe/fillOutFunction";

const expensesRecipients = "ausgaben empfänger";
const paymentDeadlineDate = "12.12.2099";
describe("G_ausgaben", () => {
  it("fills ausgaben pdf fields when correct context is given", () => {
    const mockuserData: BeratungshilfeFormularContext = {
      hasAusgaben: "yes",
      ausgaben: [
        {
          art: "ausgaben art",
          zahlungsempfaenger: expensesRecipients,
          beitrag: "12,00",
          hasZahlungsfrist: "yes",
          zahlungsfrist: paymentDeadlineDate,
        },
      ],
      ausgabensituation: {
        pregnancy: CheckboxValue.on,
        singleParent: CheckboxValue.on,
        disability: CheckboxValue.off,
        medicalReasons: CheckboxValue.off,
      },
    };
    const { pdfValues } = pdfFillReducer({
      userData: mockuserData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillAusgaben],
    });

    expect(pdfValues.g1VerpflichtungenJ.value).toBe(true);
    expect(pdfValues.g9SonstigeBelastungenJ.value).toBe(true);
    expect(pdfValues.g21.value).toEqual("ausgaben art");
    expect(pdfValues.g31.value).toEqual(expensesRecipients);
    expect(pdfValues.g5Raten1.value).toEqual(paymentDeadlineDate);
    expect(pdfValues.g7Zahlung1.value).toEqual("12,00");
    expect(pdfValues.g10Belastungen.value).toEqual(
      "Schwangerschaft, Alleinerziehend",
    );
  });

  it("fills attachment when context count is greater than the available field", () => {
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
      ausgabensituation: {
        pregnancy: CheckboxValue.on,
        singleParent: CheckboxValue.on,
        disability: CheckboxValue.off,
        medicalReasons: CheckboxValue.off,
      },
    };
    const { pdfValues, attachment } = pdfFillReducer({
      userData: mockuserData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillAusgaben],
    });

    expect(pdfValues.g21.value).toEqual("Bitte im Anhang prüfen");
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
      ausgabensituation: {
        pregnancy: CheckboxValue.on,
        singleParent: CheckboxValue.on,
        disability: CheckboxValue.off,
        medicalReasons: CheckboxValue.off,
      },
    };
    const { pdfValues, attachment } = pdfFillReducer({
      userData: mockuserData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillAusgaben],
    });

    expect(pdfValues.g21.value).toEqual("Bitte im Anhang prüfen");
    expect(pdfValues.g31.value).toBeUndefined();
    expect(pdfValues.g5Raten1.value).toBeUndefined();
    expect(pdfValues.g7Zahlung1.value).toBeUndefined();

    expect(attachment[0].title).toEqual(AUSGABEN_ATTACHMENT_TITLE);

    expect(attachment[1].title).toBeDefined();
    expect(attachment.some((entry) => entry.title === "Ausgabe 1")).toBe(true);
    expect(attachment.some((entry) => entry.title === "Ausgabe 2")).toBe(true);
  });
});
