import { createSession } from "react-router";
import { deleteArrayItem, getArrayDataFromFormData } from "../arrayDeletion";

describe("arrayDeletion", () => {
  describe("getArrayDataFromFormData", () => {
    it("should return an error if pathnameArrayItem is not defined in the formData", () => {
      const formData = new FormData();
      const result = getArrayDataFromFormData(formData);
      expect(result.isErr).toBe(true);
      expect(result.isErr ? result.error.message : undefined).toBe(
        "Pathname array item invalid",
      );
    });

    it("should return an error if index is not a number", () => {
      const formData = new FormData();
      formData.append(
        "pathnameArrayItem",
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
      );
      formData.append("kinder", "notANumber");
      const result = getArrayDataFromFormData(formData);
      expect(result.isErr).toBe(true);
      expect(result.isErr ? result.error.message : undefined).toContain(
        "Invalided index. Deletion request for",
      );
    });

    it("should return correct data for valid input", () => {
      const formData = new FormData();
      formData.append(
        "pathnameArrayItem",
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
      );
      formData.append("kinder", "0");
      const result = getArrayDataFromFormData(formData);
      expect(result.isOk).toBe(true);
      expect(result.isOk ? result.value.arrayName : undefined).toBe("kinder");
      expect(result.isOk ? result.value.index : undefined).toBe(0);
      expect(result.isOk ? result.value.pathname : undefined).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
      );
    });
  });

  describe("deleteArrayItem", () => {
    it("should return an error if the array is not found in the session", () => {
      const mockSession = createSession();

      const result = deleteArrayItem("nonExistentArray", 0, mockSession);
      expect(result.isErr).toBe(true);
      expect(result.isErr ? result.error.message : undefined).toEqual(
        "Deletion failed: 'nonExistentArray' is not an array.",
      );
    });

    it("should return an error if the array name is not an array", () => {
      const mockSession = createSession();
      mockSession.set("arrayTest", "not an array");

      const result = deleteArrayItem("arrayTest", 0, mockSession);
      expect(result.isErr).toBe(true);
      expect(result.isErr ? result.error.message : undefined).toEqual(
        "Deletion failed: 'arrayTest' is not an array.",
      );
    });

    it("should return an error if the index is not in the array", () => {
      const mockSession = createSession();
      const testArray = ["item1", "item2"];
      mockSession.set("arrayTest", testArray);

      const result = deleteArrayItem("arrayTest", 2, mockSession);
      expect(result.isErr).toBe(true);
      expect(result.isErr ? result.error.message : undefined).toEqual(
        "Requested array isn't long enough. Deletion request at index 2, but array is only of length 2.",
      );
    });

    it("should return ok and call the updateSession with the correct parameters", () => {
      const mockSession = createSession();
      const testArray = ["item1", "item2"];
      mockSession.set("arrayTest", testArray);

      const result = deleteArrayItem("arrayTest", 1, mockSession);
      expect(result.isOk).toBe(true);
      expect(mockSession.get("arrayTest")).toEqual(["item1"]);
    });

    it("should delete a nested array item using arrayIndexes", () => {
      const mockSession = createSession();
      mockSession.set("elternteile", [
        {
          name: "Parent 1",
          kinder: [{ name: "Child A" }, { name: "Child B" }],
        },
        { name: "Parent 2", kinder: [{ name: "Child C" }] },
      ]);

      const result = deleteArrayItem("elternteile#kinder", 0, mockSession, [0]);
      expect(result.isOk).toBe(true);
      expect(mockSession.get("elternteile")).toEqual([
        { name: "Parent 1", kinder: [{ name: "Child B" }] },
        { name: "Parent 2", kinder: [{ name: "Child C" }] },
      ]);
    });

    it("cascades deletion of kinder when an elternteil is deleted", () => {
      const mockSession = createSession();
      mockSession.set("elternteile", [
        {
          name: "Maria",
          isAlive: "no",
          hatteKinder: "yes",
          kinder: [{ name: "Kind A" }, { name: "Kind B" }],
        },
        {
          name: "Hans",
          isAlive: "no",
          hatteKinder: "yes",
          kinder: [{ name: "Kind C" }],
        },
      ]);

      const result = deleteArrayItem("elternteile", 0, mockSession);
      expect(result.isOk).toBe(true);
      const remaining = mockSession.get("elternteile") as Array<{
        name: string;
        kinder?: unknown[];
      }>;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].name).toBe("Hans");
      expect(remaining[0].kinder).toEqual([{ name: "Kind C" }]);
    });

    it("leaves other parents' children untouched when deleting the last elternteil", () => {
      const mockSession = createSession();
      mockSession.set("elternteile", [
        {
          name: "Maria",
          isAlive: "no",
          hatteKinder: "yes",
          kinder: [{ name: "Kind A" }],
        },
        {
          name: "Hans",
          isAlive: "no",
          hatteKinder: "yes",
          kinder: [{ name: "Kind B" }],
        },
      ]);

      const result = deleteArrayItem("elternteile", 1, mockSession);
      expect(result.isOk).toBe(true);
      const remaining = mockSession.get("elternteile") as Array<{
        name: string;
        kinder?: unknown[];
      }>;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].name).toBe("Maria");
      expect(remaining[0].kinder).toEqual([{ name: "Kind A" }]);
    });
  });
});
