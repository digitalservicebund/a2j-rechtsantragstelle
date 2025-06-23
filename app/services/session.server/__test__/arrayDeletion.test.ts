import { createSession } from "react-router";
import { updateSession } from "~/services/session.server";
import { deleteArrayItem, getArrayDataFromFormData } from "../arrayDeletion";

vi.mock("~/services/session.server", () => ({
  updateSession: vi.fn(),
}));

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
    });
  });

  describe("deleteArrayItem", () => {
    it("should return an error if the array is not found in the session", () => {
      const mockSession = createSession();

      const result = deleteArrayItem("nonExistentArray", 0, mockSession);
      expect(result.isErr).toBe(true);
      expect(result.isErr ? result.error.message : undefined).toContain(
        "Requested field is not an array",
      );
    });

    it("should return an error if the array name is not an array", () => {
      const mockSession = createSession();
      mockSession.set("arrayTest", "not an array");

      const result = deleteArrayItem("arrayTest", 0, mockSession);
      expect(result.isErr).toBe(true);
      expect(result.isErr ? result.error.message : undefined).toContain(
        "Requested field is not an array",
      );
    });

    it("should return an error if the index is not in the array", () => {
      const mockSession = createSession();
      const testArray = ["item1", "item2"];
      mockSession.set("arrayTest", testArray);

      const result = deleteArrayItem("arrayTest", 2, mockSession);
      expect(result.isErr).toBe(true);
      expect(result.isErr ? result.error.message : undefined).toContain(
        "Requested array isn't long enough. Deletion request at index 2, but array is only of length 2.",
      );
    });

    it("should return ok and call the updateSession with the correct parameters", () => {
      const mockSession = createSession();
      const testArray = ["item1", "item2"];
      mockSession.set("arrayTest", testArray);

      const result = deleteArrayItem("arrayTest", 1, mockSession);
      expect(result.isOk).toBe(true);
      expect(updateSession).toHaveBeenCalledTimes(1);
      expect(updateSession).toHaveBeenCalledWith(mockSession, {
        arrayTest: ["item1"],
      });
    });
  });
});
