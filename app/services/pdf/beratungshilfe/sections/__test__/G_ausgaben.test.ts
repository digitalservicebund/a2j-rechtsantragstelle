import { CheckboxValue } from "~/components/inputs/Checkbox";
import { type BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { createAttachment } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import {
  AUSGABEN_ATTACHMENT_TITLE,
  fillAusgaben,
} from "~/services/pdf/beratungshilfe/sections/G_ausgaben";

const expensesRecipients = "ausgaben empfänger";
const paymentDeadlineDate = "12.12.2099";
describe("G_ausgaben", () => {
  it("fills ausgaben pdf fields when correct context is given", () => {
    const mockContext: BeratungshilfeFormularContext = {
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
    const attachment = createAttachment();
    const pdfFields = getBeratungshilfeParameters();

    fillAusgaben(attachment, pdfFields, mockContext);

    expect(pdfFields.g1VerpflichtungenJ.value).toBe(true);
    expect(pdfFields.g9SonstigeBelastungenJ.value).toBe(true);
    expect(pdfFields.g21.value).toEqual("ausgaben art");
    expect(pdfFields.g31.value).toEqual(expensesRecipients);
    expect(pdfFields.g5Raten1.value).toEqual(paymentDeadlineDate);
    expect(pdfFields.g7Zahlung1.value).toEqual("12,00");
    expect(pdfFields.g10Belastungen.value).toEqual(
      "Schwangerschaft, Alleinerziehend",
    );
  });

  it("fills attachment when context count is greater than the available field", () => {
    const mockContext: BeratungshilfeFormularContext = {
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
    const attachment = createAttachment();
    const pdfFields = getBeratungshilfeParameters();

    fillAusgaben(attachment, pdfFields, mockContext);

    expect(pdfFields.g21.value).toEqual("Bitte im Anhang prüfen");
    expect(pdfFields.g31.value).toBeUndefined();
    expect(pdfFields.g5Raten1.value).toBeUndefined();
    expect(pdfFields.g7Zahlung1.value).toBeUndefined();
    expect(attachment[0].title).toEqual(AUSGABEN_ATTACHMENT_TITLE);
    expect(attachment[1].title).toBeDefined();
  });

  it("fills attachment when char is greater than max char of the field", () => {
    const mockContext: BeratungshilfeFormularContext = {
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
    const attachment = createAttachment();
    const pdfFields = getBeratungshilfeParameters();

    fillAusgaben(attachment, pdfFields, mockContext);

    expect(pdfFields.g21.value).toEqual("Bitte im Anhang prüfen");
    expect(pdfFields.g31.value).toBeUndefined();
    expect(pdfFields.g5Raten1.value).toBeUndefined();
    expect(pdfFields.g7Zahlung1.value).toBeUndefined();

    expect(attachment[0].title).toEqual(AUSGABEN_ATTACHMENT_TITLE);

    expect(attachment[1].title).toBeDefined();
    expect(attachment.some((entry) => entry.title === "Ausgabe 1")).toBe(true);
    expect(attachment.some((entry) => entry.title === "Ausgabe 2")).toBe(true);
  });
});
