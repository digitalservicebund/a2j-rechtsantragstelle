import z from "zod";
import { geldEinklagenKlageErstellenPages } from "~/domains/geldEinklagen/formular/klage-erstellen/pages";
import { validatePersonenAuswahl } from "../validatePersonenAuswahl";
import { pick } from "lodash";

const baseSchema = z.object(
  pick(
    geldEinklagenKlageErstellenPages
      .begruendungBeschreibungAbschnitteBeweisPersonAuswahl.pageSchema,
    [
      "abschnitte#personIdAsBeklagte",
      "abschnitte#personIdAsKlagende",
      "abschnitte#personen#personId",
      "abschnitte#personen#personAuswahl",
    ],
  ),
);

const validatorPersonenAuswahl = validatePersonenAuswahl(baseSchema);

describe("validatePersonenAuswahl", () => {
  it("should not return an error if the personAuswahl is anotherPerson", () => {
    expect(
      z.validate(validatorPersonenAuswahl, {
        "abschnitte#personen#personAuswahl": "anotherPerson",
      }),
    ).toBe(true);
  });

  it("should return an error if the personAuswahl is klagende and person id is the different as abschnitte#personIdAsKlagende", () => {
    const result = validatorPersonenAuswahl.safeParse({
      "abschnitte#personen#personAuswahl": "klagende",
      "abschnitte#personIdAsKlagende": "123",
      "abschnitte#personen#personId": "456",
    });

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("abschnitte#personen#personAuswahl"),
      ),
    ).toBe(true);
  });

  it("should not return an error if the personAuswahl is klagende and person id is same as abschnitte#personIdAsKlagende", () => {
    expect(
      z.validate(validatorPersonenAuswahl, {
        "abschnitte#personen#personAuswahl": "klagende",
        "abschnitte#personIdAsKlagende": "123",
        "abschnitte#personen#personId": "123",
      }),
    ).toBe(true);
  });

  it("should return an error if the personAuswahl is beklagte and person id is the different as abschnitte#personIdAsBeklagte", () => {
    const result = validatorPersonenAuswahl.safeParse({
      "abschnitte#personen#personAuswahl": "beklagte",
      "abschnitte#personIdAsBeklagte": "456",
      "abschnitte#personen#personId": "123",
    });

    expect(result.success).toBe(false);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("abschnitte#personen#personAuswahl"),
      ),
    ).toBe(true);
  });

  it("should not return an error if the personAuswahl is beklagte and person id is same as abschnitte#personIdAsBeklagte", () => {
    expect(
      z.validate(validatorPersonenAuswahl, {
        "abschnitte#personen#personAuswahl": "beklagte",
        "abschnitte#personIdAsBeklagte": "123",
        "abschnitte#personen#personId": "123",
      }),
    ).toBe(true);
  });
});
