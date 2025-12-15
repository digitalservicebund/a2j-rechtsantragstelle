import { loader } from "~/routes/hilfe";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";
import { assertResponse } from "./isResponse";

describe("/hilfe route", () => {
  it("should redirect to /kontakt page", async () => {
    const request = new Request("http://localhost:3000/hilfe");
    const mockArgs = mockRouteArgsFromRequest(request);
    const response = await loader(mockArgs);
    assertResponse(response);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/kontakt");
  });
});
