import { z } from "zod";
import { validateZahlungsklageReferenzzeichen } from "~/domains/geldEinklagen/anwaltschaft/services/validation/validateZahlungsklageReferenzzeichen";
import { translations } from "~/services/translations/translations";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

const schema = z.object({
  zahlungsklageBezeichnung: stringOptionalSchema,
  zahlungsklageNummer: stringOptionalSchema,
});

describe("validateZahlungsklageReferenzzeichen", () => {
  it("Should return an error if bezeichnung is given but no number", () => {
    const result = validateZahlungsklageReferenzzeichen()(schema).safeParse({
      zahlungsklageBezeichnung: "Bezeichnung",
    });
    expect(result.error?.issues.length).toBe(2);
    expect(result.error?.issues[0].message).toBe(
      translations.geldEinklagenAnwaltschaft.zahlungsklageReferenzzeichenError
        .de,
    );
  });

  it("Should return an error if number is given but no bezeichnung", () => {
    const result = validateZahlungsklageReferenzzeichen()(schema).safeParse({
      zahlungsklageNummer: "12345",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(2);
    expect(result.error?.issues[1].message).toBe(
      translations.geldEinklagenAnwaltschaft.zahlungsklageReferenzzeichenError
        .de,
    );
  });

  it("Should return no errors if both bezeichnung and number are given", () => {
    const result = validateZahlungsklageReferenzzeichen()(schema).safeParse({
      zahlungsklageBezeichnung: "Bezeichnung",
      zahlungsklageNummer: "12345",
    });
    expect(result.success).toBe(true);
  });
});
