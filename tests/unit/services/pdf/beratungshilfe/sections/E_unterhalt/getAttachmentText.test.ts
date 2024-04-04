import { getAttachmentText } from "~/services/pdf/beratungshilfe/sections/E_unterhalt/getAttachmentText";
import type { UnterhaltPdfField } from "~/services/pdf/beratungshilfe/sections/E_unterhalt/unterhaltPdfField";

describe("getAttachmentText", () => {
  it("it should return the correct text for attachment of the kid", () => {
    const mockedGetListKidUnterhaltPdfField: UnterhaltPdfField[] = [
      {
        name: "Donald Kid",
        familienverhaeltnis: "Mein Kind",
        unterhaltSumme: "1000",
        hatEinnahmen: false,
        geburtsdatum: "10.10.2000",
      },
    ];

    const actual = getAttachmentText(mockedGetListKidUnterhaltPdfField, []);

    expect(actual).toContain(
      "Kinder:\n\n" +
        "Kind 1:\n" +
        "Name: Donald Kid\n" +
        "Geburtsdatum: 10.10.2000\n" +
        "Monatliche Unterhaltszahlungen: 1000 €\n" +
        "Gemeinsame Wohnung: Nein\n",
    );
  });

  it("it should return the correct text for attachment of the person", () => {
    const mockedGetListPersonUnterhaltPdfField: UnterhaltPdfField[] = [
      {
        name: "Donald Duck",
        familienverhaeltnis: "Partner:in",
        unterhaltSumme: "1000",
        hatEinnahmen: true,
        lebenZusammen: true,
        einnahmenSumme: "100",
      },
    ];

    const actual = getAttachmentText([], mockedGetListPersonUnterhaltPdfField);

    expect(actual).toContain(
      "\n\nUnterhaltszahlungen für andere Angehörige\n\n" +
        "Person 1:\n" +
        "Name: Donald Duck\n" +
        "Geburtsdatum: \n" +
        "Eigene monatlichen Einnahmen: 100 €\n" +
        "Familienverhältnis: Partner:in\n" +
        "Monatliche Unterhaltszahlungen: 1000 €\n" +
        "Gemeinsame Wohnung: Ja\n",
    );
  });
});
