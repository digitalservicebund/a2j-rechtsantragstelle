import type { LoaderFunctionArgs } from "react-router";
import { createDataListLoader } from "~/services/dataListOptions/createDataListLoader";

vi.mock("~/services/dataListOptions/createDataListLoader", () => ({
  createDataListLoader: vi.fn(() => () => new Response()),
}));

describe("Airlines API", () => {
  it("uses airlines datalist loader", async () => {
    const { loader } = await import("../api.airlines.list");

    await loader({
      request: new Request("https://a2j.forever/airlines"),
    } as LoaderFunctionArgs);

    expect(createDataListLoader).toHaveBeenCalledWith("airlines");
  });
});
