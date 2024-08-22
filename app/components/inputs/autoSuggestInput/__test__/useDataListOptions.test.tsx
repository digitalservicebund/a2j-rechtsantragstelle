import { renderHook, waitFor } from "@testing-library/react";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import useDataListOptions from "../useDataListOptions";

function createFetchResponse(data: DataListOptions[], isOk: boolean) {
  return { json: () => new Promise((resolve) => resolve(data)), ok: isOk };
}

afterEach(() => {
  vi.restoreAllMocks(); // This clears all mocks after each test
});

describe("useDataListOptions", () => {
  it("should return empty array in case fetch does not return ok", async () => {
    global.fetch = vi.fn().mockResolvedValue(createFetchResponse([], false));

    const { result } = renderHook(() => useDataListOptions("airports"));

    await waitFor(() => expect(result.current).toEqual([]));
  });

  it("should return mock array in case fetch return ok", async () => {
    const mockDataListOptions: DataListOptions = {
      label: "label",
      value: "value",
    };

    global.fetch = vi
      .fn()
      .mockResolvedValue(createFetchResponse([mockDataListOptions], true));

    const { result } = renderHook(() => useDataListOptions("airports"));

    await waitFor(() =>
      expect(result.current).toStrictEqual([mockDataListOptions]),
    );
  });

  it("should return mock array in case fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Async error"));

    const { result } = renderHook(() => useDataListOptions("airports"));

    await waitFor(() => expect(result.current).toEqual([]));
  });
});
