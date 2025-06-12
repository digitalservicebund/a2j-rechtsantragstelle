import type { LoaderFunctionArgs } from "react-router";
import { createDataListLoader } from "~/services/dataListOptions/createDataListLoader";
import { loader } from "../api.airports.list";

vi.mock("~/services/dataListOptions/createDataListLoader", () => ({
  createDataListLoader: vi.fn(() => () => new Response()),
}));

describe("Airports API", () => {
  it("uses airports datalist loader", async () => {
    await loader({
      request: new Request("https://a2j.forever/airports"),
    } as LoaderFunctionArgs);

    expect(createDataListLoader).toHaveBeenCalledWith("airports");
  });
});
