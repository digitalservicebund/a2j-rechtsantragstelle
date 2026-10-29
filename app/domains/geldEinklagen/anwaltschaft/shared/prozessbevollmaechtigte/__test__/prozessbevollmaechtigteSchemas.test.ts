import omit from "lodash/omit";
import {
  type Prozessbevollmaechtigte,
  prozessbevollmaechtigteArraySchema,
} from "../prozessbevollmaechtigteSchemas";
import { einzelkanzlei, gesellschaft } from "./fixtures";

describe("prozessbevollmaechtigte schemas", () => {
  it.each([einzelkanzlei, gesellschaft])(
    "accepts a single entry of either type",
    (item) => {
      expect(prozessbevollmaechtigteArraySchema.parse([item])).toEqual([item]);
    },
  );

  it("accepts no representative", () => {
    expect(prozessbevollmaechtigteArraySchema.parse([])).toEqual([]);
  });

  it.each(["on", "off"] as const)(
    "accepts a company with checkbox value %j",
    (isProzessbevollmaechtigt) => {
      let item: Prozessbevollmaechtigte[number];
      if (
        isProzessbevollmaechtigt === "off" ||
        isProzessbevollmaechtigt === undefined
      ) {
        item = {
          ...omit(gesellschaft, "signaturangaben"),
          isProzessbevollmaechtigt,
          ["prozessbevollmaechtigte-personen"]: [
            {
              anrede: "",
              titel: "",
              vorname: "Vorname",
              nachname: "Nachname",
              namedInSignature: "off",
              berufsbezeichnung: "",
              telefonnummer: "",
              email: "",
            },
          ],
        };
      } else {
        item = {
          ...gesellschaft,
          isProzessbevollmaechtigt: isProzessbevollmaechtigt,
        };
      }
      expect(prozessbevollmaechtigteArraySchema.parse([item])).toEqual([item]);
    },
  );

  it.each([einzelkanzlei, gesellschaft])(
    "allows contact details and business reference to be omitted",
    (item) => {
      expect(
        prozessbevollmaechtigteArraySchema.safeParse([
          {
            ...item,
            geschaeftszeichen: undefined,
            telefonnummer: undefined,
            email: undefined,
          },
        ]).success,
      ).toBe(true);
    },
  );

  it.each([
    [einzelkanzlei, gesellschaft],
    [einzelkanzlei, einzelkanzlei],
    [gesellschaft, gesellschaft],
  ])("rejects multiple entries regardless of type: %j", (...items) => {
    expect(prozessbevollmaechtigteArraySchema.safeParse(items).success).toBe(
      false,
    );
  });

  it.each([
    { ...einzelkanzlei, vorname: "" },
    { ...gesellschaft, name: "" },
    { ...einzelkanzlei, name: "" },
    { ...gesellschaft, isProzessbevollmaechtigt: "invalid" },
    { ...einzelkanzlei, email: "invalid" },
    { ...gesellschaft, telefonnummer: "invalid" },
    { ...einzelkanzlei, strasse: "" },
    { ...gesellschaft, land: "" },
    { ...einzelkanzlei, type: "natuerliche-person" },
    { ...gesellschaft, type: "organisation" },
  ])("rejects incomplete or wrong-type data: %j", (item) => {
    expect(prozessbevollmaechtigteArraySchema.safeParse([item]).success).toBe(
      false,
    );
  });
});
