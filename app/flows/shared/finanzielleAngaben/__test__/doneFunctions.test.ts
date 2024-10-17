import type { z } from "zod";
import type { kinderArraySchema } from "~/flows/shared/finanzielleAngaben/context";
import { childDone } from "~/flows/shared/finanzielleAngaben/doneFunctions";

const mockCompletedChild: z.infer<typeof kinderArraySchema>[0] = {
  vorname: "Child",
  nachname: "Childson",
  geburtsdatum: "01.01.2020",
  wohnortBeiAntragsteller: "yes",
  eigeneEinnahmen: "yes",
  einnahmen: "100",
  unterhalt: "yes",
  unterhaltsSumme: "100",
};

describe("shared finanielle angaben doneFunctions", () => {
  describe("childDone", () => {
    it("should return false when passed an undefined child", () => {
      expect(childDone(undefined)).toBe(false);
    });

    it("should return false if the name and birth date are missing", () => {
      expect(childDone({ ...mockCompletedChild, vorname: "" })).toBe(false);
      expect(childDone({ ...mockCompletedChild, nachname: "" })).toBe(false);
      expect(childDone({ ...mockCompletedChild, geburtsdatum: "" })).toBe(
        false,
      );
    });

    it("should return false if the child lives with the antragstellende Person and has income they haven't entered", () => {
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "yes",
          einnahmen: "",
        }),
      ).toBe(false);
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "partially",
          eigeneEinnahmen: "yes",
          einnahmen: "",
        }),
      ).toBe(false);
    });

    it("should return false if the child does not live with the antragstellende Person and receives support they haven't entered", () => {
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "no",
          unterhalt: "yes",
          unterhaltsSumme: "",
        }),
      ).toBe(false);
    });

    it("should return true when the user has added all required child fields", () => {
      expect(childDone(mockCompletedChild)).toBe(true);
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "no",
          unterhalt: "no",
        }),
      ).toBe(true);
      expect(
        childDone({ ...mockCompletedChild, wohnortBeiAntragsteller: "no" }),
      ).toBe(true);
      expect(childDone({ ...mockCompletedChild, eigeneEinnahmen: "no" })).toBe(
        true,
      );
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "partially",
        }),
      ).toBe(true);
      expect(
        childDone({
          ...mockCompletedChild,
          wohnortBeiAntragsteller: "partially",
          eigeneEinnahmen: "no",
        }),
      ).toBe(true);
    });
  });
});
