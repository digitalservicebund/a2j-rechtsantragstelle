// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import useAirlineDetails from "../useAirlineDetails";

describe("useAirlineDetails", () => {
  const mockFetch = vi.fn();

  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("should return airline details on a successful API response", async () => {
    const airlineIataCode = "LH";
    const mockResponse = { name: "Lufthansa" };

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 }),
    );

    const { result } = renderHook(() => useAirlineDetails(airlineIataCode));

    await waitFor(() => {
      expect(result.current).toEqual({ name: "Lufthansa" });
    });
  });

  it("should return an empty name when the API response is an error", async () => {
    const airlineIataCode = "INVALID";

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ name: "" }), { status: 200 }),
    );

    const { result } = renderHook(() => useAirlineDetails(airlineIataCode));

    await waitFor(() => {
      expect(result.current).toEqual({ name: "" });
    });
  });
});
