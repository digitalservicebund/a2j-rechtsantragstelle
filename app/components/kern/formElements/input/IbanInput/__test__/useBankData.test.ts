/**
 * @jest-environment jsdom
 */

import { renderHook, waitFor } from "@testing-library/react";
import { type BankData } from "~/components/kern/formElements/input/IbanInput";
import { useBankData } from "~/components/kern/formElements/input/IbanInput/useBankData";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("useBankData", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return undefined if the api call fails", () => {
    mockFetch.mockImplementation(() => {
      throw new Error("API broken :(");
    });
    const { result } = renderHook(() => useBankData());
    expect(result.current).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should return the bank data if the api call succeeds", async () => {
    const mockBankData: BankData = {
      [12345678]: "Bank Name",
    };
    mockFetch.mockImplementation(() => ({
      ok: true,
      json: () => Promise.resolve(mockBankData),
    }));

    const { result } = renderHook(() => useBankData());
    await waitFor(() => {
      expect(result.current).toBe(mockBankData);
    });
  });
});
