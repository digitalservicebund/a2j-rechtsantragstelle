import { type LoaderFunctionArgs } from "react-router";
import { Result } from "true-myth";
import { loader } from "~/routes/api.countries.list";
import { validateCsrfSessionFormless } from "~/services/security/csrf/validatedSession.server";

vi.mock("~/services/security/csrf/validatedSession.server");
vi.mock(
  "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage",
  () => ({
    Staaten: {
      Deutschland: "021",
    },
  }),
);

describe("Countries API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a 403 if no CSRF token", async () => {
    await expect(
      loader({
        request: new Request("https://a2j.forever/countries"),
      } as LoaderFunctionArgs),
    ).rejects.toThrow(expect.anything());
  });

  it("returns country data", async () => {
    vi.mocked(validateCsrfSessionFormless).mockResolvedValue(Result.ok());
    const response = await loader({
      request: new Request("https://a2j.forever/countries"),
    } as LoaderFunctionArgs);

    const countryData = await response.json();
    expect(countryData).toEqual([
      {
        label: "Deutschland",
        value: "Deutschland",
      },
    ]);
  });
});
