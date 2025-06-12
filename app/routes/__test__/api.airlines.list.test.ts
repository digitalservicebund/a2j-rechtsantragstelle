import type { LoaderFunctionArgs } from "react-router";
import { createDataListLoader } from "~/services/dataListOptions/createDataListLoader";
import { loader } from "../api.airlines.list";

vi.mock("~/services/dataListOptions/createDataListLoader", () => ({
  createDataListLoader: vi.fn(() => () => new Response()),
}));

describe("Airlines API", () => {
  it("uses airlines datalist loader", async () => {
    await loader({
      request: new Request("https://a2j.forever/airlines"),
    } as LoaderFunctionArgs);

    expect(createDataListLoader).toHaveBeenCalledWith("airlines");
  });
});
