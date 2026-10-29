import { createServer, type Server } from "node:http";
import { loader } from "../xjustizDownloadLoader";
import { mockRouteArgsFromRequest } from "~/routes/__test__/mockRouteArgsFromRequest";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import * as pruneUserData from "~/services/flow/flowEngine/pruneUserData";
import { logError } from "~/services/logging";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import type {
  InferredUserData,
  PageConfigMap,
} from "~/services/flow/flowEngine/types";

const FAKE_XML = '<?xml version="1.0"?><nachricht />';
const URL_UNDER_TEST =
  "https://mock-url.de/geld-einklagen/formular/download/xjustiz";

const userData = {
  ...userDataMock,
  abschnitte: [
    {
      beschreibung: "Die beklagte Partei hat die Miete nicht gezahlt.",
      personIdAsBeklagte: "",
      personIdAsKlagende: "",
    },
  ],
};

vi.mock("~/services/logging", () => ({ logError: vi.fn() }));
vi.mock("~/services/isFeatureFlagEnabled.server", () => ({
  isFeatureFlagEnabled: vi.fn(),
}));

const getPrunedUserDataSpy = vi
  .spyOn(pruneUserData, "getPrunedUserDataFromSimulation")
  .mockReturnValue(userData as unknown as InferredUserData<PageConfigMap>);

let server: Server;
let toolsStatus = 200;

beforeEach(() => {
  toolsStatus = 200;
  vi.mocked(logError).mockClear();
  vi.mocked(isFeatureFlagEnabled).mockResolvedValue(true);
});

beforeAll(async () => {
  server = createServer((_request, response) => {
    response.writeHead(toolsStatus, { "content-type": "application/json" });
    response.end(JSON.stringify({ xjustizNachricht: FAKE_XML }));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (address === null || typeof address === "string")
    throw new Error("Could not start server");
  process.env.XJUSTIZ_TOOLS_BASE_URL = `http://127.0.0.1:${address.port}/`;
});

afterAll(async () => {
  delete process.env.XJUSTIZ_TOOLS_BASE_URL;
  await new Promise((resolve) => server.close(resolve));
});

describe("xjustizDownloadLoader", () => {
  it("returns the XJustiz message as a download", async () => {
    const response = await loader(
      mockRouteArgsFromRequest(new Request(URL_UNDER_TEST)),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
    expect(response.headers.get("Content-Disposition")).toMatch(
      /^attachment; filename="Geld_Einklagen_Klage_.*\.xml"$/,
    );
    await expect(response.text()).resolves.toBe(FAKE_XML);
  });

  it("responds with 501 for a flow without xjustiz config", async () => {
    const response = await loader(
      mockRouteArgsFromRequest(
        new Request(
          "https://mock-url.de/beratungshilfe/antrag/download/xjustiz",
        ),
      ),
    );

    expect(response.status).toBe(501);
  });

  it("responds with 409 when no responsible court can be determined", async () => {
    getPrunedUserDataSpy.mockReturnValueOnce({
      ...userData,
      postleitzahlBeklagtePerson: "80331",
      postleitzahlSecondary: "80331",
    } as unknown as InferredUserData<PageConfigMap>);

    const response = await loader(
      mockRouteArgsFromRequest(new Request(URL_UNDER_TEST)),
    );

    expect(response.status).toBe(409);
  });

  it("responds with 404 when the showXjustizDownload feature flag is disabled", async () => {
    vi.mocked(isFeatureFlagEnabled).mockResolvedValue(false);

    await expect(
      loader(mockRouteArgsFromRequest(new Request(URL_UNDER_TEST))),
    ).rejects.toMatchObject({ status: 404 });
    expect(isFeatureFlagEnabled).toHaveBeenCalledWith("showXjustizDownload");
  });

  it("responds with 501 when the XJustiz-Tools are not configured", async () => {
    const baseUrl = process.env.XJUSTIZ_TOOLS_BASE_URL;
    delete process.env.XJUSTIZ_TOOLS_BASE_URL;

    try {
      const response = await loader(
        mockRouteArgsFromRequest(new Request(URL_UNDER_TEST)),
      );

      expect(response.status).toBe(501);
    } finally {
      process.env.XJUSTIZ_TOOLS_BASE_URL = baseUrl;
    }
  });

  it("responds with 422 and logs the issues for invalid user data", async () => {
    getPrunedUserDataSpy.mockReturnValueOnce({
      ...userData,
      klagendePersonVorname: "",
    } as unknown as InferredUserData<PageConfigMap>);

    const response = await loader(
      mockRouteArgsFromRequest(new Request(URL_UNDER_TEST)),
    );

    expect(response.status).toBe(422);
    expect(logError).toHaveBeenCalledOnce();
  });

  it("responds with 502 and logs when the XJustiz-Tools fail", async () => {
    toolsStatus = 400;

    const response = await loader(
      mockRouteArgsFromRequest(new Request(URL_UNDER_TEST)),
    );

    expect(response.status).toBe(502);
    expect(logError).toHaveBeenCalledOnce();
  });
});
