import { loader } from "~/routes/feedback-studien.$";

describe("feedback studien loader", () => {
  it("should redirect to /feedback", () => {
    const response = loader({
      params: { ["*"]: "datenschutz" },
      request: new Request("https://test.com"),
      context: {},
    });
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/feedback/datenschutz");
  });
});
