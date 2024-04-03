/**
 * @jest-environment node
 */

import { CheckboxValue } from "~/components/inputs/Checkbox";
import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { createAttachment } from "~/services/pdf/beratungshilfe/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { fillAusgaben } from "~/services/pdf/beratungshilfe/sections/G_ausgaben";

describe("G_ausgaben", () => {
  it("should fill ausgaben pdf fields when correct context is given", async () => {
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
        singleParent: CheckboxValue.off,
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
  });
});
