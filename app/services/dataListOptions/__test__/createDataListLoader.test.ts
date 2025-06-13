import type { LoaderFunctionArgs } from "react-router";
import { Result, Unit } from "true-myth";
import { createDataListLoader } from "~/services/dataListOptions//createDataListLoader";
import { getDataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { logWarning } from "~/services/logging";
import { validateCsrfSessionFormless } from "~/services/security/csrf/validatedSession.server";

vi.mock("~/services/dataListOptions/getDataListOptions", () => ({
  getDataListOptions: vi.fn(),
}));

vi.mock("~/services/logging", () => ({
  logWarning: vi.fn(),
}));

vi.mock("~/services/security/csrf/validatedSession.server", () => ({
  validateCsrfSessionFormless: vi.fn(),
}));

describe("createDataListLoader", () => {
  const request = new Request("https://a2j.forever/datalist");
  const TEST_TYPE = "airports";
  const loader = createDataListLoader(TEST_TYPE);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 if CSRF token is missing", async () => {
    vi.mocked(validateCsrfSessionFormless).mockResolvedValue(
      Result.err<never, string>("Invalid CSRF token"),
    );

    const thrown = await loader({ request } as LoaderFunctionArgs).catch(
      (error) => error,
    );

    expect(thrown).toBeInstanceOf(Response);
    expect(thrown.status).toBe(403);
    expect(logWarning).toHaveBeenCalledWith(
      `Error: request to ${TEST_TYPE} route without CSRF token`,
    );
    expect(getDataListOptions).not.toHaveBeenCalled();
  });

  it("returns JSON response with data if CSRF is valid", async () => {
    vi.mocked(validateCsrfSessionFormless).mockResolvedValue(
      Result.ok<Unit, never>(Unit),
    );

    const mockData = [{ value: "test-value", label: "Test Label" }];

    vi.mocked(getDataListOptions).mockReturnValue(mockData);

    const response = await loader({ request } as LoaderFunctionArgs);
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);

    const json = await response.json();

    expect(json).toEqual(mockData);
    expect(getDataListOptions).toHaveBeenCalledWith(TEST_TYPE);
    expect(logWarning).not.toHaveBeenCalled();
  });
});
