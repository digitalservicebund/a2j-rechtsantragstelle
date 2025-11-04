import { loader } from "~/routes/hilfe";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";

describe("/hilfe route", () => {
  it("should redirect to /kontakt page", async () => {
    const request = new Request("http://localhost:3000/hilfe");
    const mockArgs = mockRouteArgsFromRequest(request);
    const response = (await loader(mockArgs)) as Response;

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/kontakt");
  });
});
