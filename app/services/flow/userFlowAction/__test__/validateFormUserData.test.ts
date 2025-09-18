import { getMigrationData } from "~/services/session.server/getMigrationData";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { validateFormUserData } from "../validateFormUserData";

vi.mock("~/services/validation/validateFormData.server");
vi.mock("~/services/session.server/getMigrationData");

const mockFormData = new FormData();
const mockPathname =
  "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht";

describe("validateFormUserData", () => {
  it("should return an error when form data validation fails", async () => {
    vi.mocked(validateFormData).mockResolvedValue({
      error: { fieldErrors: { name: "wrongName" } },
      submittedData: { name: "John Doe" },
      data: undefined,
    });

    const result = await validateFormUserData(mockFormData, mockPathname, null);
    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error : undefined).toEqual({
      error: { fieldErrors: { name: "wrongName" } },
      submittedData: { name: "John Doe" },
    });
  });

  it("should return success when form data is valid", async () => {
    vi.mocked(validateFormData).mockResolvedValue({
      error: undefined,
      data: { name: "John Doe" },
      submittedData: { name: "John Doe" },
    });

    vi.mocked(getMigrationData).mockResolvedValue({
      name: "John Migration Doe",
    });

    const result = await validateFormUserData(mockFormData, mockPathname, null);
    expect(result.isOk).toBe(true);
    expect(result.isOk ? result.value : undefined).toEqual({
      userData: { name: "John Doe" },
      migrationData: { name: "John Migration Doe" },
    });
  });
});
