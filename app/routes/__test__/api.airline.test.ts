import type { LoaderFunctionArgs } from "@remix-run/node";
import { describe, it, expect } from "vitest";
import { getAirlineNameByIataCode } from "~/domains/fluggastrechte/services/airlines/getAirlineNameByIataCode";
import { loader } from "~/routes/api.airline.$iataCode";

vi.mock(
  "~/domains/fluggastrechte/services/airlines/getAirlineNameByIataCode",
  () => ({
    getAirlineNameByIataCode: vi.fn(),
  }),
);

describe("api.airline loader", () => {
  it("should return airline name for a valid iataCode", () => {
    const mockArgs: LoaderFunctionArgs = {
      params: { iataCode: "LH" },
      request: new Request("https://test.com/api/airline/LH"),
      context: {},
    };

    vi.mocked(getAirlineNameByIataCode).mockReturnValue("Lufthansa");

    const response = loader(mockArgs);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);

    return response.text().then((text) => {
      const data = JSON.parse(text);
      expect(data).toEqual({ name: "Lufthansa" });
    });
  });

  it("should return empty string if it is not found", () => {
    const mockArgs: LoaderFunctionArgs = {
      params: { iataCode: "XX" },
      request: new Request("https://test.com/api/airline/XX"),
      context: {},
    };

    vi.mocked(getAirlineNameByIataCode).mockReturnValue("");

    const response = loader(mockArgs);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);

    return response.text().then((text) => {
      const data = JSON.parse(text);
      expect(data).toEqual({ name: "" });
    });
  });
});
