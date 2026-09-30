import type { LoaderFunctionArgs } from "react-router";
import { createDataListLoader } from "~/services/dataListOptions/createDataListLoader";

vi.mock("~/services/dataListOptions/createDataListLoader", () => ({
  createDataListLoader: vi.fn(() => () => new Response()),
}));

describe("Airports API", () => {
  it("uses airports datalist loader", async () => {
    const { loader } = await import("../api.airports.list");

    await loader({
      request: new Request("https://a2j.forever/airports"),
    } as LoaderFunctionArgs);

    expect(createDataListLoader).toHaveBeenCalledWith("airports");
  });
});
