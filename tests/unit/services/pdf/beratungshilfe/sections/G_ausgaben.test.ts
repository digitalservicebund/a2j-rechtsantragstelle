/**
 * @jest-environment node
 */

import { CheckboxValue } from "~/components/inputs/Checkbox";
import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { createAttachment } from "~/services/pdf/beratungshilfe/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import {
  AUSGABEN_ATTACHMENT_TITLE,
  fillAusgaben,
} from "~/services/pdf/beratungshilfe/sections/G_ausgaben";

describe("G_ausgaben", () => {
  it("fills ausgaben pdf fields when correct context is given", async () => {
    const mockContext: BeratungshilfeFormularContext = {
      ausgaben: [
        {
          art: "ausgaben art",
          zahlungsempfaenger: "ausgaben empfänger",
          beitrag: "12,00",
          hasZahlungsfrist: "yes",
          zahlungsfrist: "12.12.2099",
        },
      ],
      ausgabensituation: {
        pregnancy: CheckboxValue.on,
        singleParent: CheckboxValue.on,
        disability: CheckboxValue.off,
        medicalReasons: CheckboxValue.off,
      },
    };
    const attachment = createAttachment(mockContext);
    const pdfFields = await getBeratungshilfeParameters();

    fillAusgaben(attachment, pdfFields, mockContext);

    expect(pdfFields.g21.value).toEqual("ausgaben art");
    expect(pdfFields.g31.value).toEqual("ausgaben empfänger");
    expect(pdfFields.g5Raten1.value).toEqual("12.12.2099");
    expect(pdfFields.g7Zahlung1.value).toEqual("12,00");
    expect(pdfFields.g10Belastungen.value).toEqual(
      "Schwangerschaft, Alleinerziehend",
    );
  });

  it("fills attachment when context count is greater than the available field", async () => {
    const mockContext: BeratungshilfeFormularContext = {
      ausgaben: [
        {
          art: "ausgaben art 1",
          zahlungsempfaenger: "ausgaben empfänger",
          beitrag: "12,00",
          hasZahlungsfrist: "yes",
          zahlungsfrist: "12.12.2099",
        },
        {
          art: "ausgaben art 2",
          zahlungsempfaenger: "ausgaben empfänger",
          beitrag: "12,00",
          hasZahlungsfrist: "yes",
          zahlungsfrist: "12.12.2099",
        },
        {
          art: "ausgaben art 3",
          zahlungsempfaenger: "ausgaben empfänger",
          beitrag: "12,00",
          hasZahlungsfrist: "yes",
          zahlungsfrist: "12.12.2099",
        },
        {
          art: "ausgaben art 4",
          zahlungsempfaenger: "ausgaben empfänger",
          beitrag: "12,00",
          hasZahlungsfrist: "yes",
          zahlungsfrist: "12.12.2099",
        },
        {
          art: "ausgaben art 5",
          zahlungsempfaenger: "ausgaben empfänger",
          beitrag: "12,00",
          hasZahlungsfrist: "yes",
          zahlungsfrist: "12.12.2099",
        },
      ],
      ausgabensituation: {
        pregnancy: CheckboxValue.on,
        singleParent: CheckboxValue.on,
        disability: CheckboxValue.off,
        medicalReasons: CheckboxValue.off,
      },
    };
    const attachment = createAttachment(mockContext);
    const pdfFields = await getBeratungshilfeParameters();

    fillAusgaben(attachment, pdfFields, mockContext);

    expect(pdfFields.g21.value).toEqual("Bitte im Anhang prüfen");
    expect(pdfFields.g31.value).toBeUndefined();
    expect(pdfFields.g5Raten1.value).toBeUndefined();
    expect(pdfFields.g7Zahlung1.value).toBeUndefined();
    expect(pdfFields.g10Belastungen.value).toBeUndefined();

    expect(attachment.descriptions[1].title).toEqual(AUSGABEN_ATTACHMENT_TITLE);

    const ausgabenAttachmentRegex = /Ausgabe\s[1-5]:/gs;

    const hasMatches = ausgabenAttachmentRegex.test(
      attachment.descriptions[1].text,
    );

    expect(hasMatches).toBeTruthy();
  });

  it("fills attachment when char is greater than max char of the field", async () => {
    const mockContext: BeratungshilfeFormularContext = {
      ausgaben: [
        {
          art: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam",
          zahlungsempfaenger: "ausgaben empfänger",
          beitrag: "12,00",
          hasZahlungsfrist: "yes",
          zahlungsfrist: "12.12.2099",
        },
      ],
      ausgabensituation: {
        pregnancy: CheckboxValue.on,
        singleParent: CheckboxValue.on,
        disability: CheckboxValue.off,
        medicalReasons: CheckboxValue.off,
      },
    };
    const attachment = createAttachment(mockContext);
    const pdfFields = await getBeratungshilfeParameters();

    fillAusgaben(attachment, pdfFields, mockContext);

    expect(pdfFields.g21.value).toEqual("Bitte im Anhang prüfen");
    expect(pdfFields.g31.value).toBeUndefined();
    expect(pdfFields.g5Raten1.value).toBeUndefined();
    expect(pdfFields.g7Zahlung1.value).toBeUndefined();
    expect(pdfFields.g10Belastungen.value).toBeUndefined();

    expect(attachment.descriptions[1].title).toEqual(AUSGABEN_ATTACHMENT_TITLE);

    const ausgabenAttachmentRegex = /Ausgabe 1:/gs;

    const hasMatches = ausgabenAttachmentRegex.test(
      attachment.descriptions[1].text,
    );

    expect(hasMatches).toBeTruthy();
  });
});
