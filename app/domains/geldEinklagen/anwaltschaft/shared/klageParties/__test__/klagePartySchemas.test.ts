import { getGesetzlicheVertretungArtLabel } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import {
  naturalPersonGesetzlicheVertretungArt,
  organizationSchema,
} from "../../klageParties/klagePartySchemas";

describe("gesetzliche Vertretung art", () => {
  it.each([
    {
      schema: naturalPersonGesetzlicheVertretungArt,
      labels: [
        "Betreuer / Betreuerin",
        "Elternteil",
        "Pfleger / Pflegerin",
        "Vormund / Vormundin",
        "Vorläufiger Betreuer / Vorläufige Betreuerin",
        "Sonstige gesetzliche Vertretung",
      ],
    },
    {
      schema: organizationSchema.shape.orgVertretungArt,
      labels: [
        "Bürgermeister / Bürgermeisterin",
        "Geschäftsführer / Geschäftsführerin",
        "Geschäftsführender Direktor / Geschäftsführende Direktorin",
        "Geschäftsführender Gesellschafter / Geschäftsführende Gesellschafterin",
        "Gesellschafter / Gesellschafterin",
        "Mitglied einer BGB Gesellschaft als gesetzliche Vertretung",
        "Partner / Partnerin",
        "Vorstand / Vorständin",
        "Vorstandsvorsitzender / Vorstandsvorsitzende",
        "Sonstige organschaftliche Vertretung HRB",
        "Sonstige gesetzliche Vertretung BGB",
        "Sonstige gesetzliche Vertretung",
      ],
    },
  ])(
    "uses kebab-case values and preserves display labels (%#)",
    ({ schema, labels }) => {
      expect(schema.options.map(getGesetzlicheVertretungArtLabel)).toEqual(
        labels,
      );
      for (const value of schema.options) {
        expect(value).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
        expect(schema.safeParse(value).success).toBe(true);
      }
      for (const label of labels) {
        expect(schema.safeParse(label).success).toBe(false);
      }
    },
  );

  it("returns an empty label for an unset value", () => {
    expect(getGesetzlicheVertretungArtLabel()).toBe("");
  });
});
