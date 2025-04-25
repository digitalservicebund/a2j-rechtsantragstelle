import type { LoaderFunctionArgs } from "react-router";
import { loader } from "~/routes/hilfe";

describe("/hilfe route", () => {
  it("should redirect to /kontakt page", async () => {
    const request = new Request("http://localhost:3000/hilfe");
    const mockArgs: LoaderFunctionArgs = { request, params: {}, context: {} };
    const response = (await loader(mockArgs)) as Response;

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/kontakt");
  });
});
