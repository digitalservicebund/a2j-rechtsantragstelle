import { createServer, type Server } from "node:http";
import { loader } from "../xjustizDownloadLoader";
import { mockRouteArgsFromRequest } from "~/routes/__test__/mockRouteArgsFromRequest";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import * as pruneUserData from "~/services/flow/newFlowEngine/pruneUserData";
import type {
  InferredUserData,
  PageConfigMap,
} from "~/services/flow/newFlowEngine/types";

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

vi.mock("~/services/flow/pruner/pruner", () => ({
  pruneIrrelevantData: vi.fn().mockReturnValue({ prunedData: {} }),
}));

vi.spyOn(pruneUserData, "getPrunedUserDataFromSimulation").mockReturnValue(
  userData as unknown as InferredUserData<PageConfigMap>,
);

let server: Server;

beforeAll(async () => {
  server = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ xjustizNachricht: FAKE_XML }));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (address === null || typeof address === "string")
    throw new Error("Server konnte nicht gestartet werden");
  process.env.XJUSTIZ_TOOLS_BASE_URL = `http://127.0.0.1:${address.port}/`;
});

afterAll(async () => {
  delete process.env.XJUSTIZ_TOOLS_BASE_URL;
  await new Promise((resolve) => server.close(resolve));
});

describe("xjustizDownloadLoader", () => {
  it("liefert die XJustiz-Nachricht als Download aus", async () => {
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

  it("antwortet mit 501, wenn die XJustiz-Tools nicht konfiguriert sind", async () => {
    const baseUrl = process.env.XJUSTIZ_TOOLS_BASE_URL;
    delete process.env.XJUSTIZ_TOOLS_BASE_URL;

    const response = await loader(
      mockRouteArgsFromRequest(new Request(URL_UNDER_TEST)),
    );

    expect(response.status).toBe(501);
    process.env.XJUSTIZ_TOOLS_BASE_URL = baseUrl;
  });
});
