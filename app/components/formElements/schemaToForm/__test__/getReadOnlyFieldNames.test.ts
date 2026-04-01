import { getReadOnlyFields } from "~/domains/pageSchemas";
import { getReadOnlyFieldNames } from "../getReadOnlyFieldNames";

vi.mock("~/domains/pageSchemas");

const NOT_EXISTING_PATHNAME = "/non-existing-pathname";
const EXISTING_PATHNAME = "/klage-erstellen/beklagte-person/anschrift";

vi.mocked(getReadOnlyFields).mockImplementation((pathname) => {
  if (pathname !== EXISTING_PATHNAME) return undefined;

  if (pathname === EXISTING_PATHNAME) {
    return {
      fields: ["beklagtePlz", "beklagteOrt"],
      shouldMakeReadOnly: (userData: any) =>
        userData.beklagteStatePrefilled === "prefilled",
    };
  }

  return undefined;
});

describe("getReadOnlyFieldNames", () => {
  it("should return an empty array if there are no read-only fields for the given pathname", () => {
    const result = getReadOnlyFieldNames(NOT_EXISTING_PATHNAME, {
      beklagteStatePrefilled: "unfilled",
    });

    expect(result).toEqual([]);
  });

  it("should return the field names if the shouldMakeReadOnly function returns true", () => {
    const result = getReadOnlyFieldNames(EXISTING_PATHNAME, {
      beklagteStatePrefilled: "prefilled",
    });

    expect(result).toEqual(["beklagtePlz", "beklagteOrt"]);
  });

  it("should return an empty array if the shouldMakeReadOnly function returns false", () => {
    const result = getReadOnlyFieldNames(EXISTING_PATHNAME, {
      beklagteStatePrefilled: "unfilled",
    });

    expect(result).toEqual([]);
  });
});
