import { describe, it, expect } from "vitest";
import { loader } from "~/routes/link.$";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";

vi.mock("~/services/analytics/customEvent");
const mockSendCustomAnalyticsEvent = vi.fn();
vi.mocked(sendCustomAnalyticsEvent).mockImplementation(
  mockSendCustomAnalyticsEvent,
);

describe("link loader", () => {
  it('should redirect "pkh" to the correct path', () => {
    const mockArgs = mockRouteArgsFromRequest(
      new Request("https://test.com/pkh"),
      { "*": "pkh" },
    );

    const response = loader(mockArgs);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "/prozesskostenhilfe/direktlink",
    );
  });

  it("should throw a 404 response when no params are provided", () => {
    const mockArgs = mockRouteArgsFromRequest(new Request("https://test.com"));

    expect(() => loader(mockArgs)).toThrowError();

    try {
      loader(mockArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).status).toBe(404);
    }
  });

  it("should throw a 404 response for an unknown site", () => {
    const mockArgs = mockRouteArgsFromRequest(
      new Request("https://test.com/unknown-site"),
      { "*": "unknown-site" },
    );

    expect(() => loader(mockArgs)).toThrowError();

    try {
      loader(mockArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).status).toBe(404);
    }
  });

  it("should capture a custom pageview event before redirect", () => {
    const mockArgs = mockRouteArgsFromRequest(
      new Request("https://test.com/pkh"),
      { "*": "pkh" },
    );

    loader(mockArgs);

    expect(mockSendCustomAnalyticsEvent).toHaveBeenCalledWith({
      request: mockArgs.request,
      eventName: "$pageview",
    });
  });
});
