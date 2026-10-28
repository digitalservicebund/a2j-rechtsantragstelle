import { prozessbevollmaechtigteArraySchema } from "../prozessbevollmaechtigteSchemas";
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
    { ...gesellschaft, isProzessbevollmaechtigt: undefined },
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
