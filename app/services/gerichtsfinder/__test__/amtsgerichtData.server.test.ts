import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";

describe("amtsGerichtData Helpers", () => {
  describe("findCourt", () => {
    it("should return the default court if no valid street slug is passed", () => {
      expect(
        findCourt({ zipCode: "20457", streetSlug: "default" }),
      ).toHaveProperty("BEZEICHNUNG", "Amtsgericht Hamburg");
      expect(
        findCourt({ zipCode: "20457", streetSlug: undefined }),
      ).toHaveProperty("BEZEICHNUNG", "Amtsgericht Hamburg");
    });

    it("should return undefined if no valid court is found", () => {
      expect(
        findCourt({ zipCode: "12345", streetSlug: "default" }),
      ).toBeUndefined();
    });

    it("should return the correct court if a valid street slug is passed", () => {
      expect(
        findCourt({
          zipCode: "20457",
          streetSlug: "kluetjenfelder_str.",
          houseNumber: "1",
        }),
      ).toHaveProperty("STR_HNR", "Buxtehuder Straße 9");
      expect(
        findCourt({
          zipCode: "20457",
          streetSlug: "kluetjenfelder_str.",
          houseNumber: "12",
        }),
      ).toHaveProperty("STR_HNR", "Sievekingplatz 1");
    });
  });
});
