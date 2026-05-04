import { type LoaderFunctionArgs } from "react-router";
import { Result } from "true-myth";
import { type BankData } from "~/components/formElements/inputs/iban/bankNameFromIBAN";
import { loader } from "~/routes/api.banks.list";
import { validateCsrfSessionFormless } from "~/services/security/csrf/validatedSession.server";

vi.mock("~/services/security/csrf/validatedSession.server");
vi.mock("data/bankCodes/data.json", () => {
  return { default: [{ Bankleitzahl: 12345, Bezeichnung: "Testbank" }] };
});

describe("Banks API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a 403 if no CSRF token", async () => {
    await expect(
      loader({
        request: new Request("https://a2j.forever/banks"),
      } as LoaderFunctionArgs),
    ).rejects.toThrow();
  });

  it("returns bank data from bankCodes.json", async () => {
    vi.mocked(validateCsrfSessionFormless).mockResolvedValue(Result.ok());
    const response = await loader({
      request: new Request("https://a2j.forever/banks"),
    } as LoaderFunctionArgs);

    const bankData: BankData = await response.json();
    expect(bankData).toEqual({ 12345: "Testbank" });
  });
});
