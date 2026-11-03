import { Result } from "true-myth";
import { loader } from "../xjustizDownloadLoader";
import { mockRouteArgsFromRequest } from "~/routes/__test__/mockRouteArgsFromRequest";
import { geldEinklagenFormular } from "~/domains/geldEinklagen/formular";
import * as pruneUserData from "~/services/flow/flowEngine/pruneUserData";
import { logError } from "~/services/logging";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import type {
  InferredUserData,
  PageConfigMap,
} from "~/services/flow/flowEngine/types";

const FAKE_XML = '<?xml version="1.0"?><nachricht />';
const TOOLS_BASE_URL = "http://xjustiz-tools.test/";
const URL_UNDER_TEST =
  "https://mock-url.de/geld-einklagen/formular/download/xjustiz";

const userData = { klagendePersonVorname: "Max" };

vi.mock("~/services/logging", () => ({ logError: vi.fn() }));
vi.mock("~/services/isFeatureFlagEnabled.server", () => ({
  isFeatureFlagEnabled: vi.fn(),
}));

vi.spyOn(pruneUserData, "getPrunedUserDataFromSimulation").mockReturnValue(
  userData as unknown as InferredUserData<PageConfigMap>,
);

const xjustizFunctionSpy = vi.spyOn(
  geldEinklagenFormular.xjustizConfig,
  "xjustizFunction",
);

const callLoader = (url = URL_UNDER_TEST) =>
  loader(mockRouteArgsFromRequest(new Request(url)));

beforeEach(() => {
  vi.mocked(logError).mockClear();
  vi.mocked(isFeatureFlagEnabled).mockResolvedValue(true);
  vi.stubEnv("XJUSTIZ_TOOLS_BASE_URL", TOOLS_BASE_URL);
  xjustizFunctionSpy.mockReset().mockResolvedValue(Result.ok(FAKE_XML));
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("xjustizDownloadLoader", () => {
  it("returns the XJustiz message as a download", async () => {
    const response = await callLoader();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
    expect(response.headers.get("Content-Disposition")).toMatch(
      /^attachment; filename="Geld_Einklagen_Klage_.*\.xml"$/,
    );
    await expect(response.text()).resolves.toBe(FAKE_XML);
  });

  it("passes the pruned user data and the tools base url to the flow's xjustizFunction", async () => {
    await callLoader();

    expect(xjustizFunctionSpy).toHaveBeenCalledWith(userData, TOOLS_BASE_URL);
  });

  it("responds with 501 for a flow without xjustiz config", async () => {
    const response = await callLoader(
      "https://mock-url.de/beratungshilfe/antrag/download/xjustiz",
    );

    expect(response.status).toBe(501);
  });

  it("responds with 404 when the showXjustizDownload feature flag is disabled", async () => {
    vi.mocked(isFeatureFlagEnabled).mockResolvedValue(false);

    await expect(callLoader()).rejects.toMatchObject({ status: 404 });
    expect(isFeatureFlagEnabled).toHaveBeenCalledWith("showXjustizDownload");
  });

  it("responds with 501 when the XJustiz-Tools are not configured", async () => {
    vi.stubEnv("XJUSTIZ_TOOLS_BASE_URL", undefined);

    const response = await callLoader();

    expect(response.status).toBe(501);
    expect(xjustizFunctionSpy).not.toHaveBeenCalled();
  });

  it("responds with 422 and logs the issues for invalid user data", async () => {
    xjustizFunctionSpy.mockResolvedValue(
      Result.err({ reason: "invalidUserData", issues: ["vorname"] }),
    );

    const response = await callLoader();

    expect(response.status).toBe(422);
    expect(logError).toHaveBeenCalledWith(
      expect.objectContaining({ error: ["vorname"] }),
    );
  });

  it("responds with 409 when no responsible court can be determined", async () => {
    xjustizFunctionSpy.mockResolvedValue(
      Result.err({ reason: "noResponsibleCourt" }),
    );

    const response = await callLoader();

    expect(response.status).toBe(409);
  });

  it("responds with 502 and logs when the XJustiz-Tools fail", async () => {
    xjustizFunctionSpy.mockResolvedValue(
      Result.err({ reason: "xjustizToolsFailed" }),
    );

    const response = await callLoader();

    expect(response.status).toBe(502);
    expect(logError).toHaveBeenCalledOnce();
  });
});
