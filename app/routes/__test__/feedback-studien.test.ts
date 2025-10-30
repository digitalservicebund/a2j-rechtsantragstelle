import { loader } from "~/routes/feedback-studien.$";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";

describe("feedback studien loader", () => {
  it("should redirect to /feedback", () => {
    const response = loader(
      mockRouteArgsFromRequest(new Request("https://test.com"), {
        ["*"]: "datenschutz",
      }),
    );
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/feedback/datenschutz");
  });
});
