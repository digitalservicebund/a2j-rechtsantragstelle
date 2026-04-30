import { type LoaderFunctionArgs } from "react-router";
import { Result } from "true-myth";
import { type ZodError } from "zod";
import {
  bankDataSchema,
  type BankData,
} from "~/components/kern/formElements/input/IbanInput";
import { loader } from "~/routes/api.banks.list";
import { validateCsrfSessionFormless } from "~/services/security/csrf/validatedSession.server";

vi.mock("~/services/security/csrf/validatedSession.server");
vi.mock("data/bankCodes.json");
vi.mock("~/components/kern/formElements/input/IbanInput");

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

  it("returns a parsing error, in case the bank codes list cannot be validated", async () => {
    vi.mocked(validateCsrfSessionFormless).mockResolvedValue(Result.ok());
    vi.mocked(bankDataSchema.safeParseAsync).mockResolvedValue({
      success: false,
      error: { message: "Bank codes list is not valid" } as ZodError<
        Record<number, string>
      >,
    });
    await expect(
      loader({
        request: new Request("https://a2j.forever/banks"),
      } as LoaderFunctionArgs),
    ).rejects.toThrow();
  });

  it("returns bank data from bankCodes.json", async () => {
    vi.mocked(validateCsrfSessionFormless).mockResolvedValue(Result.ok());
    vi.mocked(bankDataSchema.safeParseAsync).mockResolvedValue({
      success: true,
      data: { 12345: "Testbank" },
    });
    const response = await loader({
      request: new Request("https://a2j.forever/banks"),
    } as LoaderFunctionArgs);

    const bankData: BankData = await response.json();
    expect(bankData).toEqual({ 12345: "Testbank" });
  });
});
